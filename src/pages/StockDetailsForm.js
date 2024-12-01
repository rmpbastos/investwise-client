import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const StockDetailsForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { stock, userId } = state;
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [brokerageFees, setBrokerageFees] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stockDetails = {
      userId,
      stock: {
        ticker: stock.ticker,
        name: stock.name,
        assetType: stock.assetType,
        purchaseDate,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        brokerageFees: parseFloat(brokerageFees),
      },
    };
  
    try {
      // Add stock details to portfolio
      await axios.post("/api/portfolio/addDetails", stockDetails);
      console.log("Stock details added to portfolio.");
  
      // Call the total wealth update route
      const updateResponse = await axios.post("/api/total-wealth/update", { userId });
  
      if (updateResponse.data.totalWealth !== undefined) {
        console.log("Total wealth updated successfully:", updateResponse.data.totalWealth);
      } else {
        console.log("Warning: Total wealth not updated due to missing data.");
      }
  
      // Navigate back to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding stock details or updating total wealth:", error);
  
      // Navigate to dashboard even if there's an error to avoid being stuck on this page
      navigate("/dashboard");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-lg max-w-md mx-auto mt-10"
      >
        <h2 className="text-2xl mb-4">
          Add Details for {stock.name} ({stock.ticker})
        </h2>
        <label className="block mb-2">Purchase Date</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          required
        />

        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          required
        />

        <label className="block mb-2">Purchase Price</label>
        <input
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          required
        />

        <label className="block mb-2">Brokerage Fees</label>
        <input
          type="number"
          value={brokerageFees}
          onChange={(e) => setBrokerageFees(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Add to Portfolio
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default StockDetailsForm;
