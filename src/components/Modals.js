import {
    Modal,
    Form,
    FormGroup,
    Button
} from "react-bootstrap";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
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
        <Modal show={props.showState} onHide={props.onHideState} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Answers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <button onClick={() => { approveTransformToken(10) }} className="approvefunction">Approve;</button> */}
                {props.answerArray.map((answer, index) => {
                    return (
                        <div key={index}>
                            <button type="button" className="btn btn-primary" onClick={() => { upvoteCurrentAnswer(answer.ansId) }}>
                                Upvote <span class="badge text-bg-secondary">{answer.upvotes}</span>
                            </button>
                            {/* <span className="answerBody">{answer.ansId}:-</span> */}
                            <div className="mark-input"
                                dangerouslySetInnerHTML={{
                                    __html: marked.parse(answer.answerbody),
                                }}>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </Modal.Body>
        </Modal>
    )
}

// modal for posting answers
export function PostAnswerModal(props) {
    const [answerBody, setAnswerBody] = useState("");
    const [previewMarkdown, setPreviewMarkdown] = useState(false); // switch between the preview and writing windows
    // for answers
    const handleAnswers = (e) => {
        setAnswerBody(() => ([e.target.name] = e.target.value));
        console.log(answerBody);
    }

    // Start from a blank answer for a new question.
    useEffect(() => {
        setAnswerBody("");
    }, [props.currentDoubtId]);

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

    var inputStyle = {
        width: "100%",
        height: "50vh",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "10px"
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
            <Modal show={props.showState} onHide={props.onHideState} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ alignContent: "center" }}>
                        Submit your answer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mark-preview-btns" style={{ flexDirection: 'row' }}>
                        <Button variant="primary" size="sm" style={{ flex: 1 }}
                            onClick={() => {
                                setPreviewMarkdown(!previewMarkdown);
                            }}> {!previewMarkdown ? "Preview" : "Write"}
                        </Button>
                    </div>
                    <Form>
                        <FormGroup className="mb-3">
                            {/* Display the writing part when preview is false
                            Display the output markdown when the preview is true. */}
                            {!previewMarkdown ?
                                <div className="mark-input" style={inputStyle}>
                                    <textarea name="answerBody"
                                        style={inputStyle}
                                        value={answerBody}
                                        onChange={handleAnswers}
                                        className="input"
                                        placeholder="Enter the answer for this doubt">
                                    </textarea>
                                </div> :
                                <div style={outputStyle}
                                    dangerouslySetInnerHTML={{
                                        __html: marked.parse(answerBody),
                                    }}>
                                </div>
                            }
                        </FormGroup>
                        <Button
                            variant="success" className="button" size="sm"
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