//Functions required as props -> connect wallet
//Variables required -> current Account, Card
import { ethers } from 'ethers';
import { Card } from 'react-bootstrap';
const abi = require('../utils/ERC20_abi.json');

const Header = (props) => {
  // let balance = props.provider.getBalance(props.account[0]);
  // balance = ethers.utils.formatEther(balance);
  const getDAIxBalance = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const DAIx_token = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90"
    const contract = new ethers.Contract(DAIx_token, abi, provider);
    contract.balanceOf(props.currentAccount).then((balance) => {

    });
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ps-2 pe-2">
      <div className='container-fluid'>
        <a className="navbar-brand mb-0 h1" href="#">BlockOverFlow</a>
        <div className="collapse navbar-collapse position-relative" id="navbarNav">
          {props.currentAccount === "" ? (
            <ul className="navbar-nav position-absolute end-0">
              <li className="nav-item">
                <button id="connectWallet" className="button btn btn-primary my-2 my-sm-0" onClick={props.connectWallet}>
                  Connect Wallet
                </button>
              </li>
            </ul>
          ) : (
            <div className="d-flex position-absolute end-0">
              <Card className="connectedWallet">
                {`${props.currentAccount.substring(0, 8)}...${props.currentAccount.substring(38)}`}
              </Card>
              <Card className='connectedWallet'>
                DAIx balance - {`${props.balance}`}
              </Card>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header;