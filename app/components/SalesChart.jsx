'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Dynamically import Chart.js to avoid SSR issues
const DynamicLine = dynamic(() => Promise.resolve(Line), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-6 rounded-lg shadow h-[400px] flex items-center justify-center">
      جاري التحميل...
    </div>
  ),
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart({ data }) {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'المبيعات',
        data: data.map(item => item.total),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'عدد الطلبات',
        data: data.map(item => item.count),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
        labels: {
          font: {
            family: 'Cairo'
          }
        }
      },
      title: {
        display: true,
        text: 'المبيعات في آخر 7 أيام',
        font: {
          family: 'Cairo',
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <DynamicLine data={chartData} options={options} />
    </div>
  );
} 