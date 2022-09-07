import React, { useState } from "react";
import Modal from "react-modal";
import { Auth } from "aws-amplify";
import Alert from "./../../../common/alert"

const SigninModal = props => {
    const { open, setActiveModal, closeModal, customStyles } = props;

    const [confirmCodeSent, setConfirmCodeSent] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: "",
        code: "",
        password: "", 
        confirmPassword: ""
    });
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: ""
    });

    const handleInputChange = (event) => {
        event.preventDefault();
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })
    }

    const handleCloseAlertClicked = () => {
        setAlert({
            open: false,
            message: "",
            type: ""
        });
    }

    const handleForgotPasswordClicked = async () => {
        if (!userInfo.email) {
            setAlert({
                open: true,
                message: "Email can not be empty.",
                type: "warning"
            });
            return;
        }

        try {
            await Auth.forgotPassword(userInfo.email);
            setConfirmCodeSent(true);
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "danger"
            });
        }
    }

    const handleResetPasswordClicked = async () => {
        if (userInfo.password !== userInfo.confirmPassword) {
            setAlert({
                open: true,
                message: "Password and Confirm Password must match.",
                type: "danger"
            });
            return;
        }

        try {
            await Auth.forgotPasswordSubmit(
                userInfo.email,
                userInfo.code,
                userInfo.password
            );
            closeModal();
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
            isOpen={ open }
            onRequestClose={ closeModal }
            contentLabel="login Modal"
            className="login-popup"
            id="login-popup-form"
            overlayClassName="cart-modal-overlay"
            style={ customStyles }
        >
          <div className="modal-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="title mb-2">Reset Password</h2>
                            <form action="#" className="mb-1">
                                <label htmlFor="login-email">Email address <span className="required">*</span></label>
                                <input type="email" name="email" value={userInfo.email} onChange={(e) => handleInputChange(e)} className="form-input form-wide mb-2" id="login-email" required />
                                {confirmCodeSent &&
                                    <>
                                        <label htmlFor="login-password">Code <span className="required">*</span></label>
                                        <input name="code" value={userInfo.code} onChange={(e) => handleInputChange(e)} type="text" className="form-input form-wide mb-2" id="login-password" required />

                                        <label htmlFor="login-password">New Password <span className="required">*</span></label>
                                        <input type="password" name="password" value={userInfo.password} onChange={(e) => handleInputChange(e)}  className="form-input form-wide mb-2" id="login-password" required />

                                        <label htmlFor="login-password">Confirm New Password <span className="required">*</span></label>
                                        <input type="password" name="confirmPassword" value={userInfo.confirmPassword} onChange={(e) => handleInputChange(e)}  className="form-input form-wide mb-2" id="login-password" required />
                                    </>
                                }
                                <div className="form-footer">
                                    {confirmCodeSent ?
                                        <>
                                            <button type="button" className="btn btn-primary btn-md" onClick={handleResetPasswordClicked}>Reset Password</button>
                                            <div className="custom-control custom-checkbox form-footer-right">
                                                <button type="button" className="btn btn-primary btn-md" onClick={handleForgotPasswordClicked}>Resend Confirmation Code</button>
                                            </div>
                                        </>
                                        :
                                        <button type="button" className="btn btn-primary btn-md" onClick={handleForgotPasswordClicked}>Reset Password</button>
                                    }
                                    
                                </div>
                                <span 
                                    onClick = { _ => setActiveModal("SIGN-IN")}
                                    style={{
                                         color: "#08C",
                                         cursor:"pointer",
                                         marginRight: 30
                                        }}
                                    className="forget-password"
                                >
                                    Have and account signin?
                                </span>
                                <span
                                    onClick = { _ => setActiveModal("SIGN-UP")}
                                    style={{
                                        color: "#000",
                                        cursor:"pointer",
                                    }}
                                    className="forget-password"
                                >
                                    Dont have an account Signup?
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
                <button title="Close (Esc)" type="button" className="mfp-close" onClick={ closeModal }>×</button>
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

export default SigninModal;
