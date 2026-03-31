import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

export function TrendChart({ last7DaysData }) {
  const labels = last7DaysData.map((d) => format(parseISO(d.date), "MMM dd"));
  const data = last7DaysData.map((d) => d.score);

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Wellness Score",
        data,
        borderColor: "#000",
        backgroundColor: "rgba(59, 130, 246, 0.4)", // Blue accent
        borderWidth: 4,
        pointBackgroundColor: "#FACC15",
        pointBorderColor: "#000",
        pointBorderWidth: 4,
        pointRadius: 8,
        pointHoverRadius: 10,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(0,0,0,0.1)", lineWidth: 2 },
        border: { color: "#000", width: 4 },
        ticks: { font: { family: "'Inter', sans-serif", weight: "bold", size: 14 }, color: "#000" }
      },
      x: {
        grid: { color: "rgba(0,0,0,0.1)", lineWidth: 2 },
        border: { color: "#000", width: 4 },
        ticks: { font: { family: "'Inter', sans-serif", weight: "bold", size: 14 }, color: "#000" }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        titleFont: { size: 16, weight: "black" },
        bodyFont: { size: 16, weight: "bold" },
        borderColor: "#000",
        borderWidth: 4,
        cornerRadius: 0,
        displayColors: false,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="neobrutalism-card mt-12 p-6 md:p-8"
    >
      <h3 className="text-2xl font-black uppercase mb-6">Weekly Trend</h3>
      <div className="w-full relative" style={{ height: "300px" }}>
        <Line options={options} data={chartData} />
      </div>
    </motion.div>
  );
}
