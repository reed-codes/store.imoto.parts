import React from "react";
import Modal from "react-modal";

import ModalActions from "./modal-actions";

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

const ConfirmDelete = (props) => {
  const { cancel, confirm, title, message } = props;

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
              <h5>{title ? title : "Delete"}</h5>
              <p>{message}</p>                
            </form>
          </div>
        </div>
        <ModalActions
          saveTitle="Yes"
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

export default ConfirmDelete;