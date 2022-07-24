//Functions required as props -> connect wallet
//Variables required -> current Account, Card
import { ethers } from 'ethers';
import { Card } from 'react-bootstrap';
const abi = require('../utils/ERC20_abi.json');

const Header = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ps-2 pe-2">
      <div className='container-fluid'>
        <span className="navbar-brand mb-0 h1" href="#">
          <a data-bs-toggle="offcanvas" href="#offcanvasSlider" role="button" style={{ textDecoration: "none" }} aria-controls="offcanvasSlider">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" className="bi bi-justify" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
            </svg>
          </a>
          BlockOverFlow
        </span>
        <div className="collapse navbar-collapse position-relative" id="navbarNav">
          {props.currentAccount === "" ? (
            <></>
          ) : (
            <div className="d-flex position-absolute end-0">
              <Card className="connectedWallet">
                {`${props.currentAccount.substring(0, 8)}...${props.currentAccount.substring(38)}`}
              </Card>
              <Card className='connectedWallet'>
                DAIx - {`${props.balance}`}
              </Card>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header;