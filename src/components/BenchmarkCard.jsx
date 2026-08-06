import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import * as api from "../api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

function formatDiff(yourValue, sectorValue, unit) {
  const diff = Math.round((yourValue - sectorValue) * 10) / 10;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff}${unit} vs sector avg`;
}

function BarRow({ value, display, tag, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 66, flexShrink: 0 }}>{tag}</span>
      <div style={{ flex: 1, background: "var(--surface-sunken)", borderRadius: 4, height: 10, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(value, 2)}%`, background: color, height: "100%", borderRadius: 4 }} />
      </div>
      <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-soft)", width: 56, textAlign: "right", flexShrink: 0 }}>
        {display}
      </span>
    </div>
  );
}

function ComparisonBar({ label, yourValue, sectorValue, unit, higherIsBetter = true }) {
  const max = Math.max(yourValue, sectorValue, 1);
  const yourPct = (yourValue / max) * 100;
  const sectorPct = (sectorValue / max) * 100;
  const youAreBetter = higherIsBetter ? yourValue >= sectorValue : yourValue <= sectorValue;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ color: "var(--ink-soft)", fontWeight: 600 }}>{label}</span>
        <span className={`kpi-trend ${youAreBetter ? "good" : "warn"}`} style={{ margin: 0 }}>
          {youAreBetter ? "▲" : "▼"} {formatDiff(yourValue, sectorValue, unit)}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <BarRow value={yourPct} display={`${yourValue}${unit}`} tag="You" color="var(--brand)" />
        <BarRow value={sectorPct} display={`${sectorValue}${unit}`} tag="Sector avg" color="var(--ink-faint)" />
      </div>
    </div>
  );
}

export default function BenchmarkCard({ companyId }) {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getBenchmark(companyId)
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
  if (!data.available) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--ink-faint)", padding: 32 }}>
        <Users size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
        <div>{data.message}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          {t("benchmarkVs")} <strong style={{ color: "var(--ink)" }}>{data.sector}</strong>
          {" "}({data.peerCount} {t("benchmarkPeers")})
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="kpi-value" style={{ fontSize: 22 }}>{data.percentile}<span className="kpi-unit">th</span></div>
          <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{t("benchmarkPercentile")}</div>
        </div>
      </div>

      <ComparisonBar label={t("greenScore")} yourValue={data.yourCompany.greenScore} sectorValue={data.sectorAverage.greenScore} unit="" />
      <ComparisonBar label={t("renewableShare")} yourValue={data.yourCompany.renewableShare} sectorValue={data.sectorAverage.renewableShare} unit="%" />
      <ComparisonBar
        label={t("benchmarkCo2ePerLog")}
        yourValue={data.yourCompany.co2ePerLog}
        sectorValue={data.sectorAverage.co2ePerLog}
        unit=" kg"
        higherIsBetter={false}
      />

      <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4 }}>
        {t("benchmarkDisclaimer")}
      </div>
    </div>
  );
}
