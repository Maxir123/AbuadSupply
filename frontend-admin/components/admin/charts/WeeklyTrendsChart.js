// components/admin/charts/WeeklyTrendsChart.jsx
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip, 
  Legend, 
  Filler, 
  Title 
} from "chart.js";

// Registering Filler for that modern "area" look
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler, Title);

const WeeklyTrendsChart = ({ trends }) => {
  const data = {
    labels: trends.map(item => item.date),
    datasets: [
      {
        label: "Sales (₦)",
        data: trends.map(item => item.sales),
        borderColor: "#008751", // Nigeria Flag Green
        backgroundColor: "rgba(0, 135, 81, 0.1)", // Light tint
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Orders",
        data: trends.map(item => item.orders),
        borderColor: "#FBBC05", // Nigerian Gold (Coat of Arms accent)
        backgroundColor: "rgba(251, 188, 5, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: { family: 'Inter, sans-serif', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label.includes('₦')) {
              label += `: ₦${context.parsed.y.toLocaleString('en-NG')}`;
            } else {
              label += `: ${context.parsed.y}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Weekly Performance</h2>
        <p className="text-sm text-gray-500">Real-time revenue & order flow (NGN)</p>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeeklyTrendsChart;
