import { useState } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

function InstructionModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { t } = useTranslation()

  return (
    <>
      <h3
        style={{
          cursor: "pointer",
          color: isModalVisible === true ? "orange" : "white",
          transition: "color 0.3s ease-in-out",
        }}
        onClick={() => setIsModalVisible(true)}
        onMouseOver={(e) => (e.target.style.color = "orange")}
        onMouseOut={(e) => {
          if (!isModalVisible) e.target.style.color = "white"; // Only change if modal is NOT visible
        }}
      >
        {t('HowToUse')}
      </h3>

      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            {t('HowToUse')}
          </div>
        }
        open={isModalVisible}
        centered
        footer={null}
        onCancel={() => setIsModalVisible(false)}  // Close on "X" button
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
        closable={true}
      >
        <p>
          <strong>{t('MstCalculator')}</strong> {t('Usage.1stLine')}
        </p>
        <p>
          {t('Usage.2ndLine')}
          <strong style={{padding: 3}}>{t('Kruskal')}</strong> {t('Usage.3rdLine')} <strong>{t('Prim')}</strong>.
        </p>
        <p>
          {t('Usage.4thLine')}
        </p>
        <p>
        {t('Usage.5thLine')}
        </p>
      </Modal>
    </>
  );
}

export default InstructionModal;
