import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Languages } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand" style={{ justifyContent: "space-between" }}>
          <span><span style={{ marginRight: 8 }}>🌱</span>Green Print</span>
          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-secondary"
            style={{ padding: "5px 10px", fontSize: 12, fontWeight: 600 }}
            title="Switch language"
          >
            <Languages size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            {language === "en" ? "हिं" : "EN"}
          </button>
        </div>
        <p className="auth-tagline">{t("tagline")}</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">{t("email")}</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="field">
            <label htmlFor="password" style={{ display: "flex", justifyContent: "space-between" }}>
              {t("password")}
              <Link to="/forgot-password" style={{ fontWeight: 500, fontSize: 12.5 }}>{t("forgotPassword")}</Link>
            </label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-block" disabled={busy} type="submit">
            {busy ? t("signingIn") : t("signIn")}
          </button>
        </form>

        <div className="auth-switch">
          {t("newCompany")} <Link to="/register">{t("createAccount")}</Link>
        </div>
      </div>
    </div>
  );
}
