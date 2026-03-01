'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const PipelineFunnelChart = () => {
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: { display: false, color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#94a3b8' }
            },
            y: {
                grid: { display: false },
                ticks: { color: '#cbd5e1' }
            }
        },
        maintainAspectRatio: false,
    };

    const labels = ['Applied', 'Screened', 'Skill Assessment', 'Interview', 'Offer'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Candidates',
                data: [120, 85, 45, 12, 4],
                backgroundColor: [
                    'rgba(20, 184, 166, 0.2)',
                    'rgba(59, 130, 246, 0.3)',
                    'rgba(168, 85, 247, 0.4)',
                    'rgba(244, 63, 94, 0.5)',
                    'rgba(34, 197, 94, 0.6)',
                ],
                borderColor: [
                    'rgba(20, 184, 166, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(244, 63, 94, 1)',
                    'rgba(34, 197, 94, 1)',
                ],
            },
        ],
    };

    return <Bar options={options} data={data} />;
};
