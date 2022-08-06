import { Framework } from "@superfluid-finance/sdk-core";
import { useState } from "react";
import { ethers } from "ethers";

// markdown
import { marked } from 'marked';

import "../CreateFlow.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {
  Form,
  FormGroup,
  FormControl,
  Modal,
  Button,
  FormLabel,
  Row,
  Col
} from "react-bootstrap";

// Doubt posting component
const DoubtInput = (props) => {
  const contractaddress = props.contractAddress;
  //Pure States
  const [doubt_heading, setDoubtHeading] = useState("");
  const [doubt_description, setDoubtDescription] = useState("# Enter your doubt here");
  const [doubt_due, setDoubtDue] = useState(0);

  //markdown state
  const [previewMarkdown, setPreviewMarkdown] = useState(false); // switch between the preview and writing windows

  // flowrate states
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [doubtFlowRateDisplay, setDoubtFlowRateDisplay] = useState("");

  // modal state
  const [show, setShow] = useState(false);

  async function createNewFlow(recipient, flowRate) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });

    const DAIx = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90"; // DAIx address for Rinkeby

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        receiver: recipient,
        flowRate: flowRate,
        superToken: DAIx
        // userData?: string
      });
      console.log("Creating your stream...");
      const result = await createFlowOperation.exec(signer);
      console.log(result);
      console.log(
        `Congrats - you've just created a money stream!
          View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
          Network: Rinkeby
          Super Token: DAIx
          Sender: 
          Receiver: ${recipient},
          FlowRate: ${flowRate}
          `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  // function to get a flow from a user account to the super contract
  const getAFlow = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const provider = new ethers.providers.AlchemyProvider("rinkeby", "iNNs24vbZthCgoM1DdYfs44KxP-re35d");
        // const signer = provider.getSigner();
        const chainId = await window.ethereum.request({ method: "eth_chainId" });

        const sf = await Framework.create({
          chainId: Number(chainId),
          provider: provider
        });
        const myflow = await sf.cfaV1.getFlow({
          superToken: "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90",
          sender: props.currentAccount.toString(),
          receiver: contractaddress,
          providerOrSigner: provider
        });
        console.log(myflow); // now getting the flow.
        console.log(Number(myflow.flowRate))
        return Number(myflow.flowRate);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // function to post a Doubt and start a looping stream transaction
  const postADoubt = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const streamFlowContract = new ethers.Contract(
          contractaddress,
          props.contractAbi,
          signer
        );
        const doubtTxn = await streamFlowContract.writeDoubt(
          doubt_heading,
          doubt_description,
          doubt_due,
          flowRate
        );
        console.log("Mining...", doubtTxn.hash);
        await doubtTxn.wait();
        console.log("Mined -- ", doubtTxn.hash); // doubt posted
        await props.getDoubt();
        let currentFlowRate = await getAFlow();
        console.log(currentFlowRate);
        // const transactionExist = await streamFlowContract.checkFlow(currentAccount);
        if (flowRate > 0) {
          if (currentFlowRate != 0) {
            // try {
            //   let newflowrate = currentFlowRate + Number(flowRate);
            //   await updateExistingFlow(contractaddress, newflowrate.toString());
            // } catch (error) {
            //   console.log("Error for updating flow" + error);
            // }
            console.log("Posting doubt without bounty, you already have a bounty doubt posted!");
          }
          if (currentFlowRate == 0) {
            createNewFlow(contractaddress, flowRate);
          }
        }
        // createNewFlow(contractaddress, flowRate);
      } else {
        console.log("Ethereum Object doesnot exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // handle the input form to re-calculate on change flowrate.
  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    setFlowRateDisplay(newFlowRateDisplay.toString()); // this is for monthly cost
    let doubtFlowRate = (newFlowRateDisplay * doubt_due) / 30;
    setDoubtFlowRateDisplay(doubtFlowRate.toString()); // this is cost per due days.
  };

  // function to calculate the flowrate of the bounty
  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  const handleDoubtHeading = (e) => {
    setDoubtHeading(() => ([e.target.name] = e.target.value));
    console.log(doubt_heading);
  }
  const handleDoubtDescription = (e) => {
    setDoubtDescription(() => ([e.target.name] = e.target.value));
  }
  const handleDoubtDue = (e) => {
    setDoubtDue(() => ([e.target.name] = e.target.value));
  }

  // styles
  var inputStyle = {
    width: "100%",
    height: "50vh",
    marginLeft: "auto",
    marginRight: "auto",
  }
  var outputStyle = {
    width: "100%",
    height: "50vh",
    backgroundColor: "#DCDCDC",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "10px",
    overflow: "auto"
  }

  return (
    <>
      <Button variant="primary" className="mb-3 mt-3" onClick={() => setShow(true)}>
        Add Event
      </Button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Enter Doubt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="myDoubtForm">
            <FormGroup className="mb-3">
              <FormControl
                name="doubt_heading"
                value={doubt_heading}
                onChange={handleDoubtHeading}
                placeholder="Enter the doubt heading"
              ></FormControl>
            </FormGroup>

            <div className="d-flex justify-content-end">
              <Button type="button" variant="primary"
                size="sm"
                onClick={() => {
                  setPreviewMarkdown(!previewMarkdown);
                  console.log(previewMarkdown);
                }}>
                {!previewMarkdown ? "Preview" : "Write"}
              </Button>
            </div>
            <FormGroup className="mb-3">
              {!previewMarkdown ?
                <div className="mark-input" style={inputStyle}>
                  <textarea name="doubtBody" style={inputStyle}
                    value={doubt_description}
                    onChange={handleDoubtDescription}
                    className="input"
                    placeholder="Write your Doubt here">
                  </textarea>
                </div> : <div className="doubtBody" style={outputStyle}
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(doubt_description),
                  }}>
                </div>
              }
            </FormGroup>
            <Row className="mb-3 d-flex justify-content-center">
              <FormGroup as={Col} md="6" className="bountyInput">
                <FormLabel>Bounty Duration</FormLabel>
                <FormControl style={{ width: "70%" }}
                  name="doubt_due"
                  value={doubt_due}
                  onChange={handleDoubtDue}
                  placeholder="Days"
                ></FormControl>
              </FormGroup>
              <FormGroup as={Col} md="6" className="flowRateIput">
                <FormLabel>Bounty Amount</FormLabel>
                <FormControl style={{ width: "70%" }}
                  name="flowRate"
                  value={flowRate}
                  onChange={handleFlowRateChange}
                  placeholder="wei/second"
                ></FormControl>
              </FormGroup>
            </Row>
            <div className="description">
              <div className="calculation">
                <p>Bounty flow Rate with Superfluid</p>
                <p>
                  <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month<br></br>
                  <b>${doubtFlowRateDisplay !== " " ? doubtFlowRateDisplay : 0}</b> DAIx/{doubt_due} day(s)
                </p>
              </div>
            </div>
            <br></br>
            <Button
              variant="success"
              className="button"
              onClick={() => {
                props.setIsButtonLoading(true);
                postADoubt();
                setTimeout(() => {
                  props.setIsButtonLoading(false);
                }, 1000);
              }}
            >
              Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
export default DoubtInput;