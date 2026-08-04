import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { REGIONS } from "../constants.js";

const SECTORS = ["Manufacturing", "Logistics", "Energy", "Construction", "Hospitality", "Healthcare", "Government", "Other"];
const SCALES = ["SME", "Mid-size", "Enterprise", "City / Government"];

export default function RegisterCompany() {
  const { registerCompany } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "", sector: SECTORS[0], scale: SCALES[0], region: REGIONS[0].code,
    adminName: "", adminEmail: "", adminPassword: ""
  });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await registerCompany(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-brand">
          <span>🌱</span> Green Print
        </div>
        <p className="auth-tagline">Set up your company's carbon dashboard in a minute.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="companyName">{t("companyName")}</label>
            <input id="companyName" required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Acme Manufacturing" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="sector">{t("sector")}</label>
              <select id="sector" value={form.sector} onChange={(e) => update("sector", e.target.value)}>
                {SECTORS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="scale">{t("scale")}</label>
              <select id="scale" value={form.scale} onChange={(e) => update("scale", e.target.value)}>
                {SCALES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="region">{t("region")}</label>
            <select id="region" value={form.region} onChange={(e) => update("region", e.target.value)}>
              {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="adminName">{t("yourName")}</label>
            <input id="adminName" required value={form.adminName} onChange={(e) => update("adminName", e.target.value)} placeholder="Ava Kapoor" />
          </div>
          <div className="field">
            <label htmlFor="adminEmail">{t("yourEmail")}</label>
            <input id="adminEmail" type="email" required value={form.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="field">
            <label htmlFor="adminPassword">{t("password")}</label>
            <input id="adminPassword" type="password" required minLength={8} value={form.adminPassword} onChange={(e) => update("adminPassword", e.target.value)} placeholder="At least 8 characters" />
          </div>
          <button className="btn btn-primary btn-block" disabled={busy} type="submit">
            {busy ? t("creatingAccount") : t("createCompanyAccount")}
          </button>
        </form>

        <div className="auth-switch">
          {t("alreadyHaveAccount")} <Link to="/login">{t("signIn")}</Link>
        </div>
      </div>
    </div>
  );
}
