import React, { useState, useEffect ,useContext} from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import GoogleButton from 'react-google-button'
import {Avatar} from '@mui/material'
import logo from '../../images/meeting_logo_2.jpg'
import { UserContext } from "../../context/UserContext";

const Login = ({ setUserState }) => {
    const {userObject,setUserObject} = useContext(UserContext);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUserDetails] = useState({
        email: "",
        password: "",
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...user,
            [name]: value,
        });
    };
    const validateForm = (values) => {
        const error = {};
        const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.email) {
            error.email = "Email is required";
        } else if (!regex.test(values.email)) {
            error.email = "Please enter a valid email address";
        }
        if (!values.password) {
            error.password = "Password is required";
        }
        return error;
    };

    const loginHandler = (e) => {
        e.preventDefault();
        setFormErrors(validateForm(user));
        setIsSubmit(true);
        // if (!formErrors) {

        // }
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(user);
            axios.post("http://localhost:3000/user/login", user).then((res) => {
                alert(res.data.message);
                setUserObject(res.data.user);
                navigate("/", { replace: true });

            });
        }
    }, [formErrors]);
    return (
        <div className={basestyle.body}>
            <div className={loginstyle.login} >
                <Avatar
                    style={{margin:"auto", width:"200px", height:"200px"}}
                    alt="Remy Sharp"
                    src={logo}
                    onClick={() => {window.location="http://localhost:3001"}}
                />
                <form>
                    <h1>Login</h1>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        onChange={changeHandler}
                        value={user.email}
                    />
                    <p className={basestyle.error}>{formErrors.email}</p>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={changeHandler}
                        value={user.password}
                    />
                    <p className={basestyle.error}>{formErrors.password}</p>
                    <button className={basestyle.button_common} onClick={loginHandler}>
                        Login
                    </button>
                </form>
                <div >
                    <GoogleButton style={{margin:"auto", width: "70%"}} onClick={() => { window.location.replace("http://localhost:3000/auth/google/") }} />
                </div>
                <NavLink to="/signup">Not yet registered? Register Now</NavLink>


            </div>
        </div>

    );
};
export default Login;
