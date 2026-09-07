import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBookOpen,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import { registerUser } from "../services/authService";

import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await registerUser(formData);

      setSuccess(response.message || "Account created successfully.");

      setTimeout(() => {
        navigate("/");
      }, 900);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand-icon">
            <FiBookOpen />
          </div>

          <h1>AI Notes Summarizer</h1>
          <p>Create an account to start generating study notes.</p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert auth-alert-success" role="status">
            <FiCheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username</label>

            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <FiUser />
              </span>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>

            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <FiMail />
              </span>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <FiLock />
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="has-toggle"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading && <span className="auth-spinner" />}
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
