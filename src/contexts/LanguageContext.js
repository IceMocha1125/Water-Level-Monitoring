import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Dashboard
    welcome: "Welcome to Cupang Proper Water Level Monitoring System",
    location: "Balanga City, Bataan",
    systemDescription: "This system helps monitor and track water levels in Cupang Proper, providing real-time data and alerts to ensure the safety and well-being of our community.",
    realTimeMonitoring: "Real-time Monitoring",
    monitoringDescription: "Track water levels every 10 minutes with our automated monitoring system.",
    residentManagement: "Resident Management",
    residentDescription: "Manage resident information and contact details for emergency alerts.",
    notifications: "Notifications",
    notificationDescription: "Configure alerts and notification preferences for water level updates.",
    
    // Navigation
    dashboard: "Dashboard",
    waterLevel: "Water Level",
    residents: "Residents",
    helpAndSupport: "Help & Support",
    settings: "Settings",
    logout: "Logout",
    
    // Settings
    darkMode: "Dark Mode",
    enableNotifications: "Enable Notifications",
    language: "Language",
    autoRefreshData: "Auto Refresh Data",
    refreshInterval: "Refresh Interval (minutes)",
    resetToDefaults: "Reset to Defaults",
    settingsUpdated: "Settings updated successfully",
    
    // Water Levels
    normal: "Normal",
    low: "Low",
    high: "High",
    critical: "Critical",
    currentWaterLevel: "Current Water Level",
    lastUpdate: "Last Update",
    waterLevelHistory: "Water Level History",
    downloadReport: "Download Report",
    
    // Alerts
    alertPrefix: "ALERT",
    waterLevelAt: "Water level at Cupang Proper is",
    takePrecautions: "Please take necessary precautions.",
  },
  tl: {
    // Dashboard
    welcome: "Maligayang Pagdating sa Sistema ng Pagsubaybay ng Antas ng Tubig sa Cupang Proper",
    location: "Lungsod ng Balanga, Bataan",
    systemDescription: "Ang sistemang ito ay tumutulong sa pagsubaybay at pagtatala ng antas ng tubig sa Cupang Proper, nagbibigay ng real-time na datos at mga alerto upang matiyak ang kaligtasan at kapakanan ng ating komunidad.",
    realTimeMonitoring: "Real-time na Pagsubaybay",
    monitoringDescription: "Subaybayan ang antas ng tubig bawat 10 minuto gamit ang aming automated monitoring system.",
    residentManagement: "Pamamahala ng mga Residente",
    residentDescription: "Pamahalaan ang impormasyon at contact details ng mga residente para sa mga emergency alert.",
    notifications: "Mga Abiso",
    notificationDescription: "I-configure ang mga alerto at notification preferences para sa mga update sa antas ng tubig.",
    
    // Navigation
    dashboard: "Dashboard",
    waterLevel: "Antas ng Tubig",
    residents: "Mga Residente",
    helpAndSupport: "Tulong at Suporta",
    settings: "Mga Setting",
    logout: "Mag-logout",
    
    // Settings
    darkMode: "Dark Mode",
    enableNotifications: "Paganahin ang mga Abiso",
    language: "Wika",
    autoRefreshData: "Auto-refresh ng Data",
    refreshInterval: "Refresh Interval (minuto)",
    resetToDefaults: "I-reset sa Default",
    settingsUpdated: "Matagumpay na na-update ang mga setting",
    
    // Water Levels
    normal: "Normal",
    low: "Mababa",
    high: "Mataas",
    critical: "Kritikal",
    currentWaterLevel: "Kasalukuyang Antas ng Tubig",
    lastUpdate: "Huling Update",
    waterLevelHistory: "Kasaysayan ng Antas ng Tubig",
    downloadReport: "I-download ang Report",
    
    // Alerts
    alertPrefix: "ALERTO",
    waterLevelAt: "Ang antas ng tubig sa Cupang Proper ay",
    takePrecautions: "Mangyaring mag-ingat at sumunod sa mga pag-iingat.",
  }
};

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
} 