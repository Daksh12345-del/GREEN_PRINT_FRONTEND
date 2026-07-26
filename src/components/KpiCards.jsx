export default function KpiCards({ kpis, loading }) {
  if (loading || !kpis) {
    return (
      <div className="grid grid-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card kpi-card">
            <div className="kpi-label">Loading…</div>
            <div className="kpi-value">—</div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total CO2e", value: kpis.co2e, unit: "kg" },
    { label: "Scope 2 — electricity", value: kpis.electricityCo2e, unit: "kg CO2e" },
    { label: "Scope 1 — fuel combustion", value: kpis.fuelCo2e, unit: "kg CO2e" },
    { label: "Renewable Share", value: kpis.renewableShare, unit: "%" }
  ];

  return (
    <div className="grid grid-4">
      {cards.map((c) => (
        <div key={c.label} className="card kpi-card">
          <div className="kpi-label">{c.label}</div>
          <div className="kpi-value">
            {c.value?.toLocaleString?.() ?? c.value} <span className="kpi-unit">{c.unit}</span>
          </div>
        </div>
      ))}

      <div className="card kpi-card">
        <div className="kpi-label">NOx</div>
        <div className="kpi-value">{kpis.nox} <span className="kpi-unit">kg</span></div>
      </div>
      <div className="card kpi-card">
        <div className="kpi-label">SOx</div>
        <div className="kpi-value">{kpis.sox} <span className="kpi-unit">kg</span></div>
      </div>
      <div className="card kpi-card" style={{ gridColumn: "span 2" }}>
        <div className="kpi-label">Region (determines which factors apply)</div>
        <div className="kpi-value" style={{ fontSize: 20 }}>{kpis.region || "—"}</div>
      </div>

      <div className="card kpi-card" style={{ gridColumn: "1 / -1" }}>
        <div className="kpi-label">Green Score (illustrative — not a certified rating)</div>
        <div className="kpi-value">
          {kpis.esgScore}
          <span className="kpi-unit"> / 100</span>
        </div>
        <div className={`kpi-trend ${kpis.esgScore >= 70 ? "good" : "warn"}`}>
          {kpis.esgScore >= 70 ? "Strong sustainability position" : "Room to improve — see AI Insights"}
          {" · based on "}{kpis.sampleSize} logged data point{kpis.sampleSize === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}
