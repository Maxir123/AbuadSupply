// components/admin/charts/WeeklyTrendsChart.jsx
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const WeeklyTrendsChart = ({ trends }) => {
  const data = {
    labels: trends.map(item => item.date),
    datasets: [
      {
        label: "Sales ($)",
        data: trends.map(item => item.sales),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
      },
      {
        label: "Orders",
        data: trends.map(item => item.orders),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-md font-semibold mb-4">Weekly Sales & Orders Trend</h2>
      <Line data={data} />
    </div>
  );
};

export default WeeklyTrendsChart;
