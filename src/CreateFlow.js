import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { Button, Modal } from "react-bootstrap";
import { ethers } from "ethers";
import { marked } from 'marked';

//Components
import Header from "./components/Header"
import DoubtInput from "./components/DoubtInput";
import { ShowAnsModal, PostAnswerModal } from "./components/Modals";
import Metamasklogo from "./components/Metamasklogo";
import Slider from "./components/sidebar";
import CarouselBanner from './components/HomeCarousel';

import Blockimg from './assets/images/BlockOverflow-192x192.png';
import abi from "./utils/StreamFlow.json";
import "./CreateFlow.css";
const erc20_abi = require('./utils/ERC20_abi.json');



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
  const DAIx = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
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
      "Your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
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
  const [walletConnected, setWalletConnected] = useState(false);
  const [allDoubts, setAllDoubts] = useState([]); // set an array of all doubts
  const [allAnswers, setAllAnswers] = useState([]); // set an array of all answers
  const [currentDoubtId, setCurrentDoubtId] = useState(0); // storing the current access doubt ID for further functions
  const [userBalance, setUserBalance] = useState(0);
  const [ERC20xBalance, setERC20xBalance] = useState(0);
  const [ERC20Balance, setERC20Balance] = useState(0);

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

  const contractaddress = "0x78e9Ec8CfC4971499702d9B409cb8Cde53Bc2664";
  // Use this contract address for testing purpose only
  // const contractaddress = "0x0FE62c7A782c050Cafe8020Ce138c59657F04B48";
  const contractAbi = abi.abi; // use this while submitting the project.
  // const contractAbi = abi; // this is only for testing using remix

  //Function that returns the contract object
  const connectToContract = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    console.log(provider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractaddress, contractAbi, signer);
    return contract;
  }

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
      // if (chainId !== "0x4") {
      //   alert("Please Switch the network to rinkeby")
      // }
      console.log(chainId);
      setCurrentAccount(accounts[0]);
      setWalletConnected(true);
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
      setUserBalance(ethers.utils.formatEther(balance));
      console.log(userBalance); // printing the balance of the current connected account
    });

    // Getting DAI balance
    const DAI_token = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
    const DAI_contract = new ethers.Contract(DAI_token, erc20_abi, provider);
    DAI_contract.balanceOf(accounts[0]).then((balance) => {
      console.log("DAI Balance: ", ethers.utils.formatEther(balance));
      setERC20Balance(ethers.utils.formatEther(balance));
    });

    // Getting DAIx balance
    const DAIx_token = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
    const DAIx_contract = new ethers.Contract(DAIx_token, erc20_abi, provider);
    DAIx_contract.balanceOf(accounts[0]).then((balance) => {
      setERC20xBalance(ethers.utils.formatEther(balance));
      console.log("DAIx Balance: ", ethers.utils.formatEther(balance));
    });

    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    // if (chainId !== "0x4") {
    //   alert("Please Switch the network to rinkeby");
    // }
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setWalletConnected(true);
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
        const streamFlowContract = connectToContract();
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
        const streamFlowContract = connectToContract();
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
      streamFlowContract = connectToContract();
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
      streamFlowContract = connectToContract();
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
    <div className="position-sticky pb-3" style={{ backgroundColor: "#290133" }}>
      {/* Custom Header component */}
      <Header connectWallet={connectWallet} currentAccount={currentAccount} balance={ERC20xBalance} />

      <CarouselBanner />

      <div className="container-fluid">
        <DoubtInput getDoubt={getDoubt}
          contractAbi={contractAbi}
          contractAddress={contractaddress}
          setIsButtonLoading={setIsButtonLoading}
          currentAccount={currentAccount} />
        <br></br>
      </div>

      <div className="row gx-0 px-1">
        <div className="col-3" style={{ borderRight: "3px solid green" }}>
          <Slider currentAccount={currentAccount} ERC20xbalance={ERC20xBalance} ERC20balance={ERC20Balance} />
        </div>
        <div className="col-9 px-3">
          <div className="container-fluid">
            {/* Custom Doubt component */}

            {/* Displaying all of the doubts posted on the contract */}
            {allDoubts.map((doubt, index) => {
              return (
                <div className="card mb-3" key={index} style={{ backgroundColor: "transparent", color: "white", borderColor: "#4BB000", borderRadius: "10px" }}>
                  <div className="container my-3 mx-2">
                    <h3><b>{doubt.heading}</b></h3>
                    <div dangerouslySetInnerHTML={{
                      __html: marked.parse(doubt.description),
                    }}></div>
                    <Button variant="primary" className="me-3 mb-2" onClick={() => handleShow1(doubt.quesId)}>Show Answers</Button>
                    <Button variant="primary" className="mb-2" onClick={() => handleShow2(doubt.quesId)}>Post Answer</Button>
                  </div>
                </div>
              )
            })}

            {/* Modal if wallet is not connected */}
            {/* <ConnectWalletModal showState={!walletConnected} */}
            <Modal show={!walletConnected} centered className="connectWalletModal">
              <Modal.Body>
                <div className="container">
                  <div className="row text-center">
                    <div className="col">
                      <img src={Blockimg} alt="BlockOverflow_logo" width="50px" height="50px" />
                    </div>
                    <div className="col">
                      <Metamasklogo />
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col">
                      <h5>Get rewards for your Contribution in real-time.<br></br><span className="highlightText">LITERALLY!!</span>
                      </h5>
                    </div>
                    <div className="col text-center">
                      <p>Connect your wallet</p>
                      <button id="connectWallet" className="btn btn-primary" onClick={connectWallet}>
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

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
      </div>

    </div>
  );
};
