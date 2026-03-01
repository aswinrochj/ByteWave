'use client';

import React, { useEffect, useRef } from 'react';

const WaveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles: { x: number; y: number; speed: number; offset: number }[] = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speed: Math.random() * 0.5 + 0.2,
                offset: Math.random() * 100,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0F172A'); // Deep Navy
            gradient.addColorStop(1, '#14B8A6'); // Electric Teal
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Waves
            ctx.lineWidth = 1;

            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - i * 0.01})`;

                let yBase = height / 2 + (i * 40);

                ctx.moveTo(0, yBase);

                for (let x = 0; x <= width; x += 10) {
                    const y = yBase + Math.sin(x * 0.005 + Date.now() * 0.0005 + i) * (50 + i * 10);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Draw Particles/Nodes
            ctx.fillStyle = 'rgba(20, 184, 166, 0.4)';
            particles.forEach(p => {
                p.y -= p.speed;
                p.x += Math.sin(p.y * 0.01 + p.offset) * 0.5;

                if (p.y < 0) p.y = height;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
            }}
        />
    );
};

export default WaveBackground;
