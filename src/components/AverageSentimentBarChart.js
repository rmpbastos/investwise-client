import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const AverageSentimentBarChart = ({ averageTickerSentiment }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Ref to store the chart instance

  useEffect(() => {
    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Determine bar color based on sentiment value
    const barColor =
      averageTickerSentiment >= 0
        ? { background: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" }
        : { background: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)" };

    // Helper function to classify sentiment
    const classifySentiment = (value) => {
      if (value <= -0.35) return "Bearish";
      if (value > -0.35 && value <= -0.15) return "Somewhat Bearish";
      if (value > -0.15 && value < 0.15) return "Neutral";
      if (value >= 0.15 && value < 0.35) return "Somewhat Bullish";
      if (value >= 0.35) return "Bullish";
      return "Unknown"; // Fallback
    };

    // Create a new chart instance
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Average Sentiment"],
        datasets: [
          {
            data: [averageTickerSentiment],
            backgroundColor: barColor.background,
            borderColor: barColor.border,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Average Stock Sentiment",
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#333333",
            align: "center",
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = Number(tooltipItem.raw); // Ensure the value is a number
                const sentimentClass = classifySentiment(value);
                return `Value: ${value.toFixed(2)} (${sentimentClass})`;
              },
            },
          },
          legend: {
            display: false, // Hide the legend
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: -1,
            max: 1,
          },
        },
      },
    });

    // Clean up on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [averageTickerSentiment]); // Re-run whenever `averageTickerSentiment` changes

  return <canvas ref={chartRef} />;
};

export default AverageSentimentBarChart;
