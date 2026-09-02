import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import axiosInstance from "../../../axiosInstance";

const PasswordReset = ({setLogin}) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use axiosInstance for consistent baseURL and credentials
      const res = await axiosInstance.post(`/api/user/reset-password/${token}`, {
        password:newPassword,
      });
      setMessage(res.data.message || "Password reset successful✅.");
      setTimeout(() => navigate("/"), 3000); // Redirect to login after success
      setLogin(true);
    } catch (error) {
      setMessage(error.res.data.message);
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <FaArrowCircleLeft
        style={{ width: 40, height: 40, float: "left", margin: 40, marginTop:100, cursor: "pointer" }}
        onClick={() => navigate(window.history.back())}
      />
      <div className="container">
        <h2>Reset Password</h2>
        <p>Enter a new password for your account.</p>
        <form onSubmit={handleReset}>
          <input
            type="password"
            className="input-field"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;