import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/UserContext";

const SearchStock = ({ setPortfolio }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleSearch = async () => {
    try {
      // const response = await axios.get(`/api/search/${query}`);

      // Deployment
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/${query}`);

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const addToPortfolio = async (stock) => {
    navigate("/add-stock-details", { state: { stock, userId: currentUser.uid } });
  
    try {
      // Update total wealth after adding the stock
      // await axios.post(`/api/total-wealth/update`, { userId: currentUser.uid });

      // Deployment
      await axios.post(`${process.env.REACT_APP_API_URL}/api/total-wealth/update`, { userId: currentUser.uid });

      console.log("Total wealth updated after adding stock to portfolio.");
    } catch (error) {
      console.error("Error updating total wealth after adding stock:", error);
    }
  };
  

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setQuery("");
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <div className="flex border rounded w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Stocks"
          className="p-2 w-full rounded-l border-0 focus:ring-0"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-950 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded shadow max-h-60 overflow-y-auto z-10">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 flex justify-between items-center"
              onMouseEnter={() => setHoveredItem(result.ticker)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div>
                <p>
                  <strong>{result.ticker}</strong> - {result.name}
                </p>
                <p>{result.assetType}</p>
              </div>
              {hoveredItem === result.ticker && (
                <button
                  onClick={() => addToPortfolio(result)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchStock;