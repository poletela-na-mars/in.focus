export const authMiddleWare = (navigate) => {
    const authToken = localStorage.getItem('AuthToken');
    if (authToken === null){
        navigate("/login");
    }
}
