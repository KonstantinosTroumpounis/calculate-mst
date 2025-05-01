import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import common_en from '../public/locales/en/translation.json'
import common_gr from '../public/locales/gr/translation.json'

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "gr"],
    fallbackLng: "en",
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
    // backend: {
    //   loadPath: "/calculate_mst/locales/{{lng}}/translation.json"
    // },
    resources: {
      en: {
        common: common_en,
      },
      gr: {
        common: common_gr,
      },
    },
    ns: ["common"],
    interpolation: {
      escapeValue: false, // React already escapes content
    },
  });

export default i18n;