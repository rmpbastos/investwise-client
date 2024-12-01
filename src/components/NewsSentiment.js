import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";

const getFreshnessCategory = (timePublishedUTC) => {
  const publishedDate = parseISO(timePublishedUTC); // Parse the ISO timestamp
  const differenceInMs = Date.now() - publishedDate.getTime(); // Time difference in milliseconds

  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  const oneWeek = 7 * oneDay;

  if (differenceInMs <= oneHour) {
    return { category: "Breaking News! (last hour)", color: "text-green-600" };
  } else if (differenceInMs <= oneDay) {
    return { category: "Fresh (within 24h)", color: "text-yellow-600" };
  } else if (differenceInMs <= oneWeek) {
    return {
      category: "Somewhat Fresh (within 7 days)",
      color: "text-blue-600",
    };
  } else {
    return { category: "Stale (more than 7 days)", color: "text-gray-500" };
  }
};

const NewsSentiment = ({ userId }) => {
  const [newsByTicker, setNewsByTicker] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioAndNews = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch portfolio to get tickers
        // const portfolioResponse = await axios.get(`/api/portfolio/${userId}`);

        // Deployment
        const portfolioResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/portfolio/${userId}`);



        const portfolioStocks = portfolioResponse.data;

        const tickers = portfolioStocks.map((stock) => stock.ticker);

        if (tickers.length === 0) {
          setError("No stocks found in the portfolio.");
          setLoading(false);
          return;
        }

        // Step 2: Fetch news sentiment for each ticker
        // const newsResponse = await axios.post("/api/news-sentiment", {
        //   tickers,
        // });

        // Deployment
        const newsResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/news-sentiment`, { tickers });


        const newsByTickerRaw = newsResponse.data;

        // Limit each ticker to 10 articles
        const limitedNewsByTicker = {};
        Object.keys(newsByTickerRaw).forEach((ticker) => {
          limitedNewsByTicker[ticker] = newsByTickerRaw[ticker].slice(0, 10);
        });

        setNewsByTicker(limitedNewsByTicker);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch news sentiment data.");
        console.error("Error fetching news sentiment:", err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchPortfolioAndNews();
    }
  }, [userId]);

  const tickers = Object.keys(newsByTicker);

  if (loading) return <p>Loading news sentiment...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (tickers.length === 0)
    return <p>No news available for the selected tickers.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-7xl mx-auto">
      {/* Render buttons for each ticker */}
      <div className="flex flex-wrap gap-4 mb-6">
        {tickers.map((ticker) => (
          <button
            key={ticker}
            onClick={() =>
              document
                .getElementById(ticker)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-blue-950 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
          >
            {ticker}
          </button>
        ))}
      </div>

      {/* Render the news content */}
      {tickers.map((ticker) => (
        <div
          key={ticker}
          id={ticker}
          className="mb-10 p-6 bg-gray-50 rounded-lg shadow-sm"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            News for {ticker}
          </h3>
          <ul>
            {newsByTicker[ticker].map((article, index) => (
              <li
                key={index}
                className="border-b border-blue-900 pb-6 mb-6 last:border-b-0 last:pb-0"
              >
                <h4 className="text-lg font-semibold text-blue-600">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                </h4>
                <p className="text-gray-600">{article.summary}</p>

                <p className="text-sm text-gray-500 mt-2">
                  Sentiment:{" "}
                  <span
                    className={`font-bold ${
                      article.sentiment_label === "Bullish"
                        ? "text-green-600"
                        : article.sentiment_label === "Bearish"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {article.sentiment_label}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Freshness:{" "}
                  <span
                    className={`font-bold ${
                      getFreshnessCategory(article.published_date).color
                    }`}
                  >
                    {getFreshnessCategory(article.published_date).category}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NewsSentiment;
