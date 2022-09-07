import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { Auth } from "aws-amplify";
import { Base64 } from "js-base64";

import { instanceCOGNITO } from "../../../../axios/axios-instances";

import { SellerConfigContext } from "../../../../store/sellerConfigContext"

import Alert from "./../../../common/alert";

const SignupModal = ({open, setActiveModal, closeModal, customStyles}) => {
    // get the default seller configurations, these include: default countries,
    // default loyalty programs and the seller configurations.
    const { sellerConfigs } = useContext(SellerConfigContext);

    // retrieve this field so that we know how to render the sign-up modal. If
    // there is a redirect feild in local storage then we know that we just came
    // back from the google/facebook signup process.
    const [federatedSignin] = useState(Boolean(localStorage.getItem("REDIRECT")));
    const [userInfo, setUserInfo] = useState({
        name: "",
        country: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountNumber: 0
    });
    const [alert, setAlert] = useState({
        open: false,
        type: "",
        message: ""
    });

    /**
     * handleInputChange, is a function called whenever a user input changes.
     * This function will use 2 way binding to update the state variables.
     * 
     * @param {Object} event    the input event to be handled.
     */
    const handleInputChange = event => {
        event.preventDefault();
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        });
    }

    /**
     * handleCloseAlertClicked, handler function used to reset the user alert
     * component. The component props will be set to they zero values, and it
     * is triggered on close button click.
     */
    const handleCloseAlertClicked = () => {
        setAlert({
            open: false,
            message: "",
            type: ""
        });
    }

    /**
     * handleFederatedAccountSignup, is a function that will be called when a
     * user attempts to signup with a fedaret account the currently supported
     * methods are Facebook and Google.
     * 
     * @param {String} method     the signup method prefered[google|facebook].
     */
    const handleFederatedAccountSignup = async method => {
        try {
            // the following will enable us to know if there was a redirect
            // hence signaling/flaging to re-display the signup modal but with
            // the required fields rendered an also redirect the user to the page
            // that he was attempting to go to.
            localStorage.setItem("REDIRECT", "SIGN-UP");
            localStorage.setItem("REQUESTED-PATH", window.location.pathname);
            await Auth.federatedSignIn({ provider: method});
        } catch (error) {
            localStorage.removeItem("REDIRECT");
            localStorage.removeItem("REQUESTED-PATH");
            setAlert({
                open: true,
                message: error.message,
                type: "danger"
            });
        }
    }

    /**
     * 
     */
    const handleFinaliseFederatedSignup = async () => {
        // get the currently authenticated user to obtain the access token
        // there after get the user info from cognito to capture the username
        // amd the user email.
        instanceCOGNITO.get("userInfo")
        .then(response => {
            localStorage.setItem(
                "SIGNUP-USER",
                Base64.encode(JSON.stringify({
                    ...userInfo,
                    email: response.data.email,
                    userID: response.data.username
                }))
            );                
            localStorage.removeItem("REDIRECT");
            setActiveModal("ADDRESS");            
        }).catch((error) => {
            setAlert({
                open: true,
                message: error.message,
                type: "danger"
            });
        });
    }

    const handleEmailAndPasswordSignup = async () => {
        // check if the password and the confirmation password match else report
        // to the user the password mistmatch
        if (userInfo.password !== userInfo.confirmPassword) {
            setAlert({
                open: true,
                message: "Password does not match with the confirmation password",
                type: "warning"
            });
            return;
        }
        // check if the the user name is not empty, if empty report to the user
        // that the user "Name" is required.
        if (userInfo.name === "") {
            setAlert({
                open: true,
                message: "The user 'Name' can not be empty",
                type: "warning"
            });
            return;
        }
        
        try {
            const response = await Auth.signUp({
                username: userInfo.email,
                password: userInfo.password,
                attributes: {
                    email: userInfo.email,
                    phone_number: userInfo.phone
                }
            });
            
            localStorage.setItem(
                "SIGNUP-USER",
                Base64.encode(JSON.stringify({
                    ...userInfo,
                    userID: response.userSub
                }))
            );
    
            setActiveModal("CONFIRM-CODE");
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "danger"
            });
        }
    }

    return (
        <Modal
            isOpen={open}
            onRequestClose={closeModal}
            contentLabel="login Modal"
            className="login-popup"
            id="login-popup-form"
            overlayClassName="cart-modal-overlay"
            style={{
                ...customStyles,
                content: {
                    ...customStyles.content,
                    maxWidth: federatedSignin ? 600 : 870
                }
            }
        }>
            <div className="modal-wrapper" style={{ maxHeight: "unset" }}>
                <div className="container">
                    <div className="col-md-12">
                        <h2 className="title mb-2">Register</h2>
                        {!federatedSignin &&
                            <div className="alert alert-warning d-flex align-items-center" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 40, height: 40, marginRight: 10 }} fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                </svg>
                                <div>
                                    Please note when a valid phone number is provided, the sign up confirmation will be sent via sms to that number. When signing in, the phone number should be used in the user name field to signin.
                                </div>
                            </div>
                        } 
                        <form style={{ marginBottom: 0 }}>
                            <div className="row">
                                <div className={`col-md-${federatedSignin ? "12" : "6"}`}>
                                    <div className="col-md-12">
                                        <label>Name <span className="required">*</span></label>
                                        <input name="name" onChange={(e) => handleInputChange(e)} type="text" className="form-input form-wide mb-2" required />
                                    </div>
                                    <div className="row" >
                                        <div className="col-md-6">
                                            <label>Country<span className="required">*</span></label>
                                            <div className="select-custom" style={{width: "100%"}}>
                                                <select value={userInfo.country} onChange={(e) => handleInputChange(e)} name="country" className="form-control form-control-sm">
                                                    {sellerConfigs.DefaultCountryCodes.map(countryCode =>
                                                        <option
                                                            key={countryCode}
                                                            value={countryCode}
                                                        >
                                                            {sellerConfigs.DefaultCountries[countryCode].Name}
                                                        </option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Phone</label>
                                            <input name="phone" onChange={(e) => handleInputChange(e)} type="tel" className="form-input form-wide mb-2"/>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Account Number</label>
                                        <input name="accountNumber" onChange={(e) => handleInputChange(e)} type="number" className="form-input form-wide mb-2"/>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    {!federatedSignin &&
                                        <>
                                            <label>Email address <span className="required">*</span></label>
                                            <input name="email" onChange={(e) => handleInputChange(e)} type="email" className="form-input form-wide mb-2" required />

                                            <label>Password <span className="required">*</span></label>
                                            <input name="password" onChange={(e) => handleInputChange(e)} type="password" className="form-input form-wide mb-2" required />

                                            <label>Confirm Password <span className="required">*</span></label>
                                            <input name="confirmPassword" onChange={(e) => handleInputChange(e)} type="password" className="form-input form-wide mb-2" required />
                                        </>
                                    }
                                </div>
                            </div>    
                            <div className="form-footer">
                                {federatedSignin ?
                                    <button type="button" onClick={handleFinaliseFederatedSignup} className="btn btn-primary btn-md">Finalise Registration</button>
                                    :
                                    <button type="button" onClick={handleEmailAndPasswordSignup} className="btn btn-primary btn-md">Register</button>
                                }
                            </div>
                            {!federatedSignin &&
                                <>
                                    <span
                                        onClick={_ => setActiveModal("FORGOT-PASSWORD")}
                                        style={{
                                            color: "#08C",
                                            cursor: "pointer",
                                            marginRight: 30
                                        }}
                                        className="forget-password"
                                    >
                                        Forgot your password?
                                    </span>
                                    <span
                                        onClick={_ => setActiveModal("SIGN-IN")}
                                        style={{
                                            color: "#000",
                                            cursor: "pointer",
                                        }}
                                        className="forget-password"
                                    >
                                        Have an account Signin?
                                    </span>
                                </>
                            }
                        </form>
                    </div>
                </div>
                {!federatedSignin &&
                    <div className="social-login-wrapper">
                        <p>Access your account through  your social networks.</p>
                        <div className="btn-group">
                            <button type="button" onClick={() => handleFederatedAccountSignup("Google")} className="btn btn-social-login btn-md btn-gplus mb-1">
                                <i className="fab fa-google"></i><span>Google</span>
                            </button>
                            <button type="button" onClick={() => handleFederatedAccountSignup("Facebook")} className="btn btn-social-login btn-md btn-facebook mb-1">
                                <i className="fab fa-facebook"></i><span>Facebook</span>
                            </button>
                        </div>
                    </div>
                }
                <button title="Close (Esc)" type="button" className="mfp-close" onClick={closeModal}>×</button>
            </div>
            <Alert
                open={alert.open}
                close={handleCloseAlertClicked}
                type={alert.type}
                message={alert.message}
            />
        </Modal>
    );
}

export default SignupModal;
