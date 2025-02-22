'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopCategories() {
  const data = {
    labels: ['كريستال', 'أحجار كريمة', 'ثريات', 'إكسسوارات'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          '#40E0D0',
          '#32B8B8',
          '#248F8F',
          '#166666',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
        },
      },
    },
    cutout: '70%',
  };

  return <Doughnut data={data} options={options} />;
} 