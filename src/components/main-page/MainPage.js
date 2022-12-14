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
//      -!!осталась заметка после удаления аккаунта
//      -?проблемы с удалением аккаунта (не удаляется почта)
//      -DESIGN- если нет фото профиля,то avatar серый
//      !-выбор файла - state.image
//      -SECURITY- проверка на загрузку фото: максимальный размер, название, расширение, Content-Type Header, без флага exe,
//      -SECURITY- переименовывать файлы при загрузке
//      ***
//      -!fix spacings and styles...
//      -SECURITY- помечать id, как устаревшие, при выходе из профиля
//      -DESIGN- add search bar
//      -SECURITY- количество попыток для входа - Exponential Backoff
//      -SECURITY- ограничить число созданных аккаунтов во времени
//      -SECURITY- хэширование данных пользователя
//      -clean-up
//      -DESIGN- медиазапрос для MainPage - поменьше для телефона
//      -SECURITY- add HTTP headers in axios config for security

export default MainPage;