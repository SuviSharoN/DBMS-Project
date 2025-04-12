// Frontend/src/Loginpage/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios directly
// Assuming you have styles or using Tailwind:
// import './LoginStyles.css';

function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5000/api/auth'; // Define your base URL

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
            // Use axios directly with the full URL
            const response = await axios.post(`${BASE_URL}/login`, {
                id,
                password
            });

            if (response.data.success) {
              console.log(response.data);
                const { token, role, userId } = response.data;

                // Store user info in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userId', userId);
                console.log(userId);

                alert(`Login successful! Welcome, ${userId}`);

                // Navigate based on role
                if (role === 'Student') navigate(`/dashboard/${userId}`);
                else if (role === 'Faculty') navigate(`/faculty_dashboard/${userId}`);
                else navigate(`/admin/dashboard/${userId}`);

            } else {
                // This case might be less common if backend uses proper status codes
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

    // --- JSX remains the same as previous Login.jsx version ---
    // Use className for styling as needed
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-cyan-400"> {/* Example styling */}
             <form
                 onSubmit={handleLogin}
                 className="bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 text-center transform transition-transform duration-300 hover:scale-105" // Example styling
             >
                 <h2 className="text-white text-3xl font-bold mb-6">Login</h2> {/* Example styling */}
                 {error && <p className="text-red-500 text-lg mb-3">{error}</p>} {/* Example styling */}

                 <div className="flex flex-col text-left mb-5"> {/* Example styling */}
                     <label htmlFor="userId" className="text-white text-lg mb-2">User ID</label> {/* Example styling */}
                     <input
                         id="userId"
                         type="text"
                         placeholder="Enter your ID"
                         value={id}
                         onChange={(e) => setId(e.target.value)}
                         className="p-3 bg-white/40 text-black rounded-lg outline-none text-lg" // Example styling
                         required
                     />
                 </div>

                 <div className="flex flex-col text-left mb-4"> {/* Example styling */}
                     <label htmlFor="password" className="text-white text-lg mb-2">Password</label> {/* Example styling */}
                    <div className="relative"> {/* Wrapper for password visibility toggle */}
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 bg-white/40 text-black rounded-lg outline-none text-lg w-full" // Example styling
                            required
                        />
                         <button
                             type="button"
                             className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-white hover:opacity-80" // Example styling
                             onClick={() => setShowPassword(!showPassword)}
                         >
                             {showPassword ? "Hide" : "Show"}
                         </button>
                    </div>
                 </div>

                 <button
                     type="submit"
                     className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg w-full text-xl font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-50" // Example styling
                     disabled={loading}
                 >
                     {loading ? 'Logging in...' : 'Login'}
                 </button>
                 <br /><br />
                 <button
                     type="button"
                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg w-full text-xl font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-50" // Example styling for Register button
                     onClick={handleRegister}
                     disabled={loading}
                 >
                     Register
                 </button>
             </form>
        </div>
    );
}

export default Login;