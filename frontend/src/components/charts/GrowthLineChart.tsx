'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const GrowthLineChart = () => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#cbd5e1',
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        },
        maintainAspectRatio: false,
    };

    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Logic Depth',
                data: [65, 70, 72, 75, 80, 85, 90],
                borderColor: 'rgb(20, 184, 166)', // Teal
                backgroundColor: 'rgba(20, 184, 166, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Optimization',
                data: [60, 62, 65, 68, 70, 75, 78],
                borderColor: 'rgb(59, 130, 246)', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
            },
        ],
    };

    return <Line options={options} data={data} />;
};
