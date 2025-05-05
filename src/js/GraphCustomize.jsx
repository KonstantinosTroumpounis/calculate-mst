import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  Slider,
  Radio,
  Card,
  Typography,
  Divider,
  Grid,
} from "antd";

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
        title="Customize your graph"
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
                message: "Number of vertices required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore="Number of vertices" placeholder="10 etc" />
          </Form.Item>
          <Form.Item name={"probEdges"} labelCol={{ span: 6 }}>
            <div>
              <p>Probability of edges</p>
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
              <p>Range of weights</p>
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
            Submit
          </Button>
        </Form>
      </Modal>
    );
  };

  const primOnSteroids = () => {
    return (
      <Modal
        title="Customize Prim algorithm"
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
            <Input addonBefore="Starting point" placeholder="a" />
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
                { label: "Final Graph", value: "finalGraph" },
                { label: "Step by Step", value: "stepByStep" },
              ]}
              // onChange={onChange1}
              // value={value1}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            Submit
          </Button>
        </Form>
      </Modal>
    );
  };

  const kruskalOnSteroids = () => {
    return (
      <Modal
        title="Customize Kruskal algorithm"
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
                { label: "Final Graph", value: "finalGraph" },
                { label: "Step by Step", value: "stepByStep" },
              ]}
              // onChange={onChange1}
              // value={value1}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            Submit
          </Button>
        </Form>
      </Modal>
    );
  };

  const addYourEdgesAndWeights = () => {
    return (
      <Modal
        title="Add edges and weight on your graph"
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
                message: "Starting point of vertex required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore="From vertex" placeholder="a etc" />
          </Form.Item>
          <Form.Item
            name={"untilNode"}
            rules={[
              {
                required: true,
                message: "Finishing point of vertex required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore="Until vertex" placeholder="b etc" />
          </Form.Item>
          <Form.Item
            name={"weights"}
            rules={[
              {
                required: true,
                message: "Number of weight required",
              },
            ]}
            labelCol={{ span: 6 }}
          >
            <Input addonBefore="Number of weight" placeholder="10 etc" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle">
            Submit
          </Button>
        </Form>
      </Modal>
    );
  };

  return (
    <Card
      title={
        <h2 style={{ textAlign: "center", width: "100%" }}>
          Generate instance
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
      {/* <Title level={4} style={{ textAlign: "center" }}>Which graph do you want to execute the algorithm on?</Title> */}

      {/* <Paragraph style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
                You can either <strong><em>build your own graph</em></strong> by adding nodes and edges, or <strong><em>generate a random graph</em></strong>.  
                Once you've created a graph, you can apply minimum spanning tree (MST) algorithms.
            </Paragraph> */}

      {/* <Divider /> */}

      {/* <Title level={5} style={{ textAlign: "center" }}>Build or generate a graph</Title> */}

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
          Build graph
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setRandonGraph(true), setBuildGraph(false);
          }}
          block={breakpoints.xs}
          disabled={props.isTrainingModeOn}
        >
          Generate graph
        </Button>
      </div>
      {randomGraph && generateGraphModal()}
      {buildGraph && (
        <Card
          title="Build your own graph"
          variant={false}
          style={{
            background: "#f9f9f9",
            borderRadius: 8,
            padding: breakpoints.xs ? "5px" : "10px",
          }}
        >
          <Paragraph style={{ fontSize: breakpoints.xs ? "12px" : "14px" }}>
            Add vertices and define edges with their respective weights to create
            your graph manually.
          </Paragraph>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={() => props.addNodePressed()}
              block={breakpoints.xs}
            >
              Vertex
            </Button>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={() => setBuildGraphModal(true)}
              block={breakpoints.xs}
            >
              Edges and weights
            </Button>
          </div>
        </Card>
      )}
      {buildGraphModal && addYourEdgesAndWeights()}
      <Divider />

      {/* <Title level={5} style={{ textAlign: "center" }}>Run MST algorithm</Title> */}
      {/* <Paragraph style={{ textAlign: "center", fontSize: breakpoints.xs ? "12px" : "14px", color: "#666" }}>
                After creating a graph, you can apply the <strong><em>Kruskal</em></strong> or
                <strong style={{marginLeft: 3}}><em>Prim</em></strong> algorithm 
                to find the minimum spanning tree (MST).
            </Paragraph> */}
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
          disabled={!props.finishCustomize == true}
          block={breakpoints.xs}
        >
          Kruskal's
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
          disabled={!props.finishCustomize == true}
          block={breakpoints.xs}
        >
          Prim's
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
          Download graph
        </Button>
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => props.clearGraph()}
          disabled={!props.finishCustomize == true}
          block={breakpoints.xs}
        >
          Clear graph
        </Button>
      </div>
      {showPrim && primOnSteroids()}
      {showKruskal && kruskalOnSteroids()}
      {/* </div> */}
    </Card>
  );
}

export default GraphCustomize;
