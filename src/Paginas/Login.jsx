import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom"; // Cambiado de useNavigate a useHistory
import { auth } from "../data/FIreBase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/Login.css";
import App from "../App";

const Login = ({ handleLogin }) => { // Añadido handleLogin como prop
    const [showPassword, setShowPassword] = useState(false);
    //const navigate = useNavigate(); // Cambiado de useNavigate a useHistory
    const [values, setValues] = useState({ email: "", pass: "" });
    const [erroMsg, setErrMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisable] = useState(false);
    
    const iniciarSesion = () => {
        if (!values.email || !values.pass) {
            setErrMsg("Debe llenar todos los campos");
            return;
        } else {
            setErrMsg("");
            setSubmitButtonDisable(true);
            signInWithEmailAndPassword(auth, values.email, values.pass)
                .then(() => {
                    setSubmitButtonDisable(false);
                    handleLogin(); // Llama a la función handleLogin proporcionada como prop
                   // Redirige a la página de dashboard después del inicio de sesión
                })
                .catch((err) => {
                    setSubmitButtonDisable(false);
                    setErrMsg(err.message);
                });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailChange = (event) => {
        setValues({ ...values, email: event.target.value });
    };

    const handlePasswordChange = (event) => {
        setValues({ ...values, pass: event.target.value });
    };

    return (
        <div className="container">
            <div className="heading">Ingresar al Sistema</div>
            <form className="form">
                <input
                    className="input"
                    type="email"
                    placeholder="Ingrese el email"
                    onChange={handleEmailChange}
                />
                <div className="password-container">
                    <input
                        className="input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingrese el Password"
                        onChange={handlePasswordChange}
                    />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </span>
                </div>
                <span className="forgot-password">
                    <a href="#">Olvidaste tu Contraseña ?</a>
                </span>
                <button className="login-button" onClick={iniciarSesion} disabled={submitButtonDisabled}>
                    Ingresar
                </button> 
                <div>{erroMsg}</div>
                <br />
            </form>
        </div>
    );
};

export default Login;
