export type Locale = "en" | "kn";
export type TranslationKey = keyof typeof translations["en"];

export const translations = {
  en: {
    // Auth
    signUp: "Sign Up",
    login: "Login",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    name: "Name",
    age: "Age",
    location: "Location",
    preferredLanguage: "Preferred Language",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",

    // Navigation
    home: "Home",
    careerRecommender: "Career Recommender",
    scholarships: "Scholarships & Loans",
    profile: "Profile",
    settings: "Settings",

    // Landing Page
    dreamStartsHere: "Your dream begins here",
    keyFeatures: "Key Features",
    careerRecFeature: "Career Recommendation Engine",
    careerRecFeatureDesc: "AI-powered predictions based on your interests, skills, and education.",
    roadmapFeature: "Career Roadmap Generator",
    roadmapFeatureDesc: "A complete step-by-step career roadmap tailored just for you.",
    chatbotFeature: "AI Chatbot",
    chatbotFeatureDesc: "Instant answers to your career questions anytime.",
    institutionsFeature: "Nearby Institutions Suggestions",
    institutionsFeatureDesc: "Find relevant colleges and training centers near your area.",
    uiFeature: "Kannada & English UI",
    uiFeatureDesc: "Choose your preferred language for a seamless experience.",
    voiceFeature: "Voice Interaction",
    voiceFeatureDesc: "Speak your inputs and let the AI guide you hands-free.",
    madeInKarnataka: "Made in Karnataka",
    appFooterDesc:
      "KANASU helps students discover the right career using AI, interest matching, and bilingual support.",
    allRightsReserved: "All rights reserved.",

    // Home Screen
    getRecommendations: "Get Recommendations",
    topCareerMatches: "Top Career Matches",
    viewRoadmap: "View Roadmap",
    generateFullRoadmap: "Generate Full Roadmap",
    confidence: "Confidence",

    // Scholarships Page
    findFinancialHelp: "Find financial assistance for your education",
    searchScholarships: "Search scholarships...",
    eligibility: "Eligibility",
    amount: "Amount",
    learnMore: "Learn More",
    noScholarships: "No scholarships found matching your search",

    // Profile
    manageYourAccount: "Manage your account settings",
    userInfo: "User Info",
    appInfo: "App Info",
    changePassword: "Change Password",
    voiceGuidance: "Voice Guidance",
    logout: "Logout",
    version: "Version",

    personalInformation: "Personal Information",
    edit: "Edit",

    languagePreferenceDesc: "Choose your preferred language",
    voiceGuidanceDesc: "Enable voice instructions and feedback",

    // Settings Page
    settingsTitle: "Settings",
    languageUpdated: "Language updated",

    // Voice
    listening: "Listening...",
    tapToSpeak: "Tap to speak",
    voiceCommand: "Voice Command",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    skip: "Skip",
  },

  kn: {
    // Auth
    signUp: "ಸೈನ್ ಅಪ್",
    login: "ಲಾಗಿನ್",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    name: "ಹೆಸರು",
    age: "ವಯಸ್ಸು",
    location: "ಸ್ಥಳ",
    preferredLanguage: "ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆ",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    resetPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",

    // Navigation
    home: "ಮುಖಪುಟ",
    careerRecommender: "ವೃತ್ತಿ ಶಿಫಾರಸು",
    scholarships: "ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಸಾಲಗಳು",
    profile: "ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",

    // Landing Page
    dreamStartsHere: "ನಿನ್ನ ಕನಸು ಇಲ್ಲಿ ಆರಂಭವಾಗುತ್ತದೆ",
    keyFeatures: "ಮುಖ್ಯ ವೈಶಿಷ್ಟ್ಯಗಳು",
    careerRecFeature: "ವೃತ್ತಿ ಶಿಫಾರಸು ಎಂಜಿನ್",
    careerRecFeatureDesc:
      "ನಿಮ್ಮ ಆಸಕ್ತಿಗಳು, ಕೌಶಲ್ಯಗಳು ಮತ್ತು ಶಿಕ್ಷಣದ ಆಧಾರದ ಮೇಲೆ AI-ಚಾಲಿತ ಶಿಫಾರಸುಗಳು.",
    roadmapFeature: "ವೃತ್ತಿ ರೋಡ್‌ಮ್ಯಾಪ್ ಜನರೇಟರ್",
    roadmapFeatureDesc: "ನಿಮಗಾಗಿ ವಿಶೇಷವಾಗಿ ರಚಿಸಲಾದ ಹಂತ-ಹಂತದ ರೋಡ್‌ಮ್ಯಾಪ್.",
    chatbotFeature: "AI ಚಾಟ್‌ಬಾಟ್",
    chatbotFeatureDesc: "ನಿಮ್ಮ ವೃತ್ತಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ತಕ್ಷಣದ ಉತ್ತರಗಳು.",
    institutionsFeature: "ಹತ್ತಿರದ ಸಂಸ್ಥೆಗಳ ಸೂಚನೆಗಳು",
    institutionsFeatureDesc: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿನ ಕಾಲೇಜುಗಳು ಮತ್ತು ತರಬೇತಿ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ.",
    uiFeature: "ಕನ್ನಡ & ಇಂಗ್ಲീഷ് UI",
    uiFeatureDesc: "ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯಲ್ಲಿ ಆಪ್ ಅನ್ನು ಬಳಸಿರಿ.",
    voiceFeature: "ಧ್ವನಿ ಸಂವಹನ",
    voiceFeatureDesc: "ನಿಮ್ಮ ಧ್ವನಿಯಲ್ಲಿ ಹೇಳಿ, AI ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
    madeInKarnataka: "ಕರ್ನಾಟಕದಲ್ಲಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
    appFooterDesc:
      "AI, ಆಸಕ್ತಿ ಹೊಂದಾಣಿಕೆ, ಮತ್ತು ದ್ವಿಭಾಷಾ ಬೆಂಬಲದೊಂದಿಗೆ ಉತ್ತಮ ವೃತ್ತಿ ಗುರುತಿಸಲು KANASU ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    allRightsReserved: "ಎಲ್ಲ ಹಕ್ಕುಗಳು ಸಂರಕ್ಷಿಸಲಾಗಿದೆ.",

    // Home
    getRecommendations: "ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
    topCareerMatches: "ಉತ್ತಮ ವೃತ್ತಿ ಹೊಂದಾಣಿಕೆಗಳು",
    viewRoadmap: "ರೋಡ್‌ಮ್ಯಾಪ್ ವೀಕ್ಷಿಸಿ",
    generateFullRoadmap: "ಸಂಪೂರ್ಣ ರೋಡ್‌ಮ್ಯಾಪ್ ರಚಿಸಿ",
    confidence: "ವಿಶ್ವಾಸ",

    // Scholarships
    findFinancialHelp: "ನಿಮ್ಮ ಶಿಕ್ಷಣಕ್ಕೆ ಹಣಕಾಸು ಸಹಾಯವನ್ನು ಹುಡುಕಿ",
    searchScholarships: "ವಿದ್ಯಾರ್ಥಿವೇತನಗಳಿಗಾಗಿ ಹುಡುಕಿ...",
    eligibility: "ಅರ್ಹತೆ",
    amount: "ಮೊತ್ತ",
    learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    noScholarships: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದುವ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು ಸಿಗಲಿಲ್ಲ",

    // Profile
    manageYourAccount: "ನಿಮ್ಮ ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    userInfo: "ಬಳಕೆದಾರರ ಮಾಹಿತಿ",
    appInfo: "ಅಪ್ಲಿಕೇಶನ್ ಮಾಹಿತಿ",
    changePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ",
    voiceGuidance: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
    logout: "ಲಾಗ್ ಔಟ್",
    version: "ಆವೃತ್ತಿ",

    personalInformation: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
    edit: "ತಿದ್ದು",
    languagePreferenceDesc: "ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    voiceGuidanceDesc: "ಧ್ವನಿ ಸೂಚನೆಗಳು ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",

    // Settings Page
    settingsTitle: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    languageUpdated: "ಭಾಷೆ ನವೀಕರಿಸಲಾಗಿದೆ",

    // Voice
    listening: "ಕೇಳುತ್ತಿದೆ...",
    tapToSpeak: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    voiceCommand: "ಧ್ವನಿ ಆದೇಶ",

    // Common
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ದೋಷ",
    success: "ಯಶಸ್ವಿ",
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    back: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    skip: "ಬಿಟ್ಟುಬಿಡಿ",
  },
} as const;
