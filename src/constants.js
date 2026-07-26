// Region codes must match the `region` values used in the emission_factors
// table (see server/src/lib/db.js). This list is just UI labels — it does
// NOT contain any emission factor numbers itself. Adding a new region here
// is only useful once a super_admin has also added factors for it in the
// Emission Factors admin page.
export const REGIONS = [
  { code: "IN", label: "India" },
  { code: "UK", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "SG", label: "Singapore" },
  { code: "GLOBAL", label: "Global average (no specific region)" }
];
