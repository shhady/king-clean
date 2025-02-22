'use client';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart() {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
    datasets: [
      {
        label: 'الأرباح',
        data: [30, 40, 45, 35, 40, 45, 35, 40, 45, 35, 40, 45, 35, 40],
        borderColor: '#40E0D0',
        backgroundColor: 'rgba(64, 224, 208, 0.1)',
        tension: 0.4,
      },
      {
        label: 'التكاليف',
        data: [20, 25, 30, 22, 28, 32, 24, 28, 32, 24, 28, 32, 24, 28],
        borderColor: '#ddd',
        backgroundColor: 'rgba(221, 221, 221, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return <Line data={data} options={options} />;
} 