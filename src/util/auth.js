import {useNavigate} from "react-router-dom";

// const navigate = useNavigate();

export const authMiddleWare = (navigate) => {
    const authToken = localStorage.getItem('AuthToken');
    if (authToken === null){
        // history.push('/login')
        navigate("/login");
    }
}