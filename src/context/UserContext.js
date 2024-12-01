import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { auth } from "../firebaseConfig";

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

// Initialize cache and timestamps for API data
const stockDataCache = {};
const cacheTimestamps = {};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to check if cached data is still valid
  const isCacheValid = (ticker) => {
    const timestamp = cacheTimestamps[ticker];
    if (!timestamp) return false;
    const now = Date.now();
    return now - timestamp < 600000; // 5 minutes cache duration
  };

//   Fetch stock data with caching
  const fetchStockData = async (ticker) => {
    try {
      if (stockDataCache[ticker] && isCacheValid(ticker)) {
        // console.log(`Serving ${ticker} data from cache`);
        return stockDataCache[ticker];
      }

      console.log(`Fetching new data for ${ticker}`);
      const priceResponse = await axios.post(`/api/stock/latest/${ticker}`);
      const sentimentResponse = await axios.post(`/api/stock/sentiment/${ticker}`);
      const intradayResponse = await axios.post(`/api/stock/intraday/${ticker}`);

      const data = {
        price: priceResponse.data,
        sentiment: sentimentResponse.data,
        intraday: intradayResponse.data,
      };

      stockDataCache[ticker] = data;
      cacheTimestamps[ticker] = Date.now();

      return data;
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      throw error;
    }
  };



  // Fetch portfolio and wealth data
  const fetchPortfolioAndWealth = async () => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      const wealthResponse = await axios.post(`/api/total-wealth/update`, {
        userId: currentUser.uid,
      });
      const totalWealth = wealthResponse.data.totalWealth || 0;
      const totalInvested = wealthResponse.data.totalInvested || 0;

      const portfolioResponse = await axios.get(`/api/portfolio/aggregate/${currentUser.uid}`);
      const portfolioData = portfolioResponse.data;

      return { portfolioData, totalWealth, totalInvested };
    } catch (error) {
      console.error("Error in fetchPortfolioAndWealth:", error);
      throw error;
    }
  };

  // Clear cache on logout
  const clearCache = () => {
    Object.keys(stockDataCache).forEach((key) => {
      delete stockDataCache[key];
      delete cacheTimestamps[key];
    });
    console.log("Cache cleared on logout");
  };

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (!user) {
        clearCache();
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <UserContext.Provider value={{ currentUser, fetchStockData, fetchPortfolioAndWealth }}>
      {children}
    </UserContext.Provider>
  );
};