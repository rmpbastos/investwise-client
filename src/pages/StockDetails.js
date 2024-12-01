import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/UserContext";
import StockDetailsCard from "../components/StockDetailsCard";

const StockDetails = () => {
  const { currentUser } = useAuth();
  const { ticker } = useParams();
  const [stockDetails, setStockDetails] = useState([]);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        if (!currentUser) return; // Wait until currentUser is available

        // Fetch all stocks for the user
        const response = await axios.get(`/api/portfolio/${currentUser.uid}`);

        // Filter stocks that match the selected ticker
        const filteredStocks = response.data.filter(
          (stock) => stock.ticker === ticker
        );
        setStockDetails(filteredStocks); // Set the filtered stock data
      } catch (error) {
        console.error("Error fetching stock details:", error);
      }
    };

    fetchStockDetails();
  }, [ticker, currentUser]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-start justify-start flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">Details for {ticker}</h1>


        {/* <button className="bg-red-500 text-white py-2 px-4 rounded-full mt-4 hover:bg-red-600 transition">
          Sell Stock
        </button> */}


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {stockDetails.length > 0 ? (
            stockDetails.map((stock, index) => (
              // <StockCard key={index} stock={stock} />
              <StockDetailsCard key={index} stock={stock} />
            ))
          ) : (
            <p className="text-center">No details available for this stock</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StockDetails;
