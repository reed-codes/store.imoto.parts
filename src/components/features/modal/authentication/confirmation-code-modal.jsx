import React, { useState } from "react";
import Modal from "react-modal";
import { Auth } from "aws-amplify";
import { Base64 } from "js-base64";

import Alert from "./../../../common/alert";

const ConfirmCodeModal = props => {
    const userInfo = JSON.parse(
        Base64.decode(localStorage.getItem("SIGNUP-USER"))
    );

    const { open, setActiveModal, closeModal, customStyles } = props;

    const [verificationCode, setVerificationCode] = useState("");
    const [alert, setAlert] = useState({
        open: false,
        type: "",
        message: ""
    })

    const handleCloseAlertClicked = () => {
        setAlert({
            open: false,
            message: "",
            type: ""
        });
    }

    const handleConfirmEmailClicked = async () => {
        try {
            await Auth.confirmSignUp(userInfo.email, verificationCode);
            await Auth.signIn(userInfo.email, userInfo.password);
            setActiveModal("ADDRESS");
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "danger"
            });
        }
    }

    const handleResendCodeClicked = async () => {
        try {
            await Auth.resendSignUp(userInfo.email);
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
                            <h2 className="title mb-2">Verify Email</h2>
                            <form className="mb-1">
                                <label htmlFor="login-email">Email address <span className="required">*</span></label>
                                <input type="email" name="email" value={userInfo.email} className="form-input form-wide mb-2" disabled/>
                                    
                                <label htmlFor="login-password">Code <span className="required">*</span></label>
                                <input name="code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} type="text" className="form-input form-wide mb-2"/>

                                <div className="form-footer">
                                    <button type="button" className="btn btn-primary btn-md" onClick={handleConfirmEmailClicked}>Verify Email</button>
                                    <div className="custom-control custom-checkbox form-footer-right">
                                        <button type="button" className="btn btn-primary btn-md" onClick={handleResendCodeClicked}>Resend Confirmation Code</button>
                                    </div>
                                </div>
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

export default ConfirmCodeModal;