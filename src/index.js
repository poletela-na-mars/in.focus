import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter} from "react-router-dom";

// const xhr = new XMLHttpRequest()
// xhr.open('POST', .)
// xhr.setRequestHeader("X-Frame-Options", "DENY");
// xhr.setRequestHeader("Content-Security-Policy", "frame-ancestors 'none'");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
