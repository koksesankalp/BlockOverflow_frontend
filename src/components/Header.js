import './Header.css';
import BlockoverflowLogo from "../assets/images/BlockOverflow-192x192.png";


const Header = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark glassy ps-2 pe-2">
      <div className='container-fluid'>
        <span className="navbar-brand mb-0 h1 fw-bolder" href="#">
          {/* <a data-bs-toggle="offcanvas" href="#offcanvasSlider" role="button" style={{ textDecoration: "none" }} aria-controls="offcanvasSlider">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" className="bi bi-justify" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
            </svg>
          </a> */}
          <img src={BlockoverflowLogo} alt="BlockOverflow Logo" width={43} height={43} />
          Blockoverflow
        </span>
      </div>
    </nav>
  )
}

export default Header;