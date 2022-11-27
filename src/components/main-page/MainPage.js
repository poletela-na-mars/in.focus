import LogoSVG from "../../LogoSVG";
import "./MainPage.scss";
import {Link} from "react-router-dom";

const MainPage = (props) => {
    return (
        <div className="animation-area">
            <div className="main-page-container">
                <div className="sign-in-button-container">
                    <Link to={"/login"} className="sign-in-link">
                        <button className="sign-in-button_main-page">Sign in</button>
                    </Link>
                </div>
                <div className="main-page-block">
                    <Link to={"/"} className="logo"><LogoSVG height={55} width={240}/></Link>
                    <p className="main-text">Organize and plan your life with in.focus</p>
                    <Link to={"/signup"} className="start-link">
                        <button className="start-button">Get started →</button>
                    </Link>
                </div>
            </div>
            <ul className="squares">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
};

//TODO:
//      -добавить универсальности в handleChange
//      -ошибки в Sign Up
//      -сделать Account функциональным компонентом
//      -clean-up
//      -проверка на загрузку фото: максимальный размер, название, расширение, Content-Type Header, без флага exe,
//      переименовывать файлы при загрузке
//      -Terms of Service and Privacy Policy
//      -MainPageAuth - связать вход в аккаунт с главной - если не было входа - возвращть в логин
//      -вынести 50px для border-radius
//      -медиазапрос для MainPage - поменьше для телефона
//      -марщрутизация
//      -ESLint config
//      -add HTTP headers in axios config for security

export default MainPage;