import React from "react";
import Modal from "react-modal";

import ModalActions from "./ModalActions";

const DELETE_CONFIRM_STYLES = {
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

export const ConfirmDelete = (props) => {
  const { cancel, confirm } = props;

  return (
    <Modal
      isOpen={ true }
      onRequestClose={ cancel }
      contentLabel="login Modal"
      className="login-popup"
      id="login-popup-form"
      overlayClassName="cart-modal-overlay"
      style={ DELETE_CONFIRM_STYLES }
    >  
      <div className="container modal-wrapper">
        <div className="col-md-12">
          <div className="row" style={{marginBottom: 15, paddingBottom: 15}}>
            <form className="mb-1">
              <h5>Are you sure you would like to delete this Brand from the Brand Container</h5>                
            </form>
          </div>
        </div>
        <ModalActions
          saveTitle="Confirm"
          handleClose={cancel}
          handleSave={confirm}
        />
      </div>
      <button
        title="Close (Esc)"
        type="button"
        className="mfp-close"
        onClick={ cancel }
      >
        ×  
      </button>
    </Modal>
  );
}