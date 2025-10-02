import { useState, useEffect } from "react";
import cytoscape from "cytoscape";
import { Button, notification, Tag, Segmented } from "antd";
import { StepForwardOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import GraphTrainning from "./GraphTrainning";

function GraphTheory(props) {
  const [cy, setCy] = useState(undefined);
  const [currentLetter, setCurrentLetter] = useState("`");
  const [step, setStep] = useState(0);
  const [saveNodes, setSaveNodes] = useState([{ data: { id: "a" } }]);
  const [saveWeights, setSaveWeights] = useState([]);
  const [primResults, setPrimResults] = useState([]);
  const [kruskalResults, setKruskalResults] = useState([]);
  const [totalWeigthsAre, setTotalWeightsAre] = useState(0);
  const [graphView, setGraphView] = useState(0);
  const [saveTrainningWeights, setSaveTrainningWeights] = useState(0)

  const { t } = useTranslation()

  useEffect(() => {
    // Initialize Cytoscape after component mounts
    const cy = cytoscape({
      container: document.getElementById("cy"),
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            "background-color": "#666",
            label: "data(id)",
          },
        },
        {
          // selector: 'edge',
          style: {
            width: 1,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: "random",
        fit: true,
      },
      zoom: 10,
      maxZoom: 1,
      minZoom: 0.7,
    });
    setCy(cy);
    // Clean up function to remove Cytoscape instance when component unmounts
    return () => {
      cy.destroy();
    };
  }, []);

  useEffect(() => {
    if (props.nodeAdded && cy !== undefined) {
      addNode();
    }
    if (props.buildOwnGraphPressed) {
      addEdge();
    }
  }, [props.nodeAdded, cy, props.buildOwnGraphPressed]);

  useEffect(() => {
    if (props.primStarting.startingNode !== undefined && cy !== undefined) {
      const found = saveNodes.find(
        (node) => node.data.id === props.primStarting.startingNode
      );
      if (found != undefined) {
        resetColorGraphAfterChangeStartingPoint();
        clearInnerStates();
        let prim = primAlgorithm(saveWeights, props.primStarting.startingNode);

        const elements = makeGraphCytospaceFriendly(prim)

        setPrimResults(elements)
        if (props.primStarting.option === "finalGraph") {
          let sumWeight = elements.reduce(
            (acc, edge) => acc + parseInt(edge.data.weight),
            0
          );
          elements.map((edge) => {
            cy.$(`#${edge.data.id}`).style({
              "line-color": "orange",
              label: edge.data.weight,
            });
          });

          setTotalWeightsAre(sumWeight);
          setGraphView(0);
          props.algorithmFinished();
          return notification.success({
            message: `${t("GraphTheory.algorithmFinished")}`,
            placement: "top",
            duration: 5,
          });
        }
      } else {
        if (props.primStarting.startingNode == undefined) {
          setStep(0);
        } else {
          return notification.error({
            message: `Vertex can't be found`,
            duration: 0,
          });
        }
      }
    }
  }, [props.primStarting]);

  useEffect(() => {
    resetColorGraphAfterChangeStartingPoint();
    clearInnerStates();
    let kruskalMst = kruskalAlgorithm(saveWeights);

    const kruskalElements = kruskalMst.map((kruskal) => {
      return {
        data: {
          id: `${kruskal.source}-${kruskal.target}`, // Unique ID for the edge
          source: kruskal.source, // ID of the source node
          target: kruskal.target, // ID of the target node
          weight: kruskal.weight, // Weight of the edge
        },
      };
    });

    setKruskalResults(kruskalElements);
    if (props.kruskalConfigurations.option === "finalGraph") {
      let sumWeight = kruskalElements.reduce(
        (acc, edge) => acc + parseInt(edge.data.weight),
        0
      );
      kruskalElements.map((edge) => {
        cy.$(`#${edge.data.id}`).style({
          "line-color": "orange",
          label: edge.data.weight,
        });
      });

      setTotalWeightsAre(sumWeight);

      props.algorithmFinished();
      setGraphView(0);
      return notification.success({
        message: `${t("GraphTheory.algorithmFinished")}`,
        placement: "top",
        duration: 5,
      });
    }
  }, [props.kruskalConfigurations]);

  useEffect(() => {
    if (props.randomGraph && cy !== undefined) {
      generateRandomGraph(
        props.randomGraph.numberOfNodes,
        props.randomGraph.rangeOfWeights,
        props.randomGraph.numberOfVertices
      );
    }
  }, [props.randomGraph]);

  useEffect(() => {
    if (props.isGraphDownloaded) {
      downloadImg();
    }
  }, [props.isGraphDownloaded]);

  useEffect(() => {
    if (props.IsGraphCleared > 0) {
      triggerClearGraph();
    }
  }, [props.IsGraphCleared]);

  useEffect(() => {
    //TODO: When the one algorith is executed we have to erase the data from the other one
    const algorithmName = props.runningAlgorithm == "prim" ? "Prim" : "Kruskal";
    let selectedAlg =
      props.runningAlgorithm == "prim" ? primResults : kruskalResults;

    if (step >= selectedAlg.length && step > 0) {
      props.algorithmFinished();
      setGraphView(0);
      notification.success({
        message: `${t("GraphTheory.algorithmFinished")}`,
        placement: "top",
        duration: 5,
      });
    }
  }, [step]);

  useEffect(() => {
    if (graphView == 1) {
      resetColorGraphAfterChangeStartingPoint();
    } else {
      addColorGraphBack();
    }
  }, [graphView]);

  const addNode = () => {
    let nodeNames = cy.nodes().map((node) => node.id());
    let nodesLen = nodeNames.length;

    // Determine the ASCII code and new node ID
    let lastNodeCharCode =
      nodesLen > 0
        ? nodeNames[nodesLen - 1].charCodeAt(0)
        : currentLetter.charCodeAt(0);
    let nextNodeId = String.fromCharCode(lastNodeCharCode + 1);

    // Determine the position of the new node
    let position =
      nodesLen > 0
        ? cy.getElementById(String.fromCharCode(lastNodeCharCode)).position()
        : {
            x: Math.floor(Math.random() * 3),
            y: Math.floor(Math.random() * 3),
          };

    let nextNode = { data: { id: nextNodeId } };

    // Add more space between the position of the nodes
    position = {
      x: position.x + 25,
      y: position.y + 25,
    };

    // If do-not remember :( ??
    if (saveNodes.length > 1) {
      let lastNodeIs = saveNodes;
    }

    cy.add({
      group: "nodes",
      data: {
        id: nextNodeId,
      },
      position: position,
    });
    setSaveNodes((prevData) => [...prevData, nextNode]);
    setCurrentLetter(nextNodeId);
    props.addNodePressed();
  };

  const addEdge = () => {
    const fromNode = props.edgesAndWeights.fromNode;
    const toNode = props.edgesAndWeights.untilNode;
    const weight = props.edgesAndWeights.weightsNode;

    const structureWeight = {
      data: {
        id: fromNode + "-" + toNode,
        source: fromNode,
        target: toNode,
        weight: weight,
      },
    };

    // Check if both nodes exist in the graph
    if (
      cy.getElementById(fromNode).empty() ||
      cy.getElementById(toNode).empty()
    ) {
      console.error("One or both nodes do not exist in the graph");
      return notification.error({
        message: `One or both nodes do not exist in the graph`,
        duration: 0,
      });
    }

    cy.add({
      group: "edges",
      data: {
        id: fromNode + "-" + toNode, // Unique ID for the edge
        source: fromNode,
        target: toNode,
        weight: weight,
      },
    });
    cy.style()
      .selector("edge")
      .style({
        label: "data(weight)", // Display weight as edge label
        "text-background-color": "white",
        "text-background-opacity": 1,
        "text-background-padding": "3px",
        "text-valign": "center",
        "text-halign": "center",
      })
      .update();
    setSaveWeights((prevData) => [...prevData, structureWeight]);
    props.insertEdgesWeightsPressed();
  };

  const getRandomWeight = (numWeights) => {
    return (Math.floor(Math.random() * (numWeights[1] - numWeights[0] + 1)) + numWeights[0])
  }

  const generateRandomGraph = (numNodes, numWeights, numEdges) => {
    // Clear existing nodes and edges
    cy.elements().remove();

    const edgeSet = new Set(); // To track unique connections

    // Add random nodes
    const randomNodes = [];
    for (let i = 0; i < numNodes; i++) {
      const nodeId = String.fromCharCode(97 + i); // Generate node ID ('a', 'b', 'c', ...)
      randomNodes.push({ data: { id: nodeId } });
    }
    cy.add(randomNodes);
    setSaveNodes(randomNodes);

    const randomEdges = [];

    for (let i = 1; i < numNodes; i++) {
      const source = randomNodes[i].data.id
      const target = randomNodes[Math.floor(Math.random() * i)].data.id;

      const pairKey1 = `${source}-${target}`;
      const pairKey2 = `${target}-${source}`;

      if (source == target || edgeSet.has(pairKey1) || edgeSet.has(pairKey2)) // avoid self route like b-b
          continue;

      edgeSet.add(pairKey1); // Save connection
      // const weight1 = Math.floor(Math.random() * (numWeights[1] - numWeights[0] + 1)) + numWeights[0];
      randomEdges.push({
        data: {
          id: pairKey1,
          source: source,
          target: target,
          weight: getRandomWeight(numWeights),
        },
      });
    }

    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        // Connect each node to all other nodes except itself and previous ones
        let ran = Math.random();
        const sourceNodeId = randomNodes[i].data.id;
        const targetNodeId = randomNodes[j].data.id;
        
        const pairKey1 = `${sourceNodeId}-${targetNodeId}`;
        const pairKey2 = `${targetNodeId}-${sourceNodeId}`;

        if (ran < numEdges &&
          sourceNodeId !== targetNodeId &&
          !edgeSet.has(pairKey1) &&
          !edgeSet.has(pairKey2)) {

          edgeSet.add(pairKey1)
          randomEdges.push({
            data: {
              id: pairKey1,
              source: sourceNodeId,
              target: targetNodeId,
              weight: getRandomWeight(numWeights),
            },
          });
        }
      }
    }

    cy.add(randomEdges);
    setSaveWeights(randomEdges);

    // Layout the graph
    cy.layout({ name: "random" }).run();

    cy.style()
      .selector("node")
      .style({
        label: "data(id)",
        "background-color": "#666",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
      })
      .selector("edge")
      .style({
        label: "data(weight)",
        "line-color": "#ccc",
        "text-background-color": "white",
        "text-background-opacity": 1,
        "text-background-padding": "3px",
        "text-valign": "center",
        "text-halign": "center",
      })
      .update();
  };

  const primAlgorithm = (edges, startNode) => {
    //TODO: Make a rework if the node has not edges
    setSaveTrainningWeights(0)
    // Set of nodes already included in MST
    const mstSet = new Set();
    // Array to store the MST edges
    const mstEdges = [];
    // Map to store node connections and weights
    const nodeMap = {};

    // Create a node map for easy edge lookup
    edges.forEach((edge) => {
      const { source, target, weight } = edge.data;
      if (!nodeMap[source]) nodeMap[source] = [];
      if (!nodeMap[target]) nodeMap[target] = [];
      nodeMap[source].push({ target, weight });
      nodeMap[target].push({ target: source, weight });
    });

    // Priority queue to store edges as [weight, source, target]
    let priorityQueue = [];
    // Initialize with the startNode
    mstSet.add(startNode);
    if (nodeMap[startNode]) {
      for (let { target, weight } of nodeMap[startNode]) {
        priorityQueue.push([weight, startNode, target]);
      }
    }

    // Convert priority queue to a heap (optional for efficiency)
    priorityQueue.sort((a, b) => a[0] - b[0]);
    while (mstSet.size < Object.keys(nodeMap).length) {
      // Get the edge with the smallest weight
      let [weight, source, target] = priorityQueue.shift();

      // If the target node is already in the MST, continue
      if (mstSet.has(target)) continue;

      // Add the edge to the MST
      mstEdges.push({ source, target, weight });
      // Add the new node to the MST set
      mstSet.add(target);

      // Add all edges from the newly added node to the priority queue
      if (nodeMap[target]) {
        for (let { target: nextTarget, weight: nextWeight } of nodeMap[
          target
        ]) {
          if (!mstSet.has(nextTarget)) {
            priorityQueue.push([nextWeight, target, nextTarget]);
          }
        }
      }

      // Sort the priority queue by weight (optional if using a real priority queue)
      priorityQueue.sort((a, b) => a[0] - b[0]);
    }

    return mstEdges;
  };

  const makeGraphCytospaceFriendly = (algValues) => {
    return algValues.map((edge) => {
      //* Map the prim results with the routes we give
      let reverseExists = false;

      saveWeights.some((ref) => {
        if (
          ref.data.source === edge.target &&
          ref.data.target === edge.source
        ) {
          reverseExists = true;
          return true; // Stop iteration
        }
        return false;
      });

      const source = reverseExists ? edge.target : edge.source;
      const target = reverseExists ? edge.source : edge.target;

      return {
        data: {
          id: `${source}-${target}`, // Unique ID for the edge
          source: source,
          target: target,
          weight: edge.weight,
        },
      };
    });
  }

  const find = (parent, node) => {
    if (parent[node] === undefined) {
      parent[node] = node; // Initialize parent
    }
    if (parent[node] !== node) {
      parent[node] = find(parent, parent[node]); // Path compression
    }
    return parent[node];
  };

  const union = (parent, node1, node2) => {
    const root1 = find(parent, node1);
    const root2 = find(parent, node2);
    if (root1 !== root2) {
      parent[root2] = root1;
      return true; // Union was successful
    }
    return false; // Already in the same set
  };

  const kruskalAlgorithm = (weigths) => {
    setSaveTrainningWeights(0)
    setTotalWeightsAre(0);
    let totalGraphPath = [];
    let mst = [];
    const parent = {};

    totalGraphPath = weigths.map((item) => item.data);
    totalGraphPath.sort((a, b) => a.weight - b.weight);

    for (const edge of totalGraphPath) {
      const { source, target, weight } = edge;

      // By using union and find we use the Disjoint-set data structure

      if (union(parent, source, target)) {
        mst.push({ source, target, weight });
      }

      // Stop early if the MST is complete
      // if (mst.length === saveWeights.length - 1) {
      //   break;
      // }
    }

    return mst;
  };

  const getAlgorithStepByStep = (algorunning) => {
    const selectedAlg =
      props.runningAlgorithm == "prim" ? primResults : kruskalResults;

    cy.$(`#${selectedAlg[step].data.id}`).style({
      "line-color": "orange",
      label: selectedAlg[step].data.weight,
    });
    setStep(step + 1);
    setTotalWeightsAre(
      (prevTotal) => prevTotal + parseInt(selectedAlg[step].data.weight)
    );
  };

  const clearInnerStates = () => {
    setStep(0);
    setTotalWeightsAre(0);

    if (props.runningAlgorithm == "prim") {
      setKruskalResults([]);
    } else {
      setPrimResults([]);
    }
  };

  const resetColorGraphAfterChangeStartingPoint = () => {
    // Check if i can delete there the data
    saveWeights.forEach((edgeId) => {
      cy.$(`#${edgeId.data.id}`).style({
        "line-color": "#ccc",
      });
    });
  };

  const addColorGraphBack = () => {
    let selectedAlg =
      props.runningAlgorithm == "prim" ? primResults : kruskalResults;
    selectedAlg.map((edge) => {
      cy.$(`#${edge.data.id}`).style({
        "line-color": "orange",
        label: edge.data.weight,
      });
    });
  };

  const toggleInitCompletedGraph = (value) => {
    setGraphView(value === t("GraphTheory.InitialGraph") ? 1 : 0);
  };

  const triggerClearGraph = () => {
    cy.elements().remove();
    setCurrentLetter("`");
    props.cleanAlgorithmStatesAfterTerminate();
  };

  const downloadImg = () => {
    let currDate = new Date().toLocaleDateString();
    let currTime = new Date().toLocaleTimeString();
    const imageData = cy.png({ full: true }); // Export as PNG
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `mst_${props.runningAlgorithm}_${currDate}_${currTime}.png`;
    link.click();
  };

  const addWeightInTraining = (weights) => {
    setSaveTrainningWeights(weights)
  }

  return (
    <>
      <div
        id="cy"
        style={{
          width: "100%",
          height: "650px",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        {/** Show resutls on Traininng mode */}
        {props.isTrainingModeOn && props.trainNodeIs && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "white",
              padding: "10px",
              zIndex: 10,
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              maxWidth: "90%",
              justifyContent: "center",
            }}
          >
            {props.trainNodeIs.algo === "primIsOn" && (
              <>
                <Tag style={{ marginTop: 5 }} color="cyan">
                  {t("GraphTheory.PrimAlgorithm")}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="green">
                  {t("GraphTheory.Source")}: {props.trainNodeIs.startingNode}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="red">
                  {t("GraphTheory.Weights")}: {saveTrainningWeights}
                </Tag>
              </>
            )}

            {props.trainNodeIs.algo === "kruskalIsOn" && (
              <>
                <Tag style={{ marginTop: 5 }} color="cyan">
                  {t("GraphTheory.KruskalAlgorithm")}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="red">
                  {t("GraphTheory.Weights")}: {saveTrainningWeights}
                </Tag>
              </>
            )}
          </div>
        )}
        {/* Algorithm Info Panel for simple execution */}
        {(props.primStarting.option === "stepByStep" ||
          props.primStarting.option === "finalGraph" ||
          props.kruskalConfigurations.option === "stepByStep" ||
          props.kruskalConfigurations.option === "finalGraph") && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "white",
              padding: "10px",
              zIndex: 10,
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              maxWidth: "90%",
              justifyContent: "center",
            }}
          >
            {props.runningAlgorithm == "prim" && (
              <>
                <Tag style={{ marginTop: 5 }} color="cyan">
                  {t("GraphTheory.PrimAlgorithm")}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="green">
                  {t("GraphTheory.Source")}: {props.primStarting.startingNode}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="red">
                  {t("GraphTheory.Weights")}: {totalWeigthsAre}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="orange">
                  {props.primStarting.option === "stepByStep"
                    ? t("GraphTheory.StepByStepExecution")
                    : t("GraphTheory.FinalExecution")}
                </Tag>
              </>
            )}
            {props.runningAlgorithm == "kruskal" && (
              <>
                <Tag style={{ marginTop: 5 }} color="cyan">
                  {t("GraphTheory.KruskalAlgorithm")}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="red">
                  {t("GraphTheory.Weights")}: {totalWeigthsAre}
                </Tag>
                <Tag style={{ marginTop: 5 }} color="orange">
                  {props.kruskalConfigurations.option === "stepByStep"
                    ? t("GraphTheory.StepByStepExecution")
                    : t("GraphTheory.FinalExecution")}
                </Tag>
              </>
            )}
          </div>
        )}

        {/* Graph View Switcher */}
        {props.isAlgorithmFinished && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            <Segmented
              options={[t("GraphTheory.InitialGraph"), t("GraphTheory.ComputedMST")]}
              value={graphView == 0 ? t("GraphTheory.ComputedMST") : t("GraphTheory.InitialGraph")}
              onChange={toggleInitCompletedGraph}
            />
          </div>
        )}
      </div>

      {
        // TODO: Change the clear graph and add it into GraphCustomize
      }
      {/* <Button
        type="primary"
        onClick={triggerClearGraph}
        disabled={
          props.primStarting.option === "stepByStep" &&
          step < primResults.length
        }
        style={{ marginTop: 10 }}
      >
        Clear graph
      </Button> */}
      {((props.primStarting.option == "stepByStep" &&
        step < primResults.length) ||
        (props.kruskalConfigurations.option == "stepByStep" &&
          step < kruskalResults.length)) && (
        <Button
          type="primary"
          shape="circle"
          style={{ marginLeft: 4 }}
          disabled={step >= primResults.length && step >= kruskalResults.length}
          onClick={() =>
            props.kruskalConfigurations.option == "stepByStep"
              ? getAlgorithStepByStep("kruskal")
              : props.primStarting.option == "stepByStep"
              ? getAlgorithStepByStep("prim")
              : undefined
          }
        >
          <StepForwardOutlined />
        </Button>
      )}
      {props.isTrainingModeOn && (
        <GraphTrainning
          cy={cy}
          trainingMode={props.isTrainingModeOn}
          triggerClearGraph={triggerClearGraph}
          isGraphCleared={props.IsGraphCleared}
          trainNodeIs={props.trainNodeIs}
          primAlgorithm={primAlgorithm}
          kruskalAlgorithm={kruskalAlgorithm}
          makeGraphCytospaceFriendly={makeGraphCytospaceFriendly}
          addWeightInTraining={addWeightInTraining}
          regeratorGraph={props.regeratorGraph}
          trainningAlgoFinished={props.trainningAlgoFinished}
        />
      )}
    </>
  );
}

export default GraphTheory;
