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
            How to Use
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
          <strong>MST Calculator</strong> is an online application for computing Minimum Spanning
          Trees for graphs either user-built or automatically generated.
        </p>
        <p>
          MSTs are computed by uisng of one of two available algorithms:
          <strong style={{padding: 3}}>Kruskal's</strong> and <strong>Prim's</strong>.
        </p>
        <p>
          Computed MSTs can either appear after the termination of the selected
          algorithm or be observed as they are gradually created. In both cases,
          computed MSTs can be downloaded as png files.
        </p>
        <p>
          Training enables users to practice on applying Prim's or Kruskal.s
          algorithm for computing MST for app-generated graphs.
        </p>
      </Modal>
    </>
  );
}

export default InstructionModal;
