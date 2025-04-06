import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [id, setId] = useState(""); // Changed regNo to id
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!id || !password) { // Changed regNo to id
      setError("Both fields are required!");
      return;
    }

    
    alert(`Login successful! Welcome, ${id}`); // Changed regNo to id
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-cyan-400">
      <form 
        onSubmit={handleLogin} 
        className="bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 text-center transform transition-transform duration-300 hover:scale-105"
      >
        <h2 className="text-white text-3xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 text-lg mb-3">{error}</p>}

        <div className="flex flex-col text-left mb-5">
          <label className="text-white text-lg mb-2">User ID</label>
          <input
            type="text"
            placeholder="Enter your Reg No"
            value={id} // Changed regNo to id
            onChange={(e) => setId(e.target.value)} // Changed regNo to id
            className="p-3 bg-white/40 text-black rounded-lg outline-none text-lg"
          />
        </div>

        <div className="flex flex-col text-left mb-4">
          <label className="text-white text-lg mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-white/40 text-black rounded-lg outline-none text-lg"
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-white text-md cursor-pointer hover:opacity-80"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg w-full text-xl font-semibold transition-transform duration-300 hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
