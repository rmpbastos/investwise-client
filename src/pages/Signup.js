import { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await axios.post("/api/user-profile/create", {
        userId: user.uid,
        email: user.email,
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
      });

      await axios.post("/api/total-wealth/create", {
        userId: user.uid,
        totalWealth: 0,
        totalInvested: 0,
      });

      navigate("/login");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/email-already-in-use":
          setError("Email already in use.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Failed to sign up. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await axios.post("/api/user-profile/create", {
        userId: user.uid,
        email: user.email,
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
      });

      await axios.post("/api/total-wealth/create", {
        userId: user.uid,
        totalWealth: 0,
        totalInvested: 0,
      });

      navigate("/dashboard");
    } catch (error) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Text Section */}
      <div className="text-center lg:text-left lg:mr-12 mb-8 lg:mb-0 max-w-lg">
        {/* Logo and App Name Section */}
        <div className="flex items-center mb-6">
          <img
            src={require("../assets/logo/icon_sm.png")}
            alt="InvestWise Logo"
            className="w-16 h-16 mr-4"
          />
          <h2 className="text-4xl font-bold text-white">InvestWise</h2>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Join the Future of Investment
        </h1>
        <p className="text-xl text-white leading-relaxed">
          Sign up now and experience the next generation of portfolio management
          with AI at your side.
        </p>
      </div>

      {/* Signup Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-gray-100 text-green-500 p-3 rounded-lg hover:bg-gray-200 transition duration-300 mt-4"
        >
          Already have an account? Log In
        </button>
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition duration-300 mt-4"
        >
          <FcGoogle className="mr-2 text-xl" /> Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
