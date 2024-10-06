// src/components/Chart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,    // For X-axis
  LinearScale,      // For Y-axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
  
const Chart = ({ data }) => {
  // Configure the chart data and settings
  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: "Open Price",
        data: data.map((d) => d.open),
        borderColor: "green",
        borderWidth: 1,
      },
      {
        label: "High Price",
        data: data.map((d) => d.high),
        borderColor: "red",
        borderWidth: 1,
      },
      {
        label: "Low Price",
        data: data.map((d) => d.low),
        borderColor: "blue",
        borderWidth: 1,
      },
      {
        label: "Close Price",
        data: data.map((d) => d.close),
        borderColor: "orange",
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default Chart;