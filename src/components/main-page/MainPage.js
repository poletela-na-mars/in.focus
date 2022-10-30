import LogoSVG from "../../LogoSVG";
import "./MainPage.scss";
import {Link} from "react-router-dom";

const MainPage = (props) => {
    return (
        <>
            <div className="sign-in-button-container">
                <Link to={"/"} className="sign-in-link">
                    <button className="sign-in-button">Sign in</button>
                </Link>
            </div>
            <div className="main-page-block">
                <Link to={"/"} className="logo"><LogoSVG height={55} width={240}/></Link>
                <p className="main-text">Organize and plan your life with in.focus</p>
                <Link to={"/"} className="start-link">
                    <button className="start-button">Get started →</button>
                </Link>
            </div>
        </>
    );
};

//TODO:
//      -добавить в background анимацию
//      -начальная марщрутизация

export default MainPage;