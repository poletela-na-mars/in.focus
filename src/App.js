import React from "react";
import {Route, Routes} from "react-router-dom";

import MainPage from "./components/main-page/MainPage";
import Login from "./components/login/Login";
import SignUp from "./components/sign-up/SignUp";

const App = (props) => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
        </Routes>
    );
};

export default App;
