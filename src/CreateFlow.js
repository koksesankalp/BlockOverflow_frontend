import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import {
  Button,
  Card
} from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "./CreateFlow.css";
import { ethers } from "ethers";
import abi from "./utils/StreamFlow.json";

//Components
import Header from "./components/Header"
import DoubtInput from "./components/DoubtInput";
import { ShowAnsModal, PostAnswerModal } from "./components/Modals";


// This abi is for testing purpose only. Use the StreamFlow ABI when deploying
// import abi from "./utils/TestFlow.json";
// let account;

//where the Superfluid logic takes place

// currently the function call is commented
async function updateExistingFlow(recipient, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });
  const DAIx = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90";
  try {
    const updateFlowOperation = sf.cfaV1.updateFlow({
      receiver: recipient,
      flowRate: flowRate,
      superToken: DAIx
      // userData?: string
    });

    console.log("Updating your stream...");

    const result = await updateFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just updated a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Rinkeby
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
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

// exporting component
export const CreateFlow = () => {
  //Main Function of this component -> Connect to the wallet, Retreive all the imp stuff import all components
  //States
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(""); // current logged in account address
  const [allDoubts, setAllDoubts] = useState([]); // set an array of all doubts
  const [allAnswers, setAllAnswers] = useState([]); // set an array of all answers
  const [currentDoubtId, setCurrentDoubtId] = useState(0); // storing the current access doubt ID for further functions

  // for the Modals
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleClose1 = () => setShowAnswerModal(false);
  const handleShow1 = async (quesId) => {
    setCurrentDoubtId(quesId);
    await getAnswer(quesId);
    setShowAnswerModal(true);
  };
  const handleClose2 = () => setShowAnswerForm(false);
  const handleShow2 = async (quesId) => {
    setCurrentDoubtId(quesId);
    setShowAnswerForm(true);
  };

  const contractaddress = "0x9FC6B3F3666cBaF8E37948B05C4aB680Eb0988B4";
  // Use this contract address for testing purpose only
  // const contractaddress = "0x0FE62c7A782c050Cafe8020Ce138c59657F04B48";
  const contractAbi = abi.abi; // use this while submitting the project.
  // const contractAbi = abi; // this is only for testing using remix

  // Function to connect the wallet.
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log("Connected", accounts[0]);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x4") {
        alert("Please Switch the network to rinkeby")
      }
      console.log(chainId);
      setCurrentAccount(accounts[0]);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  // function to check if wallet is connected or not
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    const provider = new ethers.providers.Web3Provider(ethereum);
    provider.getBalance(accounts[0]).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      console.log(balanceInEth); // printing the balance of the current connected account
    });

    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (chainId !== "0x4") {
      alert("Please Switch the network to rinkeby");
    }
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
      getDoubt();
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  // Get all the doubts
  const getDoubt = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const streamFlowContract = new ethers.Contract(
          contractaddress,
          contractAbi,
          signer
        );
        const postedDoubts = await streamFlowContract.readDoubts();
        const postedDoubtsCleaned = postedDoubts.map(postedDoubt => {
          return {
            address: postedDoubt.posterAddress,
            quesId: postedDoubt.quesId.toNumber(),
            heading: postedDoubt.heading,
            description: postedDoubt.description
          };
        });
        setAllDoubts(postedDoubtsCleaned);
        console.log(postedDoubtsCleaned);
      } else {
        console.log("No Ethereum object found");
      }
    } catch (error) {
      console.log("There was some error while reading the Doubts");
      console.log(error);
    }
  }

  // function to get answer for a specific doubt
  async function getAnswer(qId) {
    console.log("getAnswer called with id ", qId);
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const streamFlowContract = new ethers.Contract(
          contractaddress,
          contractAbi,
          signer
        );
        const postedAnswers = await streamFlowContract.readAnsS(qId);
        const postedAnswersCleaned = postedAnswers.map(postedAnswer => {
          return {
            address: postedAnswer.answerer,
            ansId: postedAnswer.ansId.toNumber(),
            answerbody: postedAnswer.ans,
            upvotes: postedAnswer.upvotes.toNumber()
          };
        });
        setAllAnswers(postedAnswersCleaned);
        console.log(postedAnswersCleaned);
      } else {
        console.log("Etereum Object not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let streamFlowContract;
    const onNewAnswer = (from, answerid, qid, ans, upvotes) => {
      console.log("New Answer", from, answerid, ans);
      setAllAnswers(prevState => [
        ...prevState,
        {
          address: from,
          ansId: answerid.toNumber(),
          ans: ans,
          upvotes: upvotes.toNumber()
        },
      ]);
      console.log(allAnswers);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      streamFlowContract = new ethers.Contract(contractaddress, contractAbi, signer);
      streamFlowContract = new ethers.providers.Web3Provider(window.ethereum);
      streamFlowContract.on("NewUpdateAnswer", onNewAnswer);
    }
    return () => {
      if (streamFlowContract) {
        streamFlowContract.off("NewUpdateAnswer", onNewAnswer);
      }
    };
  }, [allAnswers, contractAbi]);

  useEffect(() => {
    let streamFlowContract;
    // event fired on successful posting of a new Doubt
    const onNewDoubt = (from, masterIndex, heading, description) => {
      console.log("NewDoubt", from, masterIndex, heading);
      setAllDoubts(prevState => [
        ...prevState,
        {
          address: from,
          quesId: masterIndex.toNumber(),
          heading: heading,
          description: description
        },
      ]);
      console.log(allDoubts);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      streamFlowContract = new ethers.Contract(contractaddress, contractAbi, signer);
      streamFlowContract = new ethers.providers.Web3Provider(window.ethereum);
      streamFlowContract.on("NewDoubt", onNewDoubt);
    }
    return () => {
      if (streamFlowContract) {
        streamFlowContract.off("NewDoubt", onNewDoubt);
      }
    };
  }, [allDoubts, contractAbi]);

  // UI code
  return (
    <div className="position-sticky">
      {/* Custom Header component */}
      <Header connectWallet={connectWallet} Card={Card} currentAccount={currentAccount} />
      <div className="container">
        {/* Custom Doubt component */}
        <DoubtInput getDoubt={getDoubt}
          contractAbi={contractAbi}
          contractAddress={contractaddress}
          setIsButtonLoading={setIsButtonLoading}
          currentAccount={currentAccount} />

        {/* Displaying all of the doubts posted on the contract */}
        {allDoubts.map((doubt, index) => {
          return (
            <div className="card" key={index}>
              <div className="container">
                {/* <h3>Address: {doubt.address}</h3> */}
                <h3><b>Heading: {doubt.heading}</b></h3>
                <p>Description: {doubt.description}</p>
                <p>Ques_ID: {doubt.quesId.toString()}</p>
                <Button variant="primary" onClick={() => handleShow1(doubt.quesId)}>Show Answers</Button>
                <Button variant="primary" onClick={() => handleShow2(doubt.quesId)}>Post Answer</Button>
              </div>
            </div>
          )
        })}

        {/* Modal 1 for displaying answers */}
        <ShowAnsModal showState={showAnswerModal}
          onHideState={handleClose1}
          answerArray={allAnswers}
          currentDoubtId={currentDoubtId}
          contractAbi={contractAbi}
          contractaddress={contractaddress} />

        {/* Modal2 for Posting answers */}
        <PostAnswerModal showState={showAnswerForm}
          onHideState={handleClose2}
          setIsButtonLoading={setIsButtonLoading}
          currentDoubtId={currentDoubtId}
          contractAbi={contractAbi}
          contractaddress={contractaddress} />
      </div>
    </div>
  );
};
