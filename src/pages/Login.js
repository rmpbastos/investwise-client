import { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        default:
          setError("Failed to log in. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
{/* Text Section */}
<div className="text-center lg:text-left lg:mr-12 mb-8 lg:mb-0 max-w-lg">
  {/* Logo and App Name Section */}
  <div className="flex items-center mb-6">
    <img src={require("../assets/logo/icon_sm.png")} alt="InvestWise Logo" className="w-16 h-16 mr-4" />
    <h2 className="text-4xl font-bold text-white">InvestWise</h2>
  </div>
  <h1 className="text-5xl font-extrabold text-white mb-4">
    Welcome Back!
  </h1>
  <p className="text-xl text-white leading-relaxed">
    Continue where you left off. Log in now and start managing your investments and achieving your goals.
  </p>
</div>


      {/* Login Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Log In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition duration-300 mb-4"
        >
          <FcGoogle className="mr-2 text-xl" /> Log in with Google
        </button>
        <div className="text-center text-gray-500 my-4">OR</div>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-full bg-gray-100 text-indigo-500 p-3 rounded-lg hover:bg-gray-200 transition duration-300 mt-4"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;




