import LogoSVG from "../../LogoSVG";
import "./MainPage.scss";
import {Link} from "react-router-dom";

const MainPage = (props) => {
    return (
        <div className="main-page-block">
            <Link to={"/"}><LogoSVG height={55} width={240}/></Link>
            <p>Organize and plan your life with in.focus</p>
            <Link to={"/"}>Get started  →</Link>
        </div>
    );
};

//TODO:
//      -добавить в background анимацию
//      -начальная марщрутизация
//      -add normalize in main.css
//      -кнопки
//      -отступы

export default MainPage;