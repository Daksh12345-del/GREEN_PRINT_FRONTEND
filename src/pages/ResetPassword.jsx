import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as api from "../api.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.resetPassword(token, newPassword);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <span>🌱</span> Green Print
        </div>
        <p className="auth-tagline">Set a new password.</p>

        {!token && (
          <div className="error-banner">
            This link is missing its reset code — please use the link from your email,
            or <Link to="/forgot-password">request a new one</Link>.
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {done ? (
          <div className="demo-box">Password updated — taking you to sign in…</div>
        ) : (
          token && (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="newPassword">New password</label>
                <input
                  id="newPassword" type="password" required minLength={8}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={busy} type="submit">
                {busy ? "Updating…" : "Update password"}
              </button>
            </form>
          )
        )}

        <div className="auth-switch">
          <Link to="/login">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
