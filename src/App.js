import React from "react";
import {Route, Routes} from "react-router-dom";

import MainPage from "./components/main-page/MainPage";
import MainPageAuthFun from "./components/main-page-auth/MainPageAuthFun";
import LoginFun from "./components/login/LoginFun";
import SignUpFun from "./components/sign-up/SignUpFun";

const App = (props) => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/home" element={<MainPageAuthFun/>}/>
            <Route path="/login" element={<LoginFun/>}/>
            <Route path="/signup" element={<SignUpFun/>}/>
        </Routes>
    );
};

export default App;
