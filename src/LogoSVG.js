import logo from "./in_focus_logo_dis.svg";

const LogoSVG = (props) => {
    return (
        <div>
            <img src={logo} alt="Logo" style={{height: props.height, width: props.width}}/>
        </div>
    );
};

export default LogoSVG;