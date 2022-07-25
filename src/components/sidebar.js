import BlockoverflowLogo from "../assets/images/BlockOverflow-192x192.png";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
const daiABI = require('../utils/daiABI.json');

function Slider(props) {
    // Function to approve Transform from normal tokens to Supertokens
    async function approveTransformToken(amt) {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const sf = await Framework.create({
            chainId: 4,
            provider: provider
        });
        const signer = sf.createSigner({ web3Provider: provider });
        console.log(signer);
        const DAI = new ethers.Contract(
            "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7",
            daiABI,
            signer
        );
        try {
            console.log("Approving DAI");
            let txn = await DAI.approve(
                "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90", // address of fDAIx on Rinkeby testnet
                ethers.utils.parseEther(amt.toString())
            );
            await txn.wait();
            console.log("DAI has been approved");
        } catch (error) {
            console.log(error);
        }
    }

    // ERC20 Upgrade function to supertoken
    async function upgradeAmount(amt) {
        await approveTransformToken(10);
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const sf = await Framework.create({
            networkName: "rinkeby",
            provider: provider
        });
        const signer = sf.createSigner({ web3Provider: provider });
        console.log(signer);
        const DAIx = await sf.loadSuperToken("fDAIx");
        try {
            console.log("Upgrading DAI to DAIx super token");
            const amtToUpgrade = ethers.utils.parseEther(amt.toString());
            const upgradeOperation = DAIx.upgrade({
                amount: amtToUpgrade.toString()
            });
            console.log("1");
            const upgradeTxn = await upgradeOperation.exec(signer);
            await upgradeTxn.wait().then(function (tx) {
                console.log(`Just upgraded a DAI token of amount ${amt}`);
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSlider" aria-labelledby="offcanvasSliderLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasSliderLabel">
                    <img src={BlockoverflowLogo} alt="BlockOverflow Logo" width={50} height={50} />
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div class="alert alert-warning" role="alert">
                    My connected address - {`${props.currentAccount.substring(0, 8)}...${props.currentAccount.substring(38)}`}
                </div>
                <div class="alert alert-primary" role="alert">
                    My Supertoken Balance - {`${props.balance} DAIx`}
                </div>
                <div>
                    Upgrade your tokens to super tokens for streaming
                </div>
                <div className="dropdown mt-3">
                    <button className="btn btn-primary" onClick={() => { upgradeAmount(10) }}>
                        Upgrade tokens
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Slider;