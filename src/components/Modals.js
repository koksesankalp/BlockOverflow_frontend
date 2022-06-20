import {
    Modal,
    Form,
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";
import { ethers } from "ethers";
import { useState } from 'react';
import { marked } from 'marked';

// modal for viewing answers
export function ShowAnsModal(props) {
    async function upvoteCurrentAnswer(ansId) {
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
            <Modal show={props.showState} onHide={props.onHideState}>
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

// modal for posting answers
export function PostAnswerModal(props) {
    const [answerBody, setAnswerBody] = useState("");
    // for answers
    const handleAnswers = (e) => {
        setAnswerBody(() => ([e.target.name] = e.target.value));
        console.log(answerBody);
    }

    // function to post answer to smart contract
    const postAnswer = async () => {
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
                const answerTxn = await streamFlowContract.answerDoubt(
                    answerBody,
                    props.currentDoubtId,
                );
                console.log("Mining...", answerTxn.hash);
                await answerTxn.wait();
                console.log("Mined -- ", answerTxn.hash); // answer posted
            } else {
                console.log("Ethereum object not found");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const samplehtml = marked.parse('# Marked in React\n\nRendered by **marked**.');
    console.log(samplehtml);
    var inputStyle = {
        width: "400px",
        height: "50vh",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "10px"
    }
    var outputStyle = {
        width: "400px",
        height: "50vh",
        backgroundColor: "#DCDCDC",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "10px"
    }
    return (
        <>
        {samplehtml}
            <Modal show={props.showState} onHide={props.onHideState}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Submit your answer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup className="mb-3">
                            {/* <FormControl
                                name="answerBody"
                                value={answerBody}
                                onChange={handleAnswers}
                                placeholder="Enter the answer for this doubt"
                            ></FormControl> */}
                            <div className="mark-input" style={inputStyle}>
                                <textarea name="answerBody"
                                    style={inputStyle}
                                    value={answerBody}
                                    onChange={handleAnswers}
                                    className="input"
                                    placeholder="Enter the answer for this doubt">
                                </textarea>
                            </div>
                            <div style={outputStyle}
                            dangerouslySetInnerHTML = {{
                                __html: marked.parse(answerBody),
                            }}>
                            </div>
                        </FormGroup>
                        <Button
                            variant="success" className="button"
                            onClick={() => {
                                props.setIsButtonLoading(true);
                                postAnswer();
                                setTimeout(() => {
                                    props.setIsButtonLoading(false);
                                }, 1000);
                            }}
                        >
                            Post an Answer
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}