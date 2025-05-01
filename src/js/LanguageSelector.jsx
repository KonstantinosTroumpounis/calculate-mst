import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector(props) {
  const { i18n, t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);

    // Save the selected language to localStorage
    localStorage.setItem("language", selectedLanguage);
  }, [selectedLanguage, i18n]);

  const changeLanguage = (value) => {
    setSelectedLanguage(value);
  };

  return (
    <div
      style={{
        color: "white",
        cursor: "pointer",
        display: "flex",
        flexDirection: props.isMobile ? "column" : "row",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h3
        onClick={() => changeLanguage("en")}
        style={{
          marginRight: 5,
          color: selectedLanguage === "en" ? "orange" : "white",
        }}
      >
        {t('English')}
      </h3>
      <span style={{ fontWeight: "bold", color: "white" }}>|</span>
      <h3
        onClick={() => changeLanguage("gr")}
        style={{
          marginRight: 5,
          color: selectedLanguage === "gr" ? "orange" : "white",
        }}
      >
        {t('Greek')}
      </h3>
    </div>
  );
}

export default LanguageSelector;
