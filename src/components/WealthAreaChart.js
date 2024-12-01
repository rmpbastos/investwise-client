import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useAuth } from "../context/UserContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WealthAreaChart = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchWealthHistory = async () => {
      try {
        const response = await axios.get(
          `/api/total-wealth/history/${currentUser.uid}`
        );
        const wealthData = response.data;

        // Extract labels, total wealth, and total invested
        const labels = wealthData.map((entry) =>
          new Date(entry.calculationDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })
        );
        const totalWealthData = wealthData.map((entry) => entry.totalWealth);
        const totalInvestedData = wealthData.map((entry) => entry.totalInvested);

        // Prepare data for the chart
        const data = {
          labels,
          datasets: [
            {
              label: "Total Wealth",
              data: totalWealthData,
              fill: true,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
            {
              label: "Total Invested",
              data: totalInvestedData,
              fill: true,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error("Error fetching wealth history:", error);
      }
    };

    if (currentUser) {
      fetchWealthHistory();
    }
  }, [currentUser]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Wealth and Investment History",
        align: "center",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: "#333333",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-80">
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default WealthAreaChart;
