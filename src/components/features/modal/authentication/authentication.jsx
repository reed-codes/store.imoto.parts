import React, { useState } from "react";
import Modal from "react-modal";

import SigninModal from "./signin-modal";
import SignupModal from "./signup-modal";
import ForgotPasswordModal from "./forgot-password-modal";
import ConfirmCodeModal from "./confirmation-code-modal";
import AddressModal from "./../address-modal";

import NotSignedinNotice from "./../../../common/not-signedin-notice";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { setOpenAuthenticationModal } from "../../../../action";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "relative",
        maxWidth: "600px",
        marginRight: "2rem",
        backgroundColor: "#fff"
    }
};

Modal.setAppElement( "#root" );

function Authentication( props ) {
    const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();

    const isSignupModal = Boolean(localStorage.getItem("REDIRECT"));
    const [open, setOpen] = useState(isSignupModal || props.open);
    const [activeModal, setActiveModal] = useState(
        isSignupModal ? "SIGN-UP" : "SIGN-IN"
    );

    const openModal = ( e ) => {
        e.preventDefault();
        setOpen(true);
    }

    const closeModal = () => {
        setActiveModal("SIGN-IN");
        setOpen(false);
        sellerConfigDispatch(
            setOpenAuthenticationModal(false)
        );
    }

    return (
        <>
            <ActiveModal
                activeModal={activeModal}
                open={open || sellerConfigs.UserInfo.openAuthModal}
                setActiveModal={setActiveModal}
                closeModal={closeModal}
                customStyles={customStyles}
            />
            {props.component ?
                <props.component/>
                :
                <NotSignedinNotice openSigninModal={ openModal }/>
            }
        </>
    );
}

const ActiveModal = props => {
    const {
        activeModal,
        open,
        setActiveModal,
        closeModal,
        customStyles
    } = props;
    
    switch (activeModal) {
        case "SIGN-IN":
            return (
                <SigninModal
                    open={open}
                    setActiveModal={setActiveModal}
                    closeModal={closeModal}
                    customStyles={customStyles}
                />
            );
        case "SIGN-UP":
            return (
                <SignupModal
                    open={open}
                    setActiveModal={setActiveModal}
                    closeModal={closeModal}
                    customStyles={customStyles}
                />
            );
        case "FORGOT-PASSWORD":
            return (
                <ForgotPasswordModal
                    open={open}
                    setActiveModal={setActiveModal}
                    closeModal={closeModal}
                    customStyles={customStyles}
                />
            );
        case "CONFIRM-CODE":
            return (
                <ConfirmCodeModal
                    open={open}
                    setActiveModal={setActiveModal}
                    closeModal={closeModal}
                    customStyles={customStyles}
                />
            );        
        case "ADDRESS":
            return (
                <AddressModal
                    open={open}
                    closeModal={closeModal}
                    customStyles={customStyles}
                />
            );
        default: return null;
    }    
}

export default Authentication;