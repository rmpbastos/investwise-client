import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/UserContext";
import SearchStock from "./SearchStock";
import axios from "axios";

const Header = ({ setPortfolio }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [totalWealth, setTotalWealth] = useState(0);
  const [isBlurred, setIsBlurred] = useState(true);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to toggle the blur effect
  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  // Fetching latest total wealth from the database instead of making api calls
  useEffect(() => {
    const fetchTotalWealth = async () => {
      if (!currentUser) return;

      try {
        const response = await axios.get(
          `/api/total-wealth/${currentUser.uid}`
        );

        if (response.data) {
          setTotalWealth(response.data.totalWealth);
        } else {
          console.log("Total wealth not found for this user.");
        }
      } catch (error) {
        console.error("Error fetching total wealth:", error);
      }
    };

    fetchTotalWealth();
  }, [currentUser]);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/icon_sm.png"
          alt="InvestWise Logo"
          className="h-9 w-9 mr-2"
        />
        <h1 className="text-xl font-bold text-gray-800">InvestWise</h1>
      </div>
      <nav className="flex-grow ml-8">
        <button
          className="px-4 py-2 border-2 bg-blue-950 hover:bg-blue-800 border-gray-300 rounded-lg text-gray-200 hover:text-gray-50 hover:border-gray-400 transition"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="px-4 py-2 border-2 bg-blue-950 hover:bg-blue-800 border-gray-300 rounded-lg text-gray-200 hover:text-gray-50 hover:border-gray-400 transition ml-4"
          onClick={() => navigate("/news-sentiment")}
        >
          Latest News
        </button>
        <button
          className="px-4 py-2 border-2 bg-blue-950 hover:bg-blue-800 border-gray-300 rounded-lg text-gray-200 hover:text-gray-50 hover:border-gray-400 transition ml-4"
          onClick={() => navigate("/ai-explained")}
        >
          AI Explained
        </button>
      </nav>
      <div className="flex items-center mr-4">
        <button
          className="ml-2 p-1 text-gray-500"
          onClick={toggleBlur}
          aria-label="Toggle Total Wealth Visibility"
        >
          {isBlurred ? (
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
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
        <p
          className={`text-lg font-bold text-gray-800 ${
            isBlurred ? "blur-sm" : ""
          }`}
        >
          Total Wealth: $
          {totalWealth.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      <div className="relative w-1/3 mr-4">
        <SearchStock setPortfolio={setPortfolio} />
      </div>
      <button
        onClick={handleLogout}
        className="bg-blue-950 text-white py-2 px-2 rounded-lg hover:bg-red-800 transition duration-300"
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
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </button>
    </header>
  );
};

export default Header;
