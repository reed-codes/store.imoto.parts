import React, { useState } from "react";
import Modal from "react-modal";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router";

import Alert from "./../../../common/alert";

const SigninModal = (props) => {
  const { open, setActiveModal, closeModal, customStyles } = props;

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "",
  });

  /**
   * handleInputChange, is a function called whenever a user input changes.
   * This function will use 2 way binding to update the state variables.
   *
   * @param {Object} event    the input event to be handled.
   */
  const handleInputChange = (event) => {
    event.preventDefault();
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * handleCloseAlertClicked, handler function used to reset the user alert
   * component. The component props will be set to they zero values, and it
   * is triggered on close button click.
   */
  const handleCloseAlertClicked = () => {
    setAlert({
      open: false,
      message: "",
      type: "",
    });
  };

  /**
   * handleEmailPasswordSigninClicked, function used to signin a user using
   * both email and and password. If the user has not yet been confirmed the
   * user will be taken to the confirmation screen where a user will be
   * prompted to verify/confirm his or her email address.s
   */
  const handleEmailPasswordSigninClicked = async () => {
    try {
      await Auth.signIn(user.email, user.password);
      closeModal();
      // reload the page that the user is attemping to see after signing
      // in this will help in displaying the actual component instead on
      // the of the component that gets displayed when the user is not
      // signed in when attempting to go to a private route or a route
      // that expects the user to be signed in.
      window.location.reload(false);
    } catch (error) {
      // if the instance of error type is "UserNotConfirmedException" then
      // open the confirmation code screen.
      if (error.code === "UserNotConfirmedException") {
        localStorage.setItem("VERIFICATION-EMAIL", user.email);
        setAlert({
          type: "warning",
          open: true,
          message: error.message,
        });
        setActiveModal("CONFIRM-CODE");
        return;
      }

      // report the error in a user friendly manner.
      setAlert({
        type: "danger",
        open: true,
        message: error.message,
      });
    }
  };

  /**
   * handleFederatedAccountSignin, is a function that will be called when a
   * user attempts to signin with a fedarate account the currently supported
   * methods are Facebook and Google.
   *
   * @param {String} method     the signin method prefered[google|facebook].
   */
  const handleFederatedSigninClicked = async (method) => {
    try {
      // check if the user already has an account if not then notify
      // the user to create an account to collect the user profile
      // infomarion.
      localStorage.setItem("REQUESTED-PATH", window.location.pathname);
      localStorage.setItem("REDIRECT", "SIGN-UP");

      await Auth.federatedSignIn({
        provider: method,
        customState: JSON.stringify({sourceURL: window.location.origin}),
      });
    } catch (error) {
      localStorage.removeItem("REQUESTED-PATH");
      setAlert({
        type: "danger",
        open: true,
        message: error.message,
      });
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      contentLabel="login Modal"
      className="login-popup"
      id="login-popup-form"
      overlayClassName="cart-modal-overlay"
      style={customStyles}
    >
      <div className="modal-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="title mb-2">Login</h2>
              <form className="mb-1">
                <label>
                  Email address <span className="required">*</span>
                </label>
                <input
                  onChange={(e) => handleInputChange(e)}
                  type="email"
                  name="email"
                  className="form-input form-wide mb-2"
                  id="login-email"
                  required
                />

                <label>
                  Password <span className="required">*</span>
                </label>
                <input
                  onChange={(e) => handleInputChange(e)}
                  type="password"
                  name="password"
                  className="form-input form-wide mb-2"
                  id="login-password"
                  required
                />

                <div className="form-footer">
                  <button
                    type="button"
                    onClick={handleEmailPasswordSigninClicked}
                    className="btn btn-primary btn-md"
                  >
                    LOGIN
                  </button>
                  <div className="custom-control custom-checkbox form-footer-right">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="lost-password"
                    />
                    <label
                      className="custom-control-label form-footer-right"
                      htmlFor="lost-password"
                    >
                      Remember Me
                    </label>
                  </div>
                </div>
                <span
                  onClick={(_) => setActiveModal("FORGOT-PASSWORD")}
                  style={{
                    color: "#08C",
                    cursor: "pointer",
                    marginRight: 30,
                  }}
                  className="forget-password"
                >
                  Forgot your password?
                </span>
                <span
                  onClick={(_) => setActiveModal("SIGN-UP")}
                  style={{
                    color: "#000",
                    cursor: "pointer",
                  }}
                  className="forget-password"
                >
                  Dont have an account Signup?
                </span>
              </form>
            </div>
          </div>
        </div>
        <div className="social-login-wrapper">
          <p>Access your account through your social networks.</p>
          <div className="btn-group">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
              onClick={(_) => handleFederatedSigninClicked("Google")}
              className="btn btn-social-login btn-md btn-gplus mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                style={{ marginBottom: "1px" }}
                fill="#fff"
                className="bi bi-google"
                viewBox="0 0 16 16"
              >
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
              onClick={(_) => handleFederatedSigninClicked("Facebook")}
              className="btn btn-social-login btn-md btn-facebook mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                style={{ marginBottom: "1px" }}
                fill="#fff"
                className="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
              <span>Facebook</span>
            </button>

            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                background: "#08C",
              }}
              onClick={(_) =>
                handleFederatedSigninClicked("stage.singlekey-id.com")
              }
              className="btn btn-social-login btn-md btn-facebook mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                style={{ marginBottom: "1px" }}
                fill="#fff"
                className="bi bi-key-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
              <span>Single-Key</span>
            </button>
          </div>
        </div>
        <button
          title="Close (Esc)"
          type="button"
          className="mfp-close"
          onClick={closeModal}
        >
          ×
        </button>
      </div>
      <Alert
        open={alert.open}
        close={handleCloseAlertClicked}
        type={alert.type}
        message={alert.message}
      />
    </Modal>
  );
};

export default withRouter(SigninModal);
