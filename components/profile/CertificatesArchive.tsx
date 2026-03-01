'use client';

import { useState } from 'react';
import { LucideAward, LucidePlus, LucideExternalLink, LucideDownload, LucideCheckCircle, LucideUploadCloud, LucideTrash2, LucideX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/components/providers/UserProvider';
import { Certificate } from '@/types/user';
import { supabase } from '@/lib/supabase/client';

export default function CertificatesArchive({ hrView = false, candidateCerts = [] }: { hrView?: boolean, candidateCerts?: Certificate[] }) {
    const { user, setUser } = useUser();
    const certs = hrView ? candidateCerts : (user.certificates || []);

    const [isAdding, setIsAdding] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [issuer, setIssuer] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [fileProgress, setFileProgress] = useState(0);

    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Maximum file size is 5MB');
            return;
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '')) {
            alert('Only PDF, JPG, and PNG are supported.');
            return;
        }

        setUploading(true);
        setFileProgress(10); // Visual cue

        try {
            const fileName = `certs/${user.id}_${Date.now()}.${ext}`;

            // 1. Upload to Supabase 'certs' bucket
            const { data, error } = await supabase.storage
                .from('certs')
                .upload(fileName, file);

            if (error) throw error;

            setFileProgress(90);

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('certs')
                .getPublicUrl(fileName);

            setFileUrl(publicUrl);
            setFileProgress(100);
            setTimeout(() => {
                setUploading(false);
                setFileProgress(0);
            }, 500);

        } catch (error) {
            console.error("Supabase certification upload failed:", error);
            alert('File upload failed.');
            setUploading(false);
        }
    };

    const handleAddCertificate = async () => {
        if (!title || !issuer || !issueDate || !fileUrl) {
            alert('Please fill all required fields and upload a file.');
            return;
        }

        if (certs.length >= 20) {
            alert('You can only upload a maximum of 20 certificates.');
            return;
        }

        const newCert: Certificate = {
            id: Date.now().toString(),
            title,
            issuer,
            issueDate,
            description,
            verificationLink: link,
            fileUrl,
            badgeType: link ? 'Verified' : 'Self Uploaded'
        };

        try {
            // 1. Save to Supabase DB 'certifications' table
            const { error: dbError } = await supabase.from('certifications').insert({
                user_id: user.id || 'anonymous',
                title,
                issuer,
                issue_date: issueDate,
                description,
                file_url: fileUrl,
                verification_link: link
            });

            if (dbError) throw dbError;

            // 2. Update local state via user context
            const updatedCerts = [...certs, newCert];
            await setUser({ certificates: updatedCerts });

            setIsAdding(false);
            setTitle('');
            setIssuer('');
            setIssueDate('');
            setDescription('');
            setLink('');
            setFileUrl('');
        } catch (error) {
            console.error("Failed to save certification to database:", error);
            alert("Record save failed. File uploaded but database record not created.");
        }
    };

    const handleDelete = async (id: string) => {
        const updatedCerts = certs.filter(c => c.id !== id);
        await setUser({ certificates: updatedCerts });
    };

    const getBadgeStyle = (type: Certificate['badgeType']) => {
        switch (type) {
            case 'Self Uploaded': return { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)', icon: LucideUploadCloud };
            case 'Verified': return { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.3)', icon: LucideCheckCircle };
            case 'ByteWave Earned': return { bg: 'rgba(168,85,247,0.1)', text: '#c084fc', border: 'rgba(168,85,247,0.3)', icon: LucideAward };
            default: return { bg: 'inherit', text: 'inherit', border: 'inherit', icon: LucideAward };
        }
    };

    return (
        <div className={`game-card p-5 ${hrView ? 'mb-6' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-sm text-foreground flex items-center gap-2">
                    <LucideAward className="w-4 h-4 text-purple-400" /> Certificates & Achievements
                </h2>
                {!hrView && !isAdding && (
                    <Button onClick={() => setIsAdding(true)} variant="outline" size="sm" className="font-bold gap-1 text-purple-400 border-purple-500/30 hover:bg-purple-500/10">
                        <LucidePlus className="w-3.5 h-3.5" /> Add New
                    </Button>
                )}
            </div>

            {/* Upload Form */}
            {isAdding && (
                <div className="p-4 rounded-xl border border-purple-500/30 mb-6 space-y-4" style={{ background: 'rgba(168,85,247,0.05)' }}>
                    <div className="flex justify-between items-center border-b border-border pb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-purple-400">Add Certificate</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-white"><LucideX className="w-4 h-4" /></Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Certificate Title *" value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent border-purple-500/20 text-sm focus-visible:ring-purple-500/50" />
                        <Input placeholder="Issuing Organization *" value={issuer} onChange={e => setIssuer(e.target.value)} className="bg-transparent border-purple-500/20 text-sm focus-visible:ring-purple-500/50" />
                        <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="bg-transparent border-purple-500/20 text-sm focus-visible:ring-purple-500/50" />
                        <Input placeholder="Verification Link (Optional)" value={link} onChange={e => setLink(e.target.value)} className="bg-transparent border-purple-500/20 text-sm focus-visible:ring-purple-500/50" />
                        <Input placeholder="Short Description (Optional)" value={description} onChange={e => setDescription(e.target.value)} className="bg-transparent border-purple-500/20 text-sm md:col-span-2 focus-visible:ring-purple-500/50" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={uploading} />
                            <Button variant="outline" className="font-bold text-xs gap-2 border-purple-500/30 text-purple-400">
                                <LucideUploadCloud className="w-4 h-4" /> {fileUrl ? 'File Uploaded' : 'Upload File (PDF/JPG)'}
                            </Button>
                        </div>
                        {uploading && <span className="text-xs text-purple-400 animate-pulse">Uploading {Math.round(fileProgress)}%...</span>}
                    </div>

                    <Button onClick={handleAddCertificate} disabled={uploading || !fileUrl || !title || !issuer || !issueDate} className="w-full font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white mt-2">
                        Save Certificate
                    </Button>
                </div>
            )}

            {/* Grid Display */}
            {certs.length === 0 && !isAdding ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    <LucideAward className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No certificates added yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certs.map(cert => {
                        const style = getBadgeStyle(cert.badgeType);
                        const BadgeIcon = style.icon;
                        return (
                            <div key={cert.id} className="relative p-4 rounded-xl transition-all border group"
                                style={{ background: 'var(--secondary)', borderColor: 'var(--border)' }}>
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold"
                                    style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                                    <BadgeIcon className="w-3 h-3" /> {cert.badgeType}
                                </div>

                                <h3 className="font-black text-sm text-foreground pr-24 line-clamp-1">{cert.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                    <span className="font-medium text-purple-400">{cert.issuer}</span> • <span>{cert.issueDate}</span>
                                </p>
                                {cert.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cert.description}</p>}

                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedCert(cert)} className="flex-1 text-[10px] font-bold h-7 border-purple-500/20 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10">
                                        View Detail
                                    </Button>
                                    {!hrView && (
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)} className="w-7 h-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                                            <LucideTrash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Modal */}
            {selectedCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-background rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)] overflow-hidden">
                        <div className="p-4 border-b border-border flex justify-between items-center" style={{ background: 'rgba(168,85,247,0.05)' }}>
                            <h3 className="font-black text-foreground">Certificate Details</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCert(null)} className="h-8 w-8 p-0 rounded-lg hover:bg-white/5"><LucideX className="w-4 h-4" /></Button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className="text-xl font-black text-purple-400">{selectedCert.title}</h2>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Issued by <span className="text-foreground">{selectedCert.issuer}</span> on {selectedCert.issueDate}</p>
                            </div>

                            {selectedCert.description && (
                                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedCert.description}</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-2">
                                <a href={selectedCert.fileUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                                    <LucideDownload className="w-4 h-4" /> Download / View File
                                </a>
                                {selectedCert.verificationLink && (
                                    <a href={selectedCert.verificationLink.startsWith('http') ? selectedCert.verificationLink : `https://${selectedCert.verificationLink}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors">
                                        <LucideExternalLink className="w-4 h-4" /> Verify
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
