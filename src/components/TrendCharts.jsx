import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as api from "../api.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import EmissionsChart from "./EmissionsChart.jsx";

// Scope colors match EmissionsChart.jsx exactly so "Scope 1" / "Scope 2"
// mean the same color everywhere in the app.
const SCOPE1_COLOR = "#7A3FB0";
const SCOPE2_COLOR = "#1F5F45";

function ScopeBarChart({ series, loading }) {
  if (loading) {
    return <div className="card" style={{ textAlign: "center", color: "var(--ink-faint)", padding: 40 }}>Loading…</div>;
  }
  if (!series || series.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--ink-faint)", padding: 40 }}>
        Not enough history yet for this view.
      </div>
    );
  }
  return (
    <div className="card">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={series} margin={{ top: 6, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ fontSize: 12.5, borderRadius: 8, border: "1px solid var(--border)", fontFamily: "Inter", background: "var(--surface)" }}
            labelStyle={{ fontWeight: 600, color: "var(--ink)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="scope2" name="Scope 2 (electricity)" stackId="co2e" fill={SCOPE2_COLOR} radius={[0, 0, 0, 0]} />
          <Bar dataKey="scope1" name="Scope 1 (fuel)" stackId="co2e" fill={SCOPE1_COLOR} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function TrendCharts({ logs, companyId }) {
  const { t } = useLanguage();
  const [view, setView] = useState("recent"); // "recent" | "month" | "year"
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [loadingSeries, setLoadingSeries] = useState(false);

  useEffect(() => {
    if (view === "recent") return;
    const granularity = view === "year" ? "year" : "month";
    const setSeries = view === "year" ? setYearly : setMonthly;
    let cancelled = false;

    setLoadingSeries(true);
    api
      .getTimeseries(companyId, granularity)
      .then((data) => { if (!cancelled) setSeries(data.series); })
      .catch(() => { if (!cancelled) setSeries([]); })
      .finally(() => { if (!cancelled) setLoadingSeries(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, companyId]);

  return (
    <div className="section">
      <div className="section-title">
        <h2>{t("emissionsTrend")}</h2>
        <div className="chart-tabs">
          <button className={`chart-tab ${view === "recent" ? "active" : ""}`} onClick={() => setView("recent")}>
            {t("chartTabRecent")}
          </button>
          <button className={`chart-tab ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>
            {t("chartTabMonthly")}
          </button>
          <button className={`chart-tab ${view === "year" ? "active" : ""}`} onClick={() => setView("year")}>
            {t("chartTabYearly")}
          </button>
        </div>
      </div>

      {view === "recent" && <EmissionsChart logs={logs} />}
      {view === "month" && <ScopeBarChart series={monthly} loading={loadingSeries} />}
      {view === "year" && <ScopeBarChart series={yearly} loading={loadingSeries} />}
    </div>
  );
}
