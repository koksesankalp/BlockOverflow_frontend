import block_1_gif from '../assets/images/logo_gif_block_1.gif';
import block_2_gif from '../assets/images/logo_gif_block_2.gif';
import cylinder_1_gif from '../assets/images/logo_gif_cylinder_gif.gif';
import logo_gif from '../assets/images/logo_gif.gif';

const CarouselBanner = () => {
    return (
        <div className="container">
            <div id="carouselExampleControls" class="carousel slide my-5" data-bs-ride="carousel">
                <div class="carousel-inner" style={{ color: "white", height: "70vh" }}>

                    <div class="carousel-item active">
                        <div className="d-flex flex-row justify-content-center px-5 mx-5">
                            <div className="imgae">
                                <img src={logo_gif} className="d-block" style={{ width: "70vh" }} alt='...' />
                            </div>
                            <div className="text mt-5 pt-5 text-center">
                                <h2>Changing the concept of winning whole together by providing</h2>
                                <h2><i>Real time</i> incentive system for worthy peers</h2>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div className="d-flex flex-row justify-content-center px-5 mx-5">
                            <div className="imgae">
                                <img src={block_1_gif} className="d-block w-75" alt='...' />
                            </div>
                            <div className="text mt-5 pt-5 text-center">
                                <h2>We summed up by saying <i>You show progress in real time, you get rewards in real time</i></h2>
                                <h3>Provides voting, creating events and participating, and crowd determines the worthy participant to which rewards flow</h3>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div className="d-flex flex-row justify-content-center px-5 mx-5">
                            <div className="imgae">
                                <img src={block_2_gif} className="d-block w-75" alt='...' />
                            </div>
                            <div className="text mt-5 pt-5 text-center">
                                <h2>Contribute with your opinions and let the crowd decide for how long you are worthy</h2>
                                <h3>Will you be overthrown by a new worthy? Keeping the crowd with you is the game</h3>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div className="d-flex flex-row justify-content-center px-5 mx-5">
                            <div className="imgae">
                                <img src={cylinder_1_gif} className="d-block w-75" alt='...' />
                            </div>
                            <div className="text mt-5 text-center">
                                <h2>Get your rewards as long as you maintain your worthyness</h2>
                                <h3>This is not just a one-time game, we are in for a long haul</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}

export default CarouselBanner;