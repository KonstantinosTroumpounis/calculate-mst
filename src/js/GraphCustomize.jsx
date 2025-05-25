import { useState, useEffect } from "react";
import {
  Button,
  Input,
  InputNumber,
  Modal,
  Form,
  Slider,
  Radio,
  Card,
  Typography,
  Divider,
  Grid,
} from "antd";
import { useTranslation } from "react-i18next";

function GraphCustomize(props) {
  const [randomGraph, setRandonGraph] = useState(false);
  const [showPrim, setShowPrim] = useState(false);
  const [showKruskal, setShowKruskal] = useState(false);
  const [buildGraph, setBuildGraph] = useState(false);
  const [buildGraphModal, setBuildGraphModal] = useState(false);
  const [rangeValues, setRangeValues] = useState([20, 50]);
  const [probabilityRange, setprobabilityRange] = useState(0.5);

  const { Title, Paragraph } = Typography;
  const { useBreakpoint } = Grid;

  const { t } = useTranslation()

  const breakpoints = useBreakpoint(); // Get current screen size

  const submitRandomGraph = (values) => {
    values.range = rangeValues;
    values.probEdges = probabilityRange;
    setRandonGraph(false);
    props.randomGraphCustomize(values);
  };

  const submitEdgesAndWeights = (values) => {
    setBuildGraphModal(false);
    props.insertEdgesWeightsPressed();
    props.buildGraphCustomize(values);
  };

  const submitPrimSelections = (value) => {
    setShowPrim(false);
    props.primStartingPoint(value);
  };

  const submitKruskalSelections = (value) => {
    setShowKruskal(false);
    props.kruskalConfigurations(value);
  };

  const marks = {
    0: "0",
    20: "20",
    50: "50",
    100: "100",
  };

  const generateGraphModal = () => {
    return (
      <Modal
        title={t("GraphCustomize.CustomizeYourGraph")}
        open={randomGraph}
        onCancel={() => setRandonGraph(false)}
        footer={[]}
      >
        <Form onFinish={submitRandomGraph}>
          <Form.Item
            name={"nodes"}
            rules={[
              {
                required: true,
                message: t("GraphCustomize.NumberOfVerticesReq"),
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <InputNumber addonBefore={t("GraphCustomize.NumberOfVertices")} placeholder="10 etc" min={2} max={15}/>
          </Form.Item>
          <Form.Item name={"probEdges"} labelCol={{ span: 6 }}>
            <div>
              <p>{t("GraphCustomize.ProbabilityOfEdges")}</p>
              <Slider
                marks={{
                  0: "0",
                  0.5: "0.5",
                  1: "1",
                }}
                max={1}
                min={0}
                step={0.01}
                defaultValue={0.5}
                onChange={(val) => {
                  setprobabilityRange(val);
                }}
                // onChangeComplete={onChangeComplete}
              />
            </div>
          </Form.Item>
          <Form.Item name={"range"} labelCol={{ span: 6 }}>
            <div>
              <p>{t("GraphCustomize.RangeOfEeights")}</p>
              <Slider
                range
                step={1}
                marks={marks}
                defaultValue={rangeValues}
                onChange={(val) => {
                  setRangeValues(val);
                }}
                // onChangeComplete={onChangeComplete}
              />
            </div>
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            {t("Submit")}
          </Button>
        </Form>
      </Modal>
    );
  };

  const primOnSteroids = () => {
    return (
      <Modal
        title={t("GraphCustomize.CustomizePrimAlgorithm")}
        open={showPrim}
        onCancel={() => setShowPrim(false)}
        footer={[]}
      >
        <Form onFinish={submitPrimSelections}>
          <Form.Item
            name={"startingNode"}
            rules={[
              {
                required: true,
                message: "Starting point required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore={t("StartingPoint")} placeholder="a" />
          </Form.Item>
          <Form.Item
            name={"primCustomize"}
            rules={[
              {
                required: true,
                message: "Customization for Prim required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Radio.Group
              options={[
                { label: t("FinalGraph"), value: "finalGraph" },
                { label: t("StepByStep"), value: "stepByStep" },
              ]}
              // onChange={onChange1}
              // value={value1}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            {t("Submit")}
          </Button>
        </Form>
      </Modal>
    );
  };

  const kruskalOnSteroids = () => {
    return (
      <Modal
        title={t("GraphCustomize.CustomizeKruskalAlgorithm")}
        open={showKruskal}
        onCancel={() => setShowKruskal(false)}
        footer={[]}
      >
        <Form onFinish={submitKruskalSelections}>
          <Form.Item
            name={"kruskalCustomize"}
            rules={[
              {
                required: true,
                message: "Customization for Kruskal required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Radio.Group
              options={[
                { label: t("FinalGraph"), value: "finalGraph" },
                { label: t("StepByStep"), value: "stepByStep" },
              ]}
              // onChange={onChange1}
              // value={value1}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            {t("Submit")}
          </Button>
        </Form>
      </Modal>
    );
  };

  const addYourEdgesAndWeights = () => {
    return (
      <Modal
        title={t("GraphCustomize.AddAdgesAndWeightOnYourGraph")}
        open={buildGraphModal}
        onCancel={() => setBuildGraphModal(false)}
        footer={[]}
      >
        <Form onFinish={submitEdgesAndWeights}>
          <Form.Item
            name={"fromNode"}
            rules={[
              {
                required: true,
                message: t("GraphCustomize.StartingPointOfVertexRequired"),
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore={t("GraphCustomize.FromVertex")} placeholder="a etc" />
          </Form.Item>
          <Form.Item
            name={"untilNode"}
            rules={[
              {
                required: true,
                message: t("GraphCustomize.FinishingPointOfVertexRequired"),
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore={t("GraphCustomize.UntilVertex")} placeholder="b etc" />
          </Form.Item>
          <Form.Item
            name={"weights"}
            rules={[
              {
                required: true,
                message: t("GraphCustomize.NumberOfWeightRequired"),
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore={t("GraphCustomize.NumberOfWeight")} placeholder="10 etc" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            {t("Submit")}
          </Button>
        </Form>
      </Modal>
    );
  };

  return (
    <Card
      title={
        <h2 style={{ textAlign: "center", width: "100%" }}>
          {t("GraphCustomize.GenerateInstance")}
        </h2>
      }
      variant="outlined"
      style={{
        width: "100%",
        background: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => setBuildGraph(!buildGraph)}
          block={breakpoints.xs}
          disabled={props.isTrainingModeOn}
        >
          {t("GraphCustomize.BuildGraph")}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setRandonGraph(true), setBuildGraph(false);
          }}
          block={breakpoints.xs}
          disabled={props.isTrainingModeOn}
        >
          {t("GraphCustomize.GenerateGraph")}
        </Button>
      </div>
      {randomGraph && generateGraphModal()}
      {(buildGraph) && (
        <Card
          title={t("GraphCustomize.BuildYourOwnGraph")}
          variant={false}
          style={{
            background: "#f9f9f9",
            borderRadius: 8,
            padding: breakpoints.xs ? "5px" : "10px",
          }}
        >
          <Paragraph style={{ fontSize: breakpoints.xs ? "12px" : "14px" }}>
            {t("GraphCustomize.BuildYourOwnGraphDesc")}
          </Paragraph>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={() => props.addNodePressed()}
              block={breakpoints.xs}
            >
              {t("GraphCustomize.Vertex")}
            </Button>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={() => setBuildGraphModal(true)}
              block={breakpoints.xs}
            >
              {t("GraphCustomize.EdgesAndWeights")}
            </Button>
          </div>
        </Card>
      )}
      {buildGraphModal && addYourEdgesAndWeights()}
      <Divider />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {/* <h2>Apply MST Algoriths</h2> */}
        {/* <p>Kryskal</p> */}
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => setShowKruskal(true)}
          disabled={(!props.finishCustomize == true) || (props.runningAlgorithm=='prim' && !props.isAlgorithmFinished)}
          block={breakpoints.xs}
        >
          {t("Kruskal")}
        </Button>
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          // style={{
          //     marginRight: '10px',
          //     backgroundColor: props.runningAlgorithm === 'prim' ? 'orange' : '',
          //     color: props.runningAlgorithm === 'prim' ? 'white' : '' // Ensure text is visible
          // }}
          onClick={() => setShowPrim(true)}
          disabled={(!props.finishCustomize == true) || (props.runningAlgorithm=='kruskal' && !props.isAlgorithmFinished)}
          block={breakpoints.xs}
        >
          {t("Prim")}
        </Button>
      </div>

      <Divider />
      {/* <Paragraph style={{ textAlign: "center", fontSize: breakpoints.xs ? "12px" : "14px", color: "#666" }}>
                In the end you can download the MST calculated graph
            </Paragraph> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => props.downloadGraph()}
          disabled={!props.isAlgorithmFinished}
          block={breakpoints.xs}
        >
          {t("GraphCustomize.DownloadGraph")}
        </Button>
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => (props.clearGraph(), setBuildGraph(false))}
          disabled={!props.finishCustomize == true}
          block={breakpoints.xs}
        >
          {t("GraphCustomize.ClearGraph")}
        </Button>
      </div>
      {showPrim && primOnSteroids()}
      {showKruskal && kruskalOnSteroids()}
      {/* </div> */}
    </Card>
  );
}

export default GraphCustomize;
