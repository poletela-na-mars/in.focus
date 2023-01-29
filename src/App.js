import React from "react";
import {Route, Routes} from "react-router-dom";

import MainPage from "./components/main-page/MainPage";
import MainPageAuth from "./components/main-page-auth/MainPageAuth";
import Login from "./components/login/Login";
import SignUp from "./components/sign-up/SignUp";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/home" element={<MainPageAuth/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
        </Routes>
    );
};

export default App;
