// Frontend/src/Loginpage/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5000/api/auth';

    const handleRegister = () => {
        navigate("/registeroptions");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!id || !password) {
            setError("Both User ID and Password are required!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                id,
                password
            });

            if (response.data.success) {
                console.log(response.data);
                const { token, role, userId } = response.data;

                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userId', userId);
                console.log(userId);

                alert(`Login successful! Welcome, ${userId}`);

                if (role === 'Student') navigate(`/dashboard/${userId}`);
                else if (role === 'Faculty') navigate(`/faculty_dashboard/${userId}`);
                else navigate(`/admin/dashboard/${userId}`);

            } else {
                setError(response.data.message || "Invalid credentials!");
                localStorage.clear();
            }
        } catch (err) {
            console.error("Login failed:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.request) {
                setError("Network error. Could not reach server.");
            } else {
                setError("An unexpected error occurred during login.");
            }
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    // --- JSX with "Aurora Borealis" Theme ---
    return (
        // Deep dark background with aurora-like gradient hues (adjust colors as desired)
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-indigo-950 to-teal-900">
             <form
                 onSubmit={handleLogin}
                 // Frosted glass effect form with subtle border hinting at aurora colors
                 className="bg-gray-900/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 text-center transform transition-transform duration-300 hover:scale-[1.02] ring-1 ring-purple-400/30"
             >
                 {/* Gradient text title reflecting aurora colors */}
                 <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 text-3xl font-bold mb-6">
                    Login Portal
                 </h2>
                 {error && <p className="text-red-400 text-lg mb-3">{error}</p>}

                 <div className="flex flex-col text-left mb-5">
                    {/* Light, slightly tinted label */}
                     <label htmlFor="userId" className="text-purple-200 text-lg mb-2">User ID</label>
                     <input
                         id="userId"
                         type="text"
                         placeholder="Enter your ID"
                         value={id}
                         onChange={(e) => setId(e.target.value)}
                         // Dark input, subtle border, focus effect using aurora accent color
                         className="p-3 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-lg placeholder-gray-500 border border-transparent"
                         required
                     />
                 </div>

                 <div className="flex flex-col text-left mb-4">
                     <label htmlFor="password" className="text-purple-200 text-lg mb-2">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Dark input, subtle border, focus effect using aurora accent color
                            className="p-3 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-lg w-full placeholder-gray-500 border border-transparent"
                            required
                        />
                         <button
                             type="button"
                             // Adjusted show/hide text color for better contrast
                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-teal-300 transition-colors duration-200"
                             onClick={() => setShowPassword(!showPassword)}
                         >
                             {showPassword ? "Hide" : "Show"}
                         </button>
                    </div>
                 </div>

                 <button
                     type="submit"
                     // Primary button using aurora gradient colors
                     className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white py-3 rounded-lg w-full text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                     disabled={loading}
                 >
                     {loading ? 'Verifying...' : 'Access Portal'}
                 </button>
                 <br /><br />
                 <button
                     type="button"
                      // Secondary button - outline style using an aurora accent color
                     className="bg-transparent border border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black py-3 rounded-lg w-full text-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                     onClick={handleRegister}
                     disabled={loading}
                 >
                     Create Account
                 </button>
             </form>
        </div>
    );
}

export default Login;