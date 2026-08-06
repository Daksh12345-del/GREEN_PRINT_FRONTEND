import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, X } from "lucide-react";
import * as api from "../api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const CAN_MANAGE_FACILITIES = ["company_admin", "plant_manager", "super_admin"];
const CAN_MANAGE_FLEET = ["company_admin", "fleet_manager", "super_admin"];

function dismissKey(userId) {
  return `greenprint_onboarding_dismissed_${userId}`;
}

function Step({ number, title, description, done, ctaLabel, ctaTo }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0" }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>
        {done
          ? <CheckCircle2 size={20} color="var(--good)" />
          : <Circle size={20} color="var(--border)" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: done ? "var(--ink-faint)" : "var(--ink)", textDecoration: done ? "line-through" : "none" }}>
          {number}. {title}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{description}</div>
      </div>
      {!done && ctaTo && (
        <Link to={ctaTo} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

// Shown on the Dashboard for a company that hasn't finished basic setup
// yet. Steps are computed from REAL data (facilities/vehicles/logs that
// actually exist), never a stored "onboarding complete" flag that could
// drift from reality — so this can never get stuck showing a step that's
// already done. Auto-hides once every applicable step is done, or if the
// person dismisses it (remembered per-user in localStorage, same pattern
// as the dark mode / language toggles).
export default function OnboardingWizard({ companyId, userId, role, hasLogs }) {
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState(null);
  const [vehicles, setVehicles] = useState(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(dismissKey(userId)) === "true");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.getFacilities(companyId).catch(() => []),
      api.getVehicles(companyId).catch(() => [])
    ]).then(([f, v]) => {
      if (!cancelled) { setFacilities(f); setVehicles(v); }
    });
    return () => { cancelled = true; };
  }, [companyId]);

  if (dismissed) return null;
  if (facilities === null || vehicles === null) return null; // still loading; don't flash

  const canFacility = CAN_MANAGE_FACILITIES.includes(role);
  const canFleet = CAN_MANAGE_FLEET.includes(role);
  const setupApplicable = canFacility || canFleet;
  const setupDone = facilities.length > 0 || vehicles.length > 0;

  const allDone = (!setupApplicable || setupDone) && hasLogs;
  if (allDone) return null;

  function dismiss() {
    localStorage.setItem(dismissKey(userId), "true");
    setDismissed(true);
  }

  const steps = [];
  if (setupApplicable) {
    steps.push({
      title: canFacility ? t("onboardStep1FacilityTitle") : t("onboardStep1FleetTitle"),
      description: canFacility ? t("onboardStep1FacilityDesc") : t("onboardStep1FleetDesc"),
      done: setupDone,
      ctaLabel: canFacility ? t("onboardStep1FacilityCta") : t("onboardStep1FleetCta"),
      ctaTo: canFacility ? "/facilities" : "/fleet"
    });
  }
  steps.push({
    title: t("onboardStep2Title"),
    description: t("onboardStep2Desc"),
    done: hasLogs,
    ctaLabel: t("onboardStep2Cta"),
    ctaTo: "/logs"
  });
  steps.push({
    title: t("onboardStep3Title"),
    description: t("onboardStep3Desc"),
    done: false,
    ctaLabel: t("onboardStep3Cta"),
    ctaTo: "/ai-insights"
  });

  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="card" style={{ marginBottom: 20, position: "relative" }}>
      <button
        onClick={dismiss}
        aria-label={t("onboardDismiss")}
        style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", padding: 4 }}
      >
        <X size={16} />
      </button>

      <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
        {t("onboardTitle")}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 4 }}>
        {t("onboardSubtitle")} · {doneCount}/{steps.length} {t("onboardDone")}
      </div>

      <div style={{ height: 4, background: "var(--surface-sunken)", borderRadius: 2, overflow: "hidden", margin: "10px 0" }}>
        <div style={{ width: `${(doneCount / steps.length) * 100}%`, height: "100%", background: "var(--brand)", borderRadius: 2, transition: "width 0.3s" }} />
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        {steps.map((s, i) => (
          <div key={s.title} style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--border)" : "none" }}>
            <Step number={i + 1} {...s} />
          </div>
        ))}
      </div>
    </div>
  );
}
