import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import UserInformationForm from "./components/UserInformationForm";

export default function LoginRegister(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const {onComplete, type}  = props;

    const postURL = type === "register" ? "http://127.0.0.1:5000/register" : "http://127.0.0.1:5000/login";
    const redirectPath = type === "register" ? "/upload" : "/overall";
    const header = type === "register" ? "Please register" : "Please log In";
    const buttonText = type === "register" ? "Register" : "Log In";

    function onSubmit(event) {
        const regex = /^[0-9a-zA-Z_.-]+$/;

        if (username.match(regex) && password.match(regex)) {
            axios.post(postURL, {username: username, password: password}, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => {
                if (response.data.success) {
                    localStorage.setItem("username", username);
                    onComplete();
                    setRedirect(true);
                } else {
                    setUsername("");
                    setPassword("");
                }
            });
        }

        event.preventDefault();
    }

    if (type === "login" && localStorage.getItem("username")) {
        return <Redirect to={redirectPath}/>;
    }

    if (redirect) {
        return <Redirect to={redirectPath}/>
    }

    return (
        <UserInformationForm header={header} buttonText={buttonText} username={username} setUsername={setUsername} password={password} setPassword={setPassword} onSubmit={onSubmit}/>
    );
}
