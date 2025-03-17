import { useState } from "react";
import './Login.css';

function Login() {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!regNo || !password) {
      setError("Both fields are required!");
      return;
    }

    setError(""); // Clear errors if any
    alert(`Login successful! Welcome, ${regNo}`);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label>User id</label>
          <input
            type="text"
            placeholder="Enter your Reg No"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="show-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;
