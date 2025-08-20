import { useState } from "react";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const switchMode = (e) => {
    e.preventDefault();
    setIsRegister((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload trang

    if (isRegister && password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const data = {
      user_name: username,
      password: password,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:6868/auth/${isRegister ? "signup" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || result.message || "Request failed");
        return;
      }

      setMessage(result.message || "");
    } catch (error) {
      setMessage(error.message || "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isRegister && (
            <button type="button" onClick={togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {isRegister && (
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="button" onClick={togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        )}
        <div>
          {message && message.trim() !== "" && (
            <span className="message">{message}</span>
          )}
        </div>
        <div className="remember-forgot">
          {!isRegister && (
            <label>
              <input type="checkbox" /> Remember me
            </label>
          )}
        </div>
        <button
          type="submit"
          onClick={(e) => {
            setLoading(true);
            handleSubmit(e);
          }}
          disabled={loading}
        >
          {isRegister ? "Sign Up" : "Login"}
        </button>

        <div className="register-link">
          <p>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <a href="#" onClick={switchMode}>
              {isRegister ? "Login" : "Register"}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Auth;
