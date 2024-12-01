import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import StockDetailsForm from "./pages/StockDetailsForm";
import StockDetails from "./pages/StockDetails";
import SellStockForm from "./pages/SellStockForm";
import AIExplained from "./pages/AIExplained";
import NewsSentimentPage from "./pages/NewsSentimentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/stock-details/:ticker"
          element={
            <PrivateRoute>
              <StockDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-stock-details"
          element={
            <PrivateRoute>
              <StockDetailsForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-explained"
          element={
            <PrivateRoute>
              <AIExplained />
            </PrivateRoute>
          }
        />
        <Route
          path="/news-sentiment"
          element={
            <PrivateRoute>
              <NewsSentimentPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/sell-stock"
          element={
            <PrivateRoute>
              <SellStockForm />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
