import React, { useState } from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import logo from '../../assets/logo.svg';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';


const Header = function (props) {
    const [value, setvalue] = useState(0);
    const [usernameRequired, setusernameRequired] = useState("dispNone");
    const [loginPasswordRequired, setloginPasswordRequired] = useState("dispNone");
    const [firstnameRequired, setfirstnameRequired] = useState("dispNone");
    const [lastnameRequired, setlastnameRequired] = useState("dispNone");
    const [emailRequired, setemailRequired] = useState("dispNone");
    const [registerPasswordRequired, setregisterPasswordRequired] = useState("dispNone");
    const [contactRequired, setcontactRequired] = useState("dispNone");
    const [modalIsOpen, setmodalIsOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("access-token") == null ? false : true);
    const [registrationSuccess, setregistrationSuccess] = useState(false);
    const [userRegistration, setUserRegistration] = useState({
        email: '',
        firstname: '',
        lastname: '',
        contactno: '',
        password: ''
    })
    const [userLogin, setuserLogin] = useState({
        emailid: '',
        passwd: ''
    })

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    const closeModalHandler = () => {
        setmodalIsOpen(false);
    }

    const tabChangeHandler = (event, value) => {
        setvalue(value);
    }

    const loginClickHandler = async (e) => {
        e.preventDefault();
        userLogin.emailid === "" ? setusernameRequired("dispBlock") : setusernameRequired("dispBlock");
        userLogin.passwd === "" ? setloginPasswordRequired("dispBlock") : setloginPasswordRequired("dispNone");
        const newUser = {
            "email_address": userLogin.emailid,
            "password": userLogin.passwd
        }
        const param = window.btoa(`${newUser.email_address}:${newUser.password}`);
        const rawResponse = await fetch('http://localhost:8085/api/v1/auth/login', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                authorization: `Basic ${param}`
            }
        });

        const result = await rawResponse.json();
        if (rawResponse.ok) {
            window.sessionStorage.setItem('user-details', JSON.stringify(result));
            window.sessionStorage.setItem('access-token', rawResponse.headers.get('access-token'));
            setusernameRequired("dispNone");
            setloginPasswordRequired("dispNone");
            setLoggedIn(true);
            closeModalHandler();

        } else {
            const error = new Error();
            error.message = result.message || 'Something went wrong.';
        }

    }

    const inputLoginHandler = (e) => {
        setuserLogin({ ...userLogin, [e.target.name]: e.target.value });

    }

    const inputRegisterHandler = (e) => {
        setUserRegistration({ ...userRegistration, [e.target.name]: e.target.value });

    }

    const registerClickHandler = async (e) => {
        e.preventDefault();
        userRegistration.firstname === "" ? setfirstnameRequired("dispBlock") : setfirstnameRequired("dispBlock");
        userRegistration.lastname === "" ? setlastnameRequired("dispBlock") : setlastnameRequired("dispBlock");
        userRegistration.email === "" ? setemailRequired("dispBlock") : setemailRequired("dispBlock");
        userRegistration.password === "" ? setregisterPasswordRequired("dispBlock") : setregisterPasswordRequired("dispBlock");
        userRegistration.contactno === "" ? setcontactRequired("dispBlock") : setcontactRequired("dispBlock");
        const newUser = {
            "email_address": userRegistration.email,
            "first_name": userRegistration.firstname,
            "last_name": userRegistration.lastname,
            "password": userRegistration.password,
            "mobile_number": userRegistration.contactno
        }
        console.log(newUser);
        const rawResponse = await fetch("http://localhost:8085/api/v1/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;charset=UTF-8"

            },
            body: JSON.stringify(newUser)
        });
        const result = await rawResponse.json();
        if (rawResponse.ok) {
            setregistrationSuccess(true);
            setfirstnameRequired("dispNone");
            setlastnameRequired("dispNone");
            setemailRequired("dispNone");
            setregisterPasswordRequired("dispNone");
            setcontactRequired("dispNone");

        } else {
            const error = new Error();
            error.message = result.message || 'Something went wrong.';
        }
    }

    const logoutHandler = (e) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");

        setLoggedIn(false);
    }
    const openModalHandler = () => {
        setmodalIsOpen(true);
    }
    return (
        <div>
            <header className="app-header">
                <img src={logo} className="app-logo" alt="Movies App Logo" />
                {!loggedIn ?
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={openModalHandler}>
                            Login
                        </Button>
                    </div>
                    :
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={logoutHandler}>
                            Logout
                        </Button>
                    </div>
                }
                {props.showBookShowButton === true && !loggedIn
                    ? <div className="bookshow-button">
                        <Button variant="contained" color="primary" onClick={openModalHandler}>
                            Book Show
                        </Button>
                    </div>
                    : ""
                }

                {props.showBookShowButton === true && loggedIn
                    ? <div className="bookshow-button">
                        <Link to={"/bookshow/" + props.id}>
                            <Button variant="contained" color="primary">
                                Book Show
                            </Button>
                        </Link>
                    </div>
                    : ""
                }
                <Modal
                    ariaHideApp={false}
                    isOpen={modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={closeModalHandler}
                    style={customStyles}>
                    <Tabs className="tabs" value={value} className="tabs" onChange={tabChangeHandler}>
                        <Tab label="Login" >
                        </Tab>
                        <Tab label="Register" >
                        </Tab>
                    </Tabs>
                    <TabPanel value={value} index={0} className="tabContent">
                        <div style={{ marginLeft: "20%" }}>
                            <FormControl required={true}>
                                <InputLabel htmlFor="emailid">Username</InputLabel>
                                <Input id="emailid" name="emailid" type="text" username={userLogin.emailid} onChange={inputLoginHandler} />
                                <FormHelperText className={usernameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>

                            <br></br>
                            <FormControl required>
                                <InputLabel htmlFor="passwd">Password</InputLabel>
                                <Input id="passwd" name="passwd" type="password" loginpassword={userLogin.passwd} onChange={inputLoginHandler} />
                                <FormHelperText className={loginPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br></br>
                            <br></br>
                            <Button variant="contained" color="primary" onClick={loginClickHandler} style={{ marginLeft: "25%" }}>LOGIN</Button>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} className="tabContent">
                        <div style={{ marginLeft: "20%" }}>
                            <FormControl required={true}>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" name="firstname" type="text" username={userRegistration.firstname} onChange={inputRegisterHandler} />
                                <FormHelperText className={firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <FormControl required={true}>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" name="lastname" type="text" username={userRegistration.lastname} onChange={inputRegisterHandler} />
                                <FormHelperText className={lastnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br></br>
                            <FormControl required={true}>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" name="email" type="text" username={userRegistration.email} onChange={inputRegisterHandler} />
                                <FormHelperText className={emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br></br>
                            <FormControl required={true}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" name="password" type="password" username={userRegistration.password} onChange={inputRegisterHandler} />
                                <FormHelperText className={registerPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br></br>
                            <FormControl required={true}>
                                <InputLabel htmlFor="contactno">Contact No</InputLabel>
                                <Input id="contactno" name="contactno" type="text" username={userRegistration.contactno} onChange={inputRegisterHandler} />
                                <FormHelperText className={contactRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {registrationSuccess === true &&
                                <FormControl>
                                    <span className="successText">
                                        Registration Successful. Please Login!
                                    </span>
                                </FormControl>
                            }
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={registerClickHandler} style={{ marginLeft: "25%" }}>REGISTER</Button>
                        </div>
                    </TabPanel>
                </Modal>
            </header>
        </div>
    )
}
const TabPanel = ({ children, value, index }) => {
    return (
        <div>
            {
                value === index && (
                    <div>{children}</div>
                )
            }
        </div>
    )
}


export default Header;