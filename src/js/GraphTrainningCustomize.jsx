import { useState, useEffect } from "react";
import { Button, Card, Grid, Divider, Modal, Input, Form } from "antd";
import { useTranslation } from "react-i18next";


function GraphTrainningCustomize(props) {
    const [welcomeModalEnable, setWelcomeModalEnable] = useState(false);
    const [trainWithPrim, setTrainWithPrim] = useState(false)
    const [trainWithKruskal, setTrainWithKruskal] = useState(false)
    // const [selectedEdge, setSelectedEdge] = useState("")

    const { useBreakpoint } = Grid;
    const breakpoints = useBreakpoint();
    const [form] = Form.useForm();

    const { t } = useTranslation()

    const submitPrimNode = (values) => {
      setWelcomeModalEnable(false)
      // setSelectedEdge(values.startingNode)
      props.selectedTrainningAlgo(values, 'primIsOn')
    }

    const submitKruskalAlg = () => {
      setWelcomeModalEnable(false)
      props.selectedTrainningAlgo('dummyNode', 'kruskalIsOn')
    }

    const chooseAlgorithModal = () => {
        return (
          <Modal
            title={trainWithKruskal ? t("Trainning.TrainOnKruskalAlgorithm") : t("Trainning.TrainΟnPrimΑlgorithm")} 
            open={welcomeModalEnable} 
            // onOk={handleOk} 
            onCancel={() => setWelcomeModalEnable(false)}
            footer={[    
              <Button key='cancel' onClick={() => setWelcomeModalEnable(false)}>
                {t("Trainning.Cancel")}
              </Button>,
              <Button
                key="ok"
                type="primary"
                onClick={() => {
                  if (trainWithPrim) {
                    form.submit(); // triggers Form.onFinish
                  } else if (trainWithKruskal) {
                    submitKruskalAlg(); // call directly
                  }
                }}
              >
                {t("Trainning.Proceed")}
              </Button>
            ]}
          >
              <>
                {
                  trainWithPrim && 
                    <Form form={form} onFinish={submitPrimNode}>
                      <Form.Item
                        name={"startingNode"}
                        rules={[
                          {
                            required: true,
                            message: t("Trainning.StartingVertexRequired"),
                          },
                        ]}
                        labelCol={{ span: 6 }}
                      >
                        <Input addonBefore={t("StartingVertex")} placeholder={t("Trainning.aEtc")} />
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
                        {t("Trainning.TrainningMode")}
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
                        onClick={() => {
                          (props.regenerateGraph(), form.resetFields())
                        }}
                        block={breakpoints.xs}
                        // disabled={props.isTrainingModeOn}
                    >
                        {t("Trainning.RegenerateRandomGraph")}
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
                        // disabled={trainWithPrim==true}
                        onClick={() => {
                            setTrainWithKruskal(true), 
                            setWelcomeModalEnable(true),
                            setTrainWithPrim(false)
                        }}
                        // disabled={!props.finishCustomize == true}
                        block={breakpoints.xs}
                    >
                        {t("Kruskal")}
                    </Button>
                    <Button
                        type="primary"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                            setTrainWithPrim(true), 
                            setWelcomeModalEnable(true),
                            setTrainWithKruskal(false)
                        }}
                        // disabled={!props.finishCustomize == true}
                        block={breakpoints.xs}
                    >
                        {t("Prim")}
                    </Button>
                </div>
                <Divider/>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        type="primary"
                        style={{ marginRight: "10px" }}
                        onClick={() => props.downloadGraph()}
                        disabled={!props.trainAlgoFinished}
                        // block={breakpoints.xs}
                    >
                        {t("GraphCustomize.DownloadGraph")}
                    </Button>
                    {/* <Button
                        type="primary"
                        style={{ marginRight: "10px" }}
                        // onClick={() => props.clearGraph()}
                        // disabled={!props.finishCustomize == true}
                        block={breakpoints.xs}
                    >
                        Clear graph
                    </Button> */}
                </div>
            </Card>
            {
                (trainWithPrim || trainWithKruskal) && chooseAlgorithModal()
            }
        </>
    )
}

export default GraphTrainningCustomize