import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { notification } from "antd";
import { useTranslation } from "react-i18next";


function GraphTrainning(props) {

  const [finalRandomGraph, setFinalRandonGraph] = useState(false); 
  const [graphNode, setGraphNode] = useState([])

  // TODO: Clean up needed in the end
  const timeoutRef = useRef(null);  // For React (using hooks)

  useEffect(() => {
    generateRandomGraph()
  }, []);

  useEffect(() => {
    props.triggerClearGraph
  }, [props.isGraphCleared]);

  useEffect(() => {
    console.log('the train node is :', props.trainNodeIs)
    let readySelectedAlgStructure = []
    let structuredAlg = []
    let count = 0
    let sumWeight = 0
    if (props.trainNodeIs.algo == 'primIsOn') {
      const isNodeValid = graphNode.find(
        (node) => node.data.id === props.trainNodeIs.startingNode
      );
      console.log('isNodeValid :', isNodeValid)
      if (isNodeValid != undefined) {
        // Distinguish the starting node
        const node = props.cy.getElementById(props.trainNodeIs.startingNode);
        if (node) {
          node.style({
            'background-color': 'orange',
            'border-width': 3,
            'border-color': 'red',
            'shadow-blur': 10,
            'shadow-color': 'orange'
          });
        }
        // Make Prim run
        readySelectedAlgStructure = props.primAlgorithm(finalRandomGraph, props.trainNodeIs.startingNode)

        // Structure it based on cytospace content
        structuredAlg = props.makeGraphCytospaceFriendly(readySelectedAlgStructure)
        console.log('structuredAlg :', structuredAlg.length)
        console.log('count is :', count)
        console.log('structuredAlg :', structuredAlg)
        // Allow user to tap in the edges
        if (count < structuredAlg.length ) {
          props.cy.on('tap', 'edge', function(evt) {
            const edge = evt.target; // Get the clicked edge
            console.log('Clicked edge ID:', edge.id())
            // Check if it's a specific edge
            const normalizedClickedId = normalizeEdgeId(edge.id())
            const normalizedTargetId = normalizeEdgeId(structuredAlg[count].data.id)
  
            if (normalizedClickedId === normalizedTargetId) {
              // If true then green the edge and increase the count 
              // console.log('normalizes are :', props.cy.edges().filter(e => console.log('e is :', normalizeEdgeId(e.id())))[0])
              const matchingEdge = props.cy.edges().filter(e => normalizeEdgeId(e.id()) === normalizedTargetId)[0];
              if (matchingEdge) {
                matchingEdge.css({
                  'line-color': 'green',
                });
                sumWeight = sumWeight + structuredAlg[count].data.weight
                props.addWeightInTraining(sumWeight)
                count = count + 1
              }
              // edge.css({
              //   'line-color': 'green',
              // });
              console.log('count is :', count)
            } else {
              edge.css({ 'line-color': 'red' });
  
              // Store timeout ID so it can be cleared later if necessary
              timeoutRef.current = setTimeout(() => {
                edge.css({ 'line-color': '' });  // Restore original color
              }, 1000);
              console.log('wrong line')
            }
          });
        }
      } else {
        return notification.error({
          message: `Node can't be found`,
          duration: 4,
        });
      }

      // console.log('structure is :', readySelectedAlgStructure)
    }
  }, [props.trainNodeIs])

  const normalizeEdgeId = (edge) => {
    // Split the edge into nodes and sort them lexicographically
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

          if (source == target) // avoid self route like b-b
              continue;

          const weight = Math.floor(Math.random() * (max_weight - min_weight + 1)) + min_weight;

          randomGraph.push({
              data: {
                id: `${source}-${target}`,
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
            const weight = Math.floor(Math.random() * (max_weight - min_weight + 1)) + min_weight;
            //TODO: Erase this and find a way to be fair
            if (ran < randomConnectivity) {
              randomGraph.push({
                data: {
                  id: `${sourceNodeId}-${targetNodeId}`,
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