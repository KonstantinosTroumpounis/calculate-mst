import { useState, useEffect } from "react";
import { Button, Card, Grid, Divider, Modal, Input, Form } from "antd";
import { WarningOutlined } from "@ant-design/icons";



function GraphTrainningCustomize(props) {
    const [welcomeModalEnable, setWelcomeModalEnable] = useState(false);
    const [trainWithPrim, setTrainWithPrim] = useState(false)
    const [trainWithKruskal, setTrainWithKruskal] = useState(false)
    // const [selectedEdge, setSelectedEdge] = useState("")

    const { useBreakpoint } = Grid;
    const breakpoints = useBreakpoint();
    const [form] = Form.useForm();

    const submitPrimNode = (values) => {
      setWelcomeModalEnable(false)
      // setSelectedEdge(values.startingNode)
      props.trainPrimNodeStarter(values, 'primIsOn')
    }

    const chooseAlgorithModal = () => {
        return (
          <Modal
            title={trainWithKruskal ? `Train on Kruskal's algorithm ?` : `Train on Prim's algorithm ?`}
            open={welcomeModalEnable} 
            // onOk={handleOk} 
            onCancel={() => setWelcomeModalEnable(false)}
            footer={[    
              <Button key='cancel' onClick={() => setWelcomeModalEnable(false)}>
                Cancel
              </Button>,
              <Button key='ok' type="primary" onClick={() => form.submit()}>
                Proceed
              </Button>
            ]}
          >
              {/* {
                trainWithPrim && 
                  <div style={{display:'flex', alignItems: 'center', gap: '8px'}}>
                    <WarningOutlined style={{ color: 'orange', fontSize: '20px' }}/>
                    <p>Don't forget to click on the starting node</p>
                  </div>
              } */}
              <>
                {
                  trainWithPrim && 
                    <Form form={form} onFinish={submitPrimNode}>
                      <Form.Item
                        name={"startingNode"}
                        rules={[
                          {
                            required: true,
                            message: "Starting vertex required",
                          },
                        ]}
                        labelCol={{ span: 6 }}
                      >
                        <Input addonBefore="Starting vertex" placeholder="a etc" />
                      </Form.Item>
                    </Form>
                }
              </>
          </Modal>
        )
    }

    return (
        <>
            <Card
                title={
                    <h2 style={{ textAlign: "center", width: "100%" }}>
                        Trainning mode
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
                        // onClick={() => {
                        //   props.handleTrainingMode();
                        // }}
                        block={breakpoints.xs}
                        // disabled={props.isTrainingModeOn}
                    >
                        Regenerate random graph
                    </Button>
                </div>

                <Divider />
                <div
                    style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "10px",
                    }}
                >
                    <Button
                        type="primary"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                            setTrainWithKruskal(true), 
                            setWelcomeModalEnable(true),
                            setTrainWithPrim(false)
                        }}
                        // disabled={!props.finishCustomize == true}
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
                        onClick={() => {
                            setTrainWithPrim(true), 
                            setWelcomeModalEnable(true),
                            setTrainWithKruskal(false)
                        }}
                        // disabled={!props.finishCustomize == true}
                        block={breakpoints.xs}
                    >
                        Prim's
                    </Button>
                </div>
                <Divider/>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        type="primary"
                        style={{ marginRight: "10px" }}
                        // onClick={() => props.downloadGraph()}
                        disabled={props.trainNodeIs.runningAlgo != undefined}
                        // block={breakpoints.xs}
                    >
                        Download graph
                    </Button>
                    <Button
                        type="primary"
                        style={{ marginRight: "10px" }}
                        // onClick={() => props.clearGraph()}
                        // disabled={!props.finishCustomize == true}
                        block={breakpoints.xs}
                    >
                        Clear graph
                    </Button>
                </div>
            </Card>
            {
                (trainWithPrim || trainWithKruskal) && chooseAlgorithModal()
            }
        </>
    )
}

export default GraphTrainningCustomize