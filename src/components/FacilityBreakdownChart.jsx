import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from "recharts";
import * as api from "../api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

// A small rotating palette so each facility bar is visually distinct —
// not tied to any pollutant/scope meaning (unlike the green/purple used
// for Scope 1/2 elsewhere), so it's fine for this to just cycle.
const PALETTE = ["#1F5F45", "#7A3FB0", "#B5762C", "#2E6FA6", "#A6382F", "#5C7A3F", "#8B5FBF", "#3F8A8A"];

export default function FacilityBreakdownChart({ companyId }) {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getFacilityBreakdown(companyId)
      .then((res) => { if (!cancelled) { setData(res); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [companyId]);

  if (loading) {
    return <div className="card" style={{ textAlign: "center", color: "var(--ink-faint)", padding: 40 }}>{t("loading")}</div>;
  }
  if (error) {
    return <div className="card" style={{ textAlign: "center", color: "var(--crit)", padding: 40 }}>{error}</div>;
  }
  if (!data || data.breakdown.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--ink-faint)", padding: 40 }}>
        {t("noFacilityDataYet")}
      </div>
    );
  }

  const chartData = data.breakdown.map((b) => ({
    name: b.facilityName,
    co2e: b.co2e,
    percentage: b.percentage
  }));
  // Taller chart when there are more facilities so bars don't get cramped.
  const height = Math.max(180, chartData.length * 46);

  return (
    <div className="card">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 6, right: 40, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "var(--ink-soft)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 12, fill: "var(--ink)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} kg CO2e (${props.payload.percentage}%)`, t("totalCo2e")]}
            contentStyle={{ fontSize: 12.5, borderRadius: 8, border: "1px solid var(--border)", fontFamily: "Inter", background: "var(--surface)" }}
            labelStyle={{ fontWeight: 600, color: "var(--ink)" }}
          />
          <Bar dataKey="co2e" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={(v) => `${v}%`}
              style={{ fontSize: 11, fill: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-faint)" }}>
        {t("facilityBreakdownTotal")}: <span className="mono">{data.total} kg CO2e</span>
      </div>
    </div>
  );
}
