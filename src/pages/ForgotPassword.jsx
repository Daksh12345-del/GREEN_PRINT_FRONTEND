import { useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
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
        <p className="auth-tagline">Reset your password.</p>

        {error && <div className="error-banner">{error}</div>}

        {sent ? (
          <div className="demo-box">
            If an account exists for <b>{email}</b>, a reset link has been sent —
            check your inbox (and spam folder). The link expires in 15 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <div className="auth-switch">
          <Link to="/login">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
