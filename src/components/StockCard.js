import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const StockCard = ({ stock, onClick }) => {
  const { fetchStockData } = useAuth();
  const {
    name,
    ticker,
    assetType,
    totalQuantity,
    averagePurchasePrice,
    totalCost,
  } = stock;
  const navigate = useNavigate();

  // State for latest prices, intraday price, sentiment, and prediction
  const [latestPrice, setLatestPrice] = useState({});
  const [intradayPrice, setIntradayPrice] = useState(null);
  const [overallSentiment, setOverallSentiment] = useState(0);
  const [tickerSentiment, setTickerSentiment] = useState(0);
  const [prediction, setPrediction] = useState(null);

  // Fetch all stock data (prices, sentiment) using fetchStockData from UserContext
  const fetchAllData = useCallback(async () => {
    try {
      const stockData = await fetchStockData(ticker);
      if (stockData) {
        const { price, intraday, sentiment } = stockData;

        setLatestPrice(price || {});
        setIntradayPrice(intraday?.close || null);
        setOverallSentiment(sentiment?.overallSentimentScore || 0);
        setTickerSentiment(sentiment?.tickerSentimentScore || 0);
      }
    } catch (err) {
      console.error(`Error fetching data for ${ticker}:`, err);
      setLatestPrice({});
      setIntradayPrice(null);
      setOverallSentiment(0);
      setTickerSentiment(0);
    }
  }, [ticker, fetchStockData]);

  const fetchPrediction = useCallback(async () => {
    try {
      const predictionPayload = {
        overall_sentiment_score: parseFloat(overallSentiment),
        ticker_sentiment_score: parseFloat(tickerSentiment),
        open: parseFloat(latestPrice.open),
        high: parseFloat(latestPrice.high),
        low: parseFloat(latestPrice.low),
        close: parseFloat(latestPrice.close),
        adjusted_close: parseFloat(latestPrice.adjusted_close),
        volume: parseInt(latestPrice.volume),
        dividend_amount: parseFloat(latestPrice.dividend_amount),
        split_coefficient: parseFloat(latestPrice.split_coefficient),
      };

      console.log(
        `Sending prediction request for ${ticker}:`,
        predictionPayload
      );

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionPayload),
      });

      const data = await response.json();
      console.log(`Prediction result for ${ticker}:`, data);

      setPrediction(data.prediction);
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setPrediction("Error");
    }
  }, [ticker, overallSentiment, tickerSentiment, latestPrice]);

  // Effect to fetch all data when the component mounts
  useEffect(() => {
    if (ticker) {
      fetchAllData();
    }
  }, [ticker, fetchAllData]);

  useEffect(() => {
    // Ensure required data is available before calling prediction
    if (
      overallSentiment !== null &&
      tickerSentiment !== null &&
      latestPrice.close !== null &&
      !isNaN(latestPrice.close)
    ) {
      fetchPrediction();
    }
  }, [overallSentiment, tickerSentiment, latestPrice, fetchPrediction]);

  // Calculate stock value, profit/loss, and current total value
  const currentPrice = intradayPrice || latestPrice.close || 0;
  const stockValue = totalQuantity * currentPrice;
  const profitLoss = stockValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  // Format numbers with thousand separators
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };


  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 border-t-4 ${
        profitLoss >= 0 ? "border-green-500" : "border-red-500"
      } cursor-pointer hover:shadow-lg transition-transform`}
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-4">
        {name} ({ticker})
      </h3>
      <p
        className={`text-2xl font-semibold ${
          profitLoss >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {formatCurrency(profitLoss)} ({profitLossPercent.toFixed(2)}%)
      </p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p>
            <strong>Latest Price:</strong> {formatCurrency(currentPrice)}
          </p>
          <p>
            <strong>Total Quantity:</strong>{" "}
            {totalQuantity.toLocaleString("en-US")}
          </p>
        </div>
        <div>
          <p>
            <strong>Avg. Price:</strong> {formatCurrency(averagePurchasePrice)}
          </p>
          <p>
            <strong>Total Cost:</strong> {formatCurrency(totalCost)}
          </p>
        </div>
      </div>

      {/* Sentiment Analysis Section */}
      <h4 className="text-sm font-semibold mt-4 text-gray-700">
        Sentiment Analysis:
      </h4>

      <p id={`news-tooltip-${ticker}`} className="cursor-help">
        <strong>News Sentiment:</strong>{" "}
        <span
          className={`font-semibold ${
            overallSentiment >= 0.15
              ? "text-green-600"
              : overallSentiment > -0.15
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {overallSentiment.toFixed(2)} (
          {overallSentiment >= 0.35
            ? "Bullish"
            : overallSentiment > 0.15
            ? "Somewhat Bullish"
            : overallSentiment > -0.15
            ? "Neutral"
            : overallSentiment > -0.35
            ? "Somewhat Bearish"
            : "Bearish"}
          )
        </span>
      </p>
      <ReactTooltip
        anchorId={`news-tooltip-${ticker}`}
        content="Sentiment derived from news related to this stock."
      />

      <p id={`stock-tooltip-${ticker}`} className="cursor-help">
        <strong>Stock Sentiment:</strong>{" "}
        <span
          className={`font-semibold ${
            tickerSentiment >= 0.15
              ? "text-green-600"
              : tickerSentiment > -0.15
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {tickerSentiment.toFixed(2)} (
          {tickerSentiment >= 0.35
            ? "Bullish"
            : tickerSentiment > 0.15
            ? "Somewhat Bullish"
            : tickerSentiment > -0.15
            ? "Neutral"
            : tickerSentiment > -0.35
            ? "Somewhat Bearish"
            : "Bearish"}
          )
        </span>
      </p>
      <ReactTooltip
        anchorId={`stock-tooltip-${ticker}`}
        content="Sentiment based on stock market signals."
      />

      <br></br>

      <div className="flex items-center mt-4">
        <strong>Predicted Price Movement:</strong>
        {prediction === "Increase" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 ml-2 text-green-500"
              data-tooltip-id="prediction-tooltip"
              data-tooltip-content="InvestWise's Machine Learning model predicts a positive trend for this stock price."
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 18.75L12 11.25l7.5 7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75L12 5.25l7.5 7.5"
              />
            </svg>
            <ReactTooltip id="prediction-tooltip" />
          </>
        ) : prediction === "Decrease" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 ml-2 text-red-500"
              data-tooltip-id="prediction-tooltip"
              data-tooltip-content="InvestWise's Machine Learning model predicts a negative trend for this stock price."
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 5.25L12 12.75l7.5-7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 11.25L12 18.75l7.5-7.5"
              />
            </svg>
            <ReactTooltip id="prediction-tooltip" />
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 ml-2 text-gray-500"
              data-tooltip-id="prediction-tooltip"
              data-tooltip-content="InvestWise's Machine Learning model predicts no significant movement for this stock price."
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <ReactTooltip id="prediction-tooltip" />
          </>
        )}
      </div>

      <br></br>

      {/* <button
        className="bg-red-500 text-white py-2 px-4 rounded-full mt-4 hover:bg-red-600 transition"
        onClick={handleSellClick}
      >
        Sell Stock
      </button> */}

    </div>
  );
};

export default StockCard;
