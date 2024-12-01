import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SellStockForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userId, ticker, name, totalQuantity } = state;

  const [sellDate, setSellDate] = useState("");
  const [quantitySold, setQuantitySold] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [brokerageFees, setBrokerageFees] = useState(0);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantitySold > totalQuantity) {
      setError("You cannot sell more shares than you own.");
      return;
    }

    const saleData = {
      userId,
      ticker,
      sellDate,
      quantitySold,
      sellPrice: parseFloat(sellPrice),
      brokerageFees: parseFloat(brokerageFees),
    };

    try {
      const response = await axios.post("/api/portfolio/sell", saleData);
      console.log("Stock sale recorded successfully:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error recording stock sale:", error);
      setError("Failed to record stock sale. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="p-6 bg-white rounded shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-2xl mb-4">Sell Stock: {name} ({ticker})</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Sell Date</label>
          <input
            type="date"
            value={sellDate}
            onChange={(e) => setSellDate(e.target.value)}
            className="p-2 border rounded w-full mb-4"
            required
          />

          <label className="block mb-2">Quantity Sold</label>
          <input
            type="number"
            value={quantitySold}
            onChange={(e) => setQuantitySold(Number(e.target.value))}
            className="p-2 border rounded w-full mb-4"
            required
            min="1"
            max={totalQuantity}
          />

          <label className="block mb-2">Sell Price</label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="p-2 border rounded w-full mb-4"
            required
          />

          <label className="block mb-2">Brokerage Fees</label>
          <input
            type="number"
            value={brokerageFees}
            onChange={(e) => setBrokerageFees(e.target.value)}
            className="p-2 border rounded w-full mb-4"
            required
          />

          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Confirm Sale
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SellStockForm;
