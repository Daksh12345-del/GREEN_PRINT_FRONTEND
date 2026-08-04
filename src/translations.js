// translations.js
// Covers the highest-traffic screens: login/auth, the nav sidebar, and
// the dashboard. Not every string in the whole app is translated yet —
// see ROADMAP.md. Any key missing from the current language silently
// falls back to English (see LanguageContext.jsx's t() function), so
// adding more translations over time is safe and incremental.

export const translations = {
  en: {
    // Brand / tagline
    tagline: "Track carbon the way you track revenue.",

    // Login page
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    signIn: "Sign in",
    signingIn: "Signing in…",
    newCompany: "New company?",
    createAccount: "Create your Green Print account",

    // Register page
    companyName: "Company name",
    sector: "Sector",
    scale: "Scale",
    region: "Region (determines which emission factors apply)",
    yourName: "Your name",
    yourEmail: "Your email",
    createCompanyAccount: "Create company account",
    creatingAccount: "Creating account…",
    alreadyHaveAccount: "Already have an account?",

    // Nav
    navDashboard: "Dashboard",
    navActivityLogs: "Activity Logs",
    navFacilities: "Facilities",
    navFleet: "Fleet",
    navDevices: "IoT Devices",
    navAiInsights: "AI Insights",
    navReports: "Reports",
    navCarbonCredits: "Carbon Credits",
    navEmissionFactors: "Emission Factors",
    navTeam: "Team",
    navCompanies: "Companies",
    signOut: "Sign out",
    liveData: "Live data",

    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Live emissions overview, recalculated from every log you've entered.",
    totalCo2e: "Total CO2e",
    scope2Electricity: "Scope 2 — electricity",
    scope1Fuel: "Scope 1 — fuel combustion",
    renewableShare: "Renewable Share",
    greenScore: "Green Score (illustrative — not a certified rating)",
    emissionsTrend: "Emissions trend",
    recentActivity: "Recent activity",
    addALog: "Add a log →",
    viewAiInsights: "View AI Insights →",
    noLogsYet: "No logs yet",
    when: "When",
    activity: "Activity",
    quantity: "Quantity",

    // Common
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete"
  },

  hi: {
    tagline: "कार्बन को उतनी ही आसानी से ट्रैक करें जितनी आसानी से रेवेन्यू।",

    email: "ईमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    signIn: "साइन इन करें",
    signingIn: "साइन इन हो रहा है…",
    newCompany: "नई कंपनी?",
    createAccount: "अपना Green Print अकाउंट बनाएं",

    companyName: "कंपनी का नाम",
    sector: "क्षेत्र (सेक्टर)",
    scale: "आकार (स्केल)",
    region: "क्षेत्र (यह तय करता है कि कौन से उत्सर्जन कारक लागू होंगे)",
    yourName: "आपका नाम",
    yourEmail: "आपका ईमेल",
    createCompanyAccount: "कंपनी अकाउंट बनाएं",
    creatingAccount: "अकाउंट बनाया जा रहा है…",
    alreadyHaveAccount: "पहले से अकाउंट है?",

    navDashboard: "डैशबोर्ड",
    navActivityLogs: "गतिविधि लॉग",
    navFacilities: "सुविधाएं",
    navFleet: "फ्लीट",
    navDevices: "IoT डिवाइस",
    navAiInsights: "AI इनसाइट्स",
    navReports: "रिपोर्ट्स",
    navCarbonCredits: "कार्बन क्रेडिट",
    navEmissionFactors: "उत्सर्जन कारक",
    navTeam: "टीम",
    navCompanies: "कंपनियां",
    signOut: "साइन आउट",
    liveData: "लाइव डेटा",

    dashboardTitle: "डैशबोर्ड",
    dashboardSubtitle: "आपके हर लॉग से दोबारा गणना किया गया लाइव उत्सर्जन विवरण।",
    totalCo2e: "कुल CO2e",
    scope2Electricity: "स्कोप 2 — बिजली",
    scope1Fuel: "स्कोप 1 — ईंधन दहन",
    renewableShare: "नवीकरणीय हिस्सा",
    greenScore: "ग्रीन स्कोर (सांकेतिक — प्रमाणित रेटिंग नहीं)",
    emissionsTrend: "उत्सर्जन ट्रेंड",
    recentActivity: "हाल की गतिविधि",
    addALog: "लॉग जोड़ें →",
    viewAiInsights: "AI इनसाइट्स देखें →",
    noLogsYet: "अभी तक कोई लॉग नहीं",
    when: "कब",
    activity: "गतिविधि",
    quantity: "मात्रा",

    loading: "लोड हो रहा है…",
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "हटाएं"
  }
};
