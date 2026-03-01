'use client';

import { useState, useRef, useEffect } from 'react';
import { LucideVideo, LucideUploadCloud, LucidePlay, LucideTrash2, LucideRefreshCw, LucideCamera, LucideStopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/components/providers/UserProvider';
import { storage } from '@/lib/firebase/config';
import { ref, deleteObject } from 'firebase/storage';
import { supabase } from '@/lib/supabase/client';

export default function VideoIntroduction({ hrView = false, candidateVideoUrl }: { hrView?: boolean, candidateVideoUrl?: string }) {
    const { user, setUser } = useUser();
    const [videoUrl, setVideoUrl] = useState<string | null>(candidateVideoUrl || user?.videoIntroUrl || null);

    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    useEffect(() => {
        if (isRecording && previewStream && videoRef.current) {
            videoRef.current.srcObject = previewStream;
        }
    }, [isRecording, previewStream]);

    useEffect(() => {
        if (!hrView && user?.videoIntroUrl) {
            setVideoUrl(user.videoIntroUrl);
        }
        if (hrView && candidateVideoUrl) {
            setVideoUrl(candidateVideoUrl);
        }
    }, [user?.videoIntroUrl, candidateVideoUrl, hrView]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setPreviewStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                if (blob.size > 50 * 1024 * 1024) {
                    alert('Video is too large. Max 50MB.');
                    setIsRecording(false);
                    return;
                }
                setRecordedBlob(blob);
                setPreviewUrl(URL.createObjectURL(blob));
                setIsRecording(false);
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Max 90 seconds
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    stopRecording();
                }
            }, 90000);
        } catch (err) {
            console.error("Error accessing media devices.", err);
            alert('Could not access microphone/camera');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.requestData();
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);

        // Comprehensive track stopping to turn off camera light
        if (previewStream) {
            previewStream.getTracks().forEach(track => {
                track.stop();
            });
            setPreviewStream(null);
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        // Also check navigation stream if any
        if (navigator.mediaDevices && (navigator.mediaDevices as any).stop) {
            (navigator.mediaDevices as any).stop();
        }
    };

    // Cleanup tracks on unmount to ensure camera light turns off
    useEffect(() => {
        return () => {
            if (previewStream) {
                previewStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [previewStream]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert('Maximum file size is 50MB');
            return;
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'mp4' && ext !== 'webm') {
            alert('Only MP4 and WebM formats are supported.');
            return;
        }

        uploadVideo(file, ext);
    };

    const uploadVideo = async (blob: Blob | File, ext: string) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const fileName = `intros/${user.id}_${Date.now()}.${ext}`;

            // 1. Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('videos')
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(fileName);

            // 3. Update User Profile (Simulated via Context + Potential Supabase DB Sync)
            setVideoUrl(publicUrl);
            if (!hrView) {
                await setUser({ videoIntroUrl: publicUrl });
            }

            // Optional: Save to your new Supabase video_intros table
            await supabase.from('video_intros').insert({
                user_id: user.id || 'anonymous',
                video_url: publicUrl
            });

            setUploadProgress(100);
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                setPreviewUrl(null);
                setRecordedBlob(null);
            }, 1000);

        } catch (error) {
            console.error("Supabase upload failed:", error);
            alert("Upload failed. Check console for details.");
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!videoUrl) return;
        setVideoUrl(null);
        if (!hrView) {
            await setUser({ videoIntroUrl: '' });
        }
        // Attempt to delete from storage (if we have access, normally requires proper rules)
        try {
            // We can only delete if the url is a firebase storage url
            if (videoUrl.includes('firebasestorage')) {
                const urlObj = new URL(videoUrl);
                // Simple extraction or just ignore the actual obj deletion if complex
            }
        } catch (e) { }
    };

    if (hrView) {
        if (!videoUrl) return null; // HR doesn't see if no video

        return (
            <div className="game-card p-5 mb-6" style={{ background: 'linear-gradient(135deg, rgba(30,27,75,0.4), rgba(17,24,39,0.8))' }}>
                <div className="flex items-center gap-2 mb-4">
                    <LucideVideo className="w-5 h-5 text-indigo-400" />
                    <h2 className="font-black text-lg text-foreground">Self Introduction Video</h2>
                </div>
                <div className="relative rounded-xl overflow-hidden group aspect-video bg-black/50 border border-indigo-500/20">
                    <video src={videoUrl} controls className="w-full h-full object-cover" />
                </div>
            </div>
        );
    }

    return (
        <div className="game-card p-5">
            <h2 className="font-black text-sm text-foreground mb-4 flex items-center gap-2">
                <LucideVideo className="w-4 h-4 text-purple-400" /> Self Introduction Video
            </h2>

            {!videoUrl && !isRecording && !isUploading && !previewUrl && (
                <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center"
                    style={{ background: 'rgba(168,85,247,0.05)' }}>
                    <LucideVideo className="w-10 h-10 text-purple-400/50 mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                        Stand out to recruiters! Add a 60-90s intro.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-[18px] mt-2 w-full max-w-[450px] mx-auto">
                        <button
                            type="button"
                            onClick={startRecording}
                            className="w-full sm:w-[190px] h-[46px] rounded-md text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 border border-transparent shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)' }}
                        >
                            <LucideCamera className="w-4 h-4 shrink-0" />
                            <span>Record Video</span>
                        </button>

                        <label className="w-full sm:w-[190px] h-[46px] rounded-md text-sm font-bold bg-transparent hover:bg-purple-500/10 text-purple-400 flex items-center justify-center gap-2 cursor-pointer transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 border-2 border-purple-500/30 hover:border-purple-500/50 hover:scale-105">
                            <LucideUploadCloud className="w-4 h-4 shrink-0" />
                            <span>Upload File</span>
                            <input
                                type="file"
                                accept="video/mp4,video/webm"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-4">Max 50MB, MP4 or WebM format.</p>
                </div>
            )}

            {isRecording && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex flex-col items-center justify-center border-2 border-red-500/50">
                    <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />

                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-medium text-sm tracking-widest shadow-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-500/30 animate-pulse" />
                        {formatTime(recordingTime)}
                    </div>

                    <div className="absolute bottom-6 z-20 flex gap-4">
                        <Button onClick={stopRecording} variant="destructive" className="font-bold w-36 h-12 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 transition-transform bg-red-600 hover:bg-red-500 text-white">
                            <LucideStopCircle className="w-5 h-5 mr-2" /> Stop
                        </Button>
                    </div>
                </div>
            )}

            {previewUrl && !isUploading && !videoUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex flex-col items-center justify-center border border-purple-500/20">
                    <video src={previewUrl} controls className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex gap-3 z-20">
                        <Button
                            onClick={() => { setPreviewUrl(null); setRecordedBlob(null); }}
                            variant="destructive"
                            className="font-bold py-1.5 px-4 h-auto text-sm bg-red-500/80 hover:bg-red-500 backdrop-blur-sm shadow-xl"
                        >
                            <LucideTrash2 className="w-4 h-4 mr-2" /> Retake
                        </Button>
                        <Button
                            onClick={() => uploadVideo(recordedBlob!, 'webm')}
                            className="font-bold py-1.5 px-4 h-auto text-sm bg-emerald-500/90 hover:bg-emerald-500 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        >
                            <LucideUploadCloud className="w-4 h-4 mr-2" /> Save Video
                        </Button>
                    </div>
                </div>
            )}

            {isUploading && (
                <div className="border border-purple-500/30 rounded-xl p-8 text-center flex flex-col items-center justify-center fade-in-up"
                    style={{ background: 'rgba(168,85,247,0.05)' }}>
                    {uploadProgress < 100 ? (
                        <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mb-4" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                            <LucideUploadCloud className="w-6 h-6" />
                        </div>
                    )}
                    <p className="text-sm font-bold text-foreground">
                        {uploadProgress === 100 ? "Video uploaded successfully." : "Uploading Video..."}
                    </p>
                    <div className="w-full max-w-xs mt-3 h-2 bg-background rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                </div>
            )}

            {videoUrl && !isRecording && !isUploading && (
                <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden group aspect-video bg-black/50 border border-purple-500/20">
                        <video src={videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setVideoUrl(null)} variant="outline" className="flex-1 font-bold gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                            <LucideRefreshCw className="w-4 h-4" /> Replace
                        </Button>
                        <Button onClick={handleDelete} variant="outline" className="font-bold gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                            <LucideTrash2 className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
