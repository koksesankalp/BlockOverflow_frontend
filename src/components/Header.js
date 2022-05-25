//Functions required as props -> connect wallet
//Variables required -> current Account, Card

const Header = (props) => {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark ps-2 pe-2">
        <span className="navbar-brand mb-0 h1">BlockOverFlow</span>

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
              <props.Card className="connectedWallet">
                {`${props.currentAccount.substring(0, 8)}...${props.currentAccount.substring(
                  38
                )}`}
              </props.Card>
            </div>

          )}
        </div>

      </nav>
    )
}

export default Header;