import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ht from "./locales/ht.json";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
    ht: { translation: ht },
    fr: { translation: fr },
    en: { translation: en },
    es: { translation: es },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "fr",
        supportedLngs: ["ht", "fr", "en", "es"],
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
            lookupLocalStorage: "lf-lang",
        },
    });

export default i18n;

export const SUPPORTED_LANGUAGES = [
    { code: "ht", label: "Kreyòl", flag: "🇭🇹" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "es", label: "Español", flag: "🇪🇸" },
];
