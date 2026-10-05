// src/components/RevenueChart.jsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from "prop-types";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ totalRevenue = 0 }) => {
  const revenueData = [totalRevenue];

  const data = {
    labels: ['Completed orders'],
    datasets: [
      {
        label: 'Revenue (USD)',
        data: revenueData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', 
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Completed Order Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Completed Order Revenue</h2>
      <div className='hidden md:block'>
      <Bar data={data} options={options} className='' />
      </div>
    </div>
  );
};

RevenueChart.propTypes = {
  totalRevenue: PropTypes.number,
};

export default RevenueChart;