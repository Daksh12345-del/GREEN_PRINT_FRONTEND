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

    // Trend & facility breakdown charts
    chartTabRecent: "Recent",
    chartTabMonthly: "Monthly",
    chartTabYearly: "Yearly",
    facilityBreakdown: "Facility-wise breakdown",
    facilityBreakdownTotal: "Total across all facilities",
    noFacilityDataYet: "No facility data yet — log an activity to see the breakdown.",

    // Sector benchmark
    sectorBenchmark: "How you compare to your sector",
    benchmarkVs: "Benchmarked against",
    benchmarkPeers: "companies",
    benchmarkPercentile: "percentile in sector",
    benchmarkCo2ePerLog: "Avg CO2e per log",
    benchmarkDisclaimer: "Anonymized comparison — individual peer companies are never identified. Green Score is this app's own illustrative metric, not a certified rating.",

    // Onboarding wizard
    onboardTitle: "Getting started",
    onboardSubtitle: "A few quick steps to get real numbers on your Dashboard",
    onboardDone: "done",
    onboardDismiss: "Dismiss",
    onboardStep1FacilityTitle: "Add your first facility",
    onboardStep1FacilityDesc: "Facilities let you group energy & fuel logs by plant or site.",
    onboardStep1FacilityCta: "Add facility →",
    onboardStep1FleetTitle: "Add your first vehicle",
    onboardStep1FleetDesc: "Vehicles let you track fuel use per truck or car in your fleet.",
    onboardStep1FleetCta: "Add vehicle →",
    onboardStep2Title: "Log your first activity",
    onboardStep2Desc: "Enter an electricity or fuel reading — emissions are calculated instantly.",
    onboardStep2Cta: "Add a log →",
    onboardStep3Title: "See your results",
    onboardStep3Desc: "Check your AI Insights and download your first ESG report.",
    onboardStep3Cta: "View insights →",

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

    chartTabRecent: "हाल का",
    chartTabMonthly: "मासिक",
    chartTabYearly: "वार्षिक",
    facilityBreakdown: "सुविधा-वार विवरण",
    facilityBreakdownTotal: "सभी सुविधाओं का कुल योग",
    noFacilityDataYet: "अभी तक कोई सुविधा डेटा नहीं — विवरण देखने के लिए एक गतिविधि लॉग करें।",

    sectorBenchmark: "आप अपने सेक्टर की तुलना में कहां खड़े हैं",
    benchmarkVs: "इनके मुकाबले तुलना",
    benchmarkPeers: "कंपनियां",
    benchmarkPercentile: "सेक्टर में पर्सेंटाइल",
    benchmarkCo2ePerLog: "प्रति लॉग औसत CO2e",
    benchmarkDisclaimer: "गुमनाम तुलना — किसी भी प्रतिस्पर्धी कंपनी की पहचान कभी उजागर नहीं की जाती। ग्रीन स्कोर इस ऐप का अपना सांकेतिक मेट्रिक है, प्रमाणित रेटिंग नहीं।",

    onboardTitle: "शुरुआत करें",
    onboardSubtitle: "अपने डैशबोर्ड पर असली आंकड़े देखने के लिए कुछ आसान कदम",
    onboardDone: "पूरा",
    onboardDismiss: "बंद करें",
    onboardStep1FacilityTitle: "अपनी पहली सुविधा जोड़ें",
    onboardStep1FacilityDesc: "सुविधाएं आपको प्लांट या साइट के अनुसार ऊर्जा और ईंधन लॉग को समूहित करने देती हैं।",
    onboardStep1FacilityCta: "सुविधा जोड़ें →",
    onboardStep1FleetTitle: "अपना पहला वाहन जोड़ें",
    onboardStep1FleetDesc: "वाहन आपको अपने फ्लीट में प्रत्येक ट्रक या कार के ईंधन उपयोग को ट्रैक करने देते हैं।",
    onboardStep1FleetCta: "वाहन जोड़ें →",
    onboardStep2Title: "अपनी पहली गतिविधि लॉग करें",
    onboardStep2Desc: "बिजली या ईंधन की रीडिंग दर्ज करें — उत्सर्जन तुरंत गणना हो जाता है।",
    onboardStep2Cta: "लॉग जोड़ें →",
    onboardStep3Title: "अपने परिणाम देखें",
    onboardStep3Desc: "अपने AI इनसाइट्स देखें और अपनी पहली ESG रिपोर्ट डाउनलोड करें।",
    onboardStep3Cta: "इनसाइट्स देखें →",

    loading: "लोड हो रहा है…",
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "हटाएं"
  }
};
