import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

// TODO: Bug on weights in trainning
// TODO: Block the alg buttons that run the oposite alg

function GraphTrainning(props) {

  const [finalRandomGraph, setFinalRandonGraph] = useState(false); 
  const [graphNode, setGraphNode] = useState([])
  const [algorithmStructure, setAlgorithmStructure] = useState([])
  const [stepAlg, setStepAlg] = useState(0)

  const stepAlgRef = useRef(stepAlg);
  const structuredAlgRef = useRef([]);
  const sumWeightRef = useRef(0);
  const notifiedRef = useRef(false); // Prevent multiple notifications

  // TODO: Clean up needed in the end
  const timeoutRef = useRef(null);

  useEffect(() => {
    stepAlgRef.current = stepAlg;
  }, [stepAlg]);

  useEffect(() => {
    structuredAlgRef.current = algorithmStructure;
  }, [algorithmStructure]);

  useEffect(() => {
    if (
      stepAlg >= algorithmStructure.length &&
      algorithmStructure.length > 0 &&
      !notifiedRef.current
    ) {
      notification.success({
        message: `Algorithm finished`,
        placement: 'top',
        duration: 5,
      });
      notifiedRef.current = true; // mark as notified
      props.trainningAlgoFinished()
    }
  }, [stepAlg, algorithmStructure]);

  useEffect(() => {
    generateRandomGraph()
  }, [props.regeratorGraph]);

  useEffect(() => {
    props.triggerClearGraph
  }, [props.isGraphCleared]);

  useEffect(() => {
    let structuredAlg = [];
    notifiedRef.current = false;  // reset notification flag
    setStepAlg(0); // reset user steps

    console.log('props.trainNodeIs.algo :', props.trainNodeIs.algo)
  
    if (props.trainNodeIs.algo === 'primIsOn') {
      const isNodeValid = graphNode.find(
        (node) => node.data.id === props.trainNodeIs.startingNode
      );
      
      // Notification when user type node that does not exists
      if (!isNodeValid) {
        return notification.error({
          message: `Vertex can't be found`,
          duration: 4,
        });
      }
  
      // Color starting node
      const node = props.cy.getElementById(props.trainNodeIs.startingNode);
      if (node) {
        node.style({
          'background-color': 'orange',
          'border-width': 3,
          'border-color': 'red',
          'shadow-blur': 10,
          'shadow-color': 'orange',
        });
      }
  
      const readySelectedAlgStructure = props.primAlgorithm(
        finalRandomGraph,
        props.trainNodeIs.startingNode
      );
  
      structuredAlg = props.makeGraphCytospaceFriendly(readySelectedAlgStructure);
      setAlgorithmStructure(structuredAlg); // Triggers structuredAlgRef update via another useEffect
      console.log('structuredAlg :', structuredAlg)
      // Attach listener ONCE
      props.cy.on('tap', 'edge', handleEdgeTap);
      return () => {
        props.cy.removeListener('tap', 'edge', handleEdgeTap);
      };
    }else if (props.trainNodeIs.algo === 'kruskalIsOn'){
      console.log('kruskal running')
      const readySelectedAlgStructure = props.kruskalAlgorithm(finalRandomGraph);
      structuredAlg = props.makeGraphCytospaceFriendly(readySelectedAlgStructure);
      setAlgorithmStructure(structuredAlg); // Triggers structuredAlgRef update via another useEffect
      console.log('structuredAlg :', structuredAlg)
      props.cy.on('tap', 'edge', handleEdgeTap);
      return () => {
        props.cy.removeListener('tap', 'edge', handleEdgeTap);
      };
    }
  }, [props.trainNodeIs]);


  const handleEdgeTap = (evt) => {
    const edge = evt.target;
    const currentStep = stepAlgRef.current;
    const structuredAlg = structuredAlgRef.current;
    console.log('currentStep :', currentStep)
    console.log('edge is :', edge.id())
    // Algorithm finished
    if ((currentStep) >= structuredAlg.length) return;
  
    const normalizedClickedId = normalizeEdgeId(edge.id());
    console.log('normalizedClickedId :', normalizedClickedId)
    const normalizedTargetId = normalizeEdgeId(structuredAlg[currentStep].data.id);
    console.log(' algo edge is :', normalizedTargetId)
  
    if (normalizedClickedId === normalizedTargetId) {
      edge.css({ 'line-color': 'green' })
      sumWeightRef.current += structuredAlg[currentStep].data.weight
      props.addWeightInTraining(sumWeightRef.current)

      // console.log('Matching edge ID:', matchingEdge.id())
      // console.log('Matching edge CSS:', matchingEdge.css('line-color'))

      setStepAlg((prev) => prev + 1);
      // const matchingEdge = props.cy.edges().filter(
      //   (e) => normalizeEdgeId(e.id()) === normalizedTargetId
      // )[0];

      // console.log('matchingEdge is :', matchingEdge)
      // console.log('Edges in Cytoscape:', props.cy.edges());
      // if (matchingEdge) {
      //   matchingEdge.css({ 'line-color': 'green' });
  
      //   sumWeightRef.current += structuredAlg[currentStep].data.weight;
      //   props.addWeightInTraining(sumWeightRef.current);

      //   console.log('Matching edge ID:', matchingEdge.id());
      //   console.log('Matching edge CSS:', matchingEdge.css('line-color'));
  
      //   setStepAlg((prev) => prev + 1);
      // }
    } else {
      edge.css({ 'line-color': 'red' });
      timeoutRef.current = setTimeout(() => {
        edge.css({ 'line-color': '' });
      }, 1000);
      console.log('wrong line');
    }
  };

  const normalizeEdgeId = (edge) => {
    return edge.split('-').sort().join('-');
  }

  const generateRandomGraph = () => {
      // Constansts for random graph
      props.cy.elements().remove();
      let randomGraph = []
      let min_number = 3
      let max_number = 6
      let min_weight = 1
      let max_weight = 10
      let randomConnectivity = 0.5
      const edgeSet = new Set();

      let numberOfNodes = Math.floor(Math.random() * (max_number - min_number) + min_number);


      const randomNodes = [];
      for (let i = 0; i < numberOfNodes; i++) {
        const nodeId = String.fromCharCode(97 + i)
        randomNodes.push({ data: { id: nodeId } })
      }
      props.cy.add(randomNodes);
      setGraphNode(randomNodes)
      console.log('names of nodes are :', randomNodes)
      console.log('names of nodes are :', randomNodes[0].data.id)
      // const edges = [];
      console.log('numberOfNodes :', numberOfNodes)
      for (let i = 1; i < numberOfNodes; i++) {
          const source = randomNodes[i].data.id
          const target = randomNodes[Math.floor(Math.random() * i)].data.id;

          const pairKey1 = `${source}-${target}`;
          const pairKey2 = `${target}-${source}`;

          if (source == target || edgeSet.has(pairKey1) || edgeSet.has(pairKey2))
              continue;

          edgeSet.add(pairKey1);
          const weight = Math.floor(Math.random() * (max_weight - min_weight + 1)) + min_weight;

          randomGraph.push({
              data: {
                id: pairKey1,
                source: source,
                target: target,
                weight: weight,
              },
          });
      }

      for (let i = 0; i < numberOfNodes; i++) {
          for (let j = i + 1; j < numberOfNodes; j++) {
            // Connect each node to all other nodes except itself and previous ones
            let ran = Math.random();
            // console.log('ran is :', ran)
            const sourceNodeId = randomNodes[i].data.id;
            const targetNodeId = randomNodes[j].data.id;
            const pairKey1 = `${sourceNodeId}-${targetNodeId}`
            const pairKey2 = `${targetNodeId}-${sourceNodeId}`


            const weight = Math.floor(Math.random() * (max_weight - min_weight + 1)) + min_weight;

            if (ran < randomConnectivity && sourceNodeId !== targetNodeId &&
              !edgeSet.has(pairKey1) &&
              !edgeSet.has(pairKey2)) {

              edgeSet.add(pairKey1)
              randomGraph.push({
                data: {
                  id: pairKey1,
                  source: sourceNodeId,
                  target: targetNodeId,
                  weight: weight,
                },
              });
            }
          }
      }
      console.log('randomGraph is :', randomGraph)

      props.cy.add(randomGraph);
      setFinalRandonGraph(randomGraph)
      // setSaveWeights(randomEdges);

      // Layout the graph
      props.cy.layout({ name: "random" }).run();

      props.cy.style()
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
  }

  return (
      <>

      </>
  )

}

export default GraphTrainning