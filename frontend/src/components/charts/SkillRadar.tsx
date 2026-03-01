'use client';

import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface SkillRadarProps {
    data?: any;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ data }) => {
    const defaultData = {
        labels: ['Logic', 'Algorithm', 'System Design', 'Debugging', 'Optimization', 'Testing'],
        datasets: [
            {
                label: 'Current Skill DNA',
                data: [85, 70, 60, 90, 75, 80],
                backgroundColor: 'rgba(20, 184, 166, 0.2)', // Teal transparent
                borderColor: 'rgba(20, 184, 166, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(20, 184, 166, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(20, 184, 166, 1)',
            },
            {
                label: 'Class Average',
                data: [65, 59, 70, 81, 56, 55],
                backgroundColor: 'rgba(99, 102, 241, 0.1)', // Indigo transparent
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
            }
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                pointLabels: {
                    color: '#94a3b8', // slate-400
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    }
                },
                ticks: {
                    backdropColor: 'transparent',
                    color: 'transparent', // Hide tick numbers for clean look
                    display: false,
                }
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#cbd5e1', // slate-300
                }
            }
        },
        maintainAspectRatio: false,
    };

    return <Radar data={data || defaultData} options={options} />;
};
