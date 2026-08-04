import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import * as api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import KpiCards from "../components/KpiCards.jsx";
import EmissionsChart from "../components/EmissionsChart.jsx";
import Pipeline from "../components/Pipeline.jsx";

const POLL_MS = 5000;

const ACTIVITY_LABELS = {
  electricity: "Electricity",
  diesel: "Diesel",
  petrol: "Petrol",
  natural_gas: "Natural gas",
  lpg: "LPG",
  coal: "Coal"
};

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [kpis, setKpis] = useState(null);
  const [logs, setLogs] = useState([]);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [kpiData, logData, trendData] = await Promise.all([
        api.getKpis(), api.getLogs(), api.getTrend().catch(() => null)
      ]);
      setKpis(kpiData);
      setLogs(logData);
      setTrend(trendData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  if (user.role === "super_admin") {
    return <SuperAdminDashboard kpis={kpis} loading={loading} error={error} />;
  }

  return (
    <>
      {error && <div className="error-banner">Can't reach the API ({error})</div>}

      {trend?.isAlert && (
        <div className="error-banner" style={{ background: "var(--warn-soft)", color: "var(--warn)", display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={15} />
          {trend.message} Check Activity Logs or AI Insights to see what changed.
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="kpi-label" style={{ marginBottom: 10 }}>How your data becomes a recommendation</div>
        <Pipeline activeIndex={3} />
      </div>

      <KpiCards kpis={kpis} loading={loading} />

      <div className="section">
        <div className="section-title">
          <h2>{t("emissionsTrend")}</h2>
          <Link to="/logs" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 12.5 }}>
            {t("addALog")}
          </Link>
        </div>
        <EmissionsChart logs={logs} />
      </div>

      <div className="section">
        <div className="section-title">
          <h2>{t("recentActivity")}</h2>
          <Link to="/ai-insights" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 12.5 }}>
            {t("viewAiInsights")}
          </Link>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>{t("when")}</th><th>{t("activity")}</th><th>{t("quantity")}</th><th>CO2e (kg)</th></tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr className="empty-row"><td colSpan={4}>{t("noLogsYet")}</td></tr>
              )}
              {logs.slice(-6).reverse().map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>{ACTIVITY_LABELS[l.activity_type] || l.activity_type}</td>
                  <td className="mono">{l.quantity} {l.unit}</td>
                  <td className="mono">{(l.emissions?.CO2e ?? 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function SuperAdminDashboard({ kpis, loading, error }) {
  return (
    <>
      {error && <div className="error-banner">Can't reach the API ({error})</div>}
      <KpiCards kpis={kpis} loading={loading} />

      <div className="section">
        <div className="section-title"><h2>Every company on the platform</h2></div>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Company</th><th>Region</th><th>Total CO2e (kg)</th><th>Renewable</th><th>Green Score</th><th>Logs</th></tr>
            </thead>
            <tbody>
              {loading && <tr className="empty-row"><td colSpan={6}>Loading…</td></tr>}
              {!loading && (!kpis?.byCompany || kpis.byCompany.length === 0) && (
                <tr className="empty-row"><td colSpan={6}>No companies yet</td></tr>
              )}
              {kpis?.byCompany?.map((c) => (
                <tr key={c.companyId}>
                  <td>{c.companyName}</td>
                  <td>{c.region}</td>
                  <td className="mono">{c.co2e}</td>
                  <td className="mono">{c.renewableShare}%</td>
                  <td className="mono">{c.esgScore}/100</td>
                  <td className="mono">{c.sampleSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
