import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Modal } from "react-bootstrap";
import { ethers } from "ethers";

function ShowAnsModal(props) {
    console.log("This is the showAnswerModal component");
    console.log(props);

    async function upvoteCurrentAnswer(ansId) {
        console.log(props.currentDoubtId);
        const { ethereum } = window;
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const streamFlowContract = new ethers.Contract(
                    props.contractaddress,
                    props.contractAbi,
                    signer
                );
                const upvoteTxn = await streamFlowContract.upVote(
                    props.currentDoubtId,
                    ansId,
                );
                console.log("Mining...", upvoteTxn.hash);
                await upvoteTxn.wait();
                console.log("Mined -- ", upvoteTxn.hash); // answer posted
            } else {
                console.log("Ethereum object not found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Modal show={props.showstate} onHide={props.onHidestate}>
                <Modal.Header closeButton>
                    <Modal.Title>Answers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.answerArray.map((answer, index) => {
                        return (
                            <div key={index}>
                                <span className="totalUpvotes">{answer.upvotes}</span>&nbsp;
                                <button onClick={() => { upvoteCurrentAnswer(answer.ansId) }} className="upvoteArrow">&#8679;</button>
                                &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                <span className="answerBody">Answer {answer.ansId}:- {answer.answerbody}</span>
                                <hr></hr>
                                <br></br>
                            </div>
                        )
                    })}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ShowAnsModal;