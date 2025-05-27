import { useState } from "react";
import { Layout, Row, Col, Typography, Space, Grid, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import GraphTheory from "./js/GraphTheory";
import GraphCustomize from "./js/GraphCustomize";
import InstructionModal from "./js/HowToUse";
import LanguageSelector from "./js/LanguageSelector";
import { useTranslation } from "react-i18next";
import GraphTrainningCustomize from "./js/GraphTrainningCustomize";
import './styleApp.css'

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { Header, Content, Sider } = Layout;

function App() {
  const [addNode, setAddNode] = useState(false);
  const [finishCustomize, setFinishCustomize] = useState(false);
  const [buildOwnGraphPressed, setbuildOwnGraphPressed] = useState(false);
  const [isAlgorithmFinished, setIsAlgorithmFinished] = useState(false);
  const [isGraphDownloaded, setisGraphDownloaded] = useState(false);
  const [IsGraphCleared, setIsGraphCleared] = useState(false)
  const [isTrainingModeOn, setIsTrainingModeOn] = useState(false);
  const [regeratorGraph, setRegeratorGraph] = useState(0)
  const [trainAlgoFinished, setTrainAlgoFinished] = useState(false)
  const [runningAlgorithm, setRunningAlgorithm] = useState("");
  const [trainNodeIs, setTrainNodeIs] = useState({
    runningAlgo: undefined,
    startingNode: undefined
  })
  const [randomGraph, setRandomGraph] = useState({
    numberOfNodes: undefined,
    numberOfVertices: undefined,
    rangeOfWeights: undefined,
  });
  const [edgesAndWeights, setEdgesAndWeights] = useState({
    fromNode: undefined,
    untilNode: undefined,
    weightsNode: undefined,
  });
  const [starterPrim, setStarterPrim] = useState({
    startingNode: undefined,
    options: undefined,
  });
  const [kruskalAlg, setKruskalAlg] = useState({
    options: undefined,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { t } = useTranslation()
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const selectedTrainningAlgo = (data, algo) => {
    if (algo == 'kruskalIsOn') {
      setTrainNodeIs({
        algo: algo,
        startingNode: undefined
      })
    }else {
      setTrainNodeIs({
        algo: algo,
        startingNode: data.startingNode
      })
    }
  }

  const addNodePressed = () => {
    setAddNode(!addNode);
  };

  const insertEdgesWeightsPressed = () => {
    setbuildOwnGraphPressed(!buildOwnGraphPressed);
  };

  const randomGraphCustomize = (data) => {
    setFinishCustomize(true);
    setRandomGraph({
      numberOfNodes: data.nodes,
      numberOfVertices: data.probEdges,
      rangeOfWeights: data.range,
    });
  };

  const buildGraphCustomize = (data) => {
    setFinishCustomize(true);
    setEdgesAndWeights({
      fromNode: data.fromNode,
      untilNode: data.untilNode,
      weightsNode: data.weights,
    });
  };

  const primStartingPoint = (data) => {
    setIsAlgorithmFinished(false);
    setRunningAlgorithm("prim");
    setStarterPrim({
      startingNode: data.startingNode,
      option: data.primCustomize,
    });
  };

  const kruskalConfigurations = (data) => {
    setIsAlgorithmFinished(false);
    setRunningAlgorithm("kruskal");
    setKruskalAlg({
      option: data.kruskalCustomize,
    });
  };

  const cleanAlgorithmStatesAfterTerminate = () => {
    setIsAlgorithmFinished(false);
    setisGraphDownloaded(false);
    setRunningAlgorithm("");
    setStarterPrim({
      startingNode: undefined,
      options: undefined,
    });
    setKruskalAlg({
      options: undefined,
    });
    setFinishCustomize(false);
  };

  const algorithmFinished = () => {
    setIsAlgorithmFinished(true);
  };

  const downloadGraph = () => {
    setisGraphDownloaded(true);
  };

  const clearGraph = () => {
    setIsGraphCleared(IsGraphCleared + 1)
  }

  const regenerateGraph = () => {
    // After random graph generation button clicked in trainning mode.
    setTrainAlgoFinished(false)
    setRegeratorGraph(regeratorGraph+1)
    setTrainNodeIs({
      algo: undefined,
      startingNode: undefined
    })
  }

  const trainningAlgoFinished = () => {
    setTrainAlgoFinished(true)
  }

  const handleTrainingMode = () => {
    setIsTrainingModeOn(prev => {
        const newState = !prev;
        if (!newState) {
            clearGraph()
        }
        return newState;
    });
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const headerContent = () => (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "flex-start" : "center",
          alignItems: "center",
          gap: "16px",
          flex: 1,
        }}
      >
        <InstructionModal />
        <span style={{ fontWeight: "bold", color: "white" }}>|</span>
        <h3
          onClick={handleTrainingMode}
          style={{
            cursor: "pointer",
            color: isTrainingModeOn ? "orange" : "white",
            margin: 0,
          }}
          onMouseOver={(e) => (e.target.style.color = "orange")}
          onMouseOut={(e) => {
            if (!isTrainingModeOn) e.target.style.color = "white";
          }}
        >
          {t("Training")}
        </h3>
      </div>
      {
        isMobile && 
          <hr/>
      }
      <div
        style={{
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "flex-start" : "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LanguageSelector isMobile={isMobile}/>
      </div> 
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
        }}
      >
        {/* Left-aligned */}
        <h3
          onClick={handleRefreshPage}
          onMouseOver={(e) => (e.target.style.color = "orange")}
          onMouseOut={(e) =>  (e.target.style.color = "white")}
          style={{ 
            color: "white", 
            whiteSpace: "nowrap", 
            cursor: 'pointer' 
          }}
        >
          {t('MstCalculator')}
        </h3>
        {isMobile ? (
          <>
            <MenuOutlined
              onClick={() => setDrawerOpen(true)}
              style={{ fontSize: 20, color: "white", cursor: "pointer" }}
            />
            <Drawer
              title={
                <span style={{ color: 'white', fontSize: '18px' }}>
                  {t("Menu")}
                </span>
              }
              placement="right"
              style={{backgroundColor:'#001529' }}
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
            >
              {headerContent()}
            </Drawer>
          </>
        ) : (
          headerContent()
        )}
      </Header>
      <Content style={{ padding: "0 24px", background: "#F5F5F5" }}>
        <Layout style={{ flex: 1 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={6}>
            {/* <Col xs={24} md={6}> */}
              <Sider
                style={{
                  background: "#F5F5F5",
                  padding: "16px",
                  // width: "100%",
                }}
                width="100%"
              >
                {
                  isTrainingModeOn == true ? 
                    <GraphTrainningCustomize
                      isTrainingModeOn={isTrainingModeOn}
                      selectedTrainningAlgo={selectedTrainningAlgo}
                      trainNodeIs={trainNodeIs}
                      handleTrainingMode={handleTrainingMode}
                      regenerateGraph={regenerateGraph}
                      downloadGraph={downloadGraph}
                      trainAlgoFinished={trainAlgoFinished}
                    />
                  :
                    <GraphCustomize
                      addNodePressed={addNodePressed}
                      finishCustomize={finishCustomize}
                      insertEdgesWeightsPressed={insertEdgesWeightsPressed}
                      randomGraphCustomize={randomGraphCustomize}
                      buildGraphCustomize={buildGraphCustomize}
                      primStartingPoint={primStartingPoint}
                      kruskalConfigurations={kruskalConfigurations}
                      isAlgorithmFinished={isAlgorithmFinished}
                      runningAlgorithm={runningAlgorithm}
                      downloadGraph={downloadGraph}
                      clearGraph={clearGraph}
                      IsGraphCleared={IsGraphCleared}
                      isTrainingModeOn={isTrainingModeOn}
                    />
                }
              </Sider>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            {/* <Col xs={24} md={18}> */}
              <Content style={{ padding: "16px" }}>
                <GraphTheory
                  nodeAdded={addNode}
                  addNodePressed={addNodePressed}
                  insertEdgesWeightsPressed={insertEdgesWeightsPressed}
                  buildOwnGraphPressed={buildOwnGraphPressed}
                  randomGraph={randomGraph}
                  edgesAndWeights={edgesAndWeights}
                  primStarting={starterPrim}
                  kruskalConfigurations={kruskalAlg}
                  cleanAlgorithmStatesAfterTerminate={
                    cleanAlgorithmStatesAfterTerminate
                  }
                  isAlgorithmFinished={isAlgorithmFinished}
                  algorithmFinished={algorithmFinished}
                  runningAlgorithm={runningAlgorithm}
                  isGraphDownloaded={isGraphDownloaded}
                  IsGraphCleared={IsGraphCleared}
                  isTrainingModeOn={isTrainingModeOn}
                  trainNodeIs={trainNodeIs}
                  regeratorGraph={regeratorGraph}
                  trainningAlgoFinished={trainningAlgoFinished}
                />
              </Content>
            </Col>
          </Row>
        </Layout>
      </Content>
    </Layout>
  );
}

export default App;
