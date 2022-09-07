import React from "react";
import Modal from "react-modal";

const DELETE_CONFIRM_STYLES = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
    maxWidth: "600px",
    marginRight: "2rem",
    backgroundColor: "#fff",
  },
};

export const DeleteConfirmationDialogue = (props) => {
  return (
    <Modal
      isOpen={true}
      onRequestClose={props.cancel}
      contentLabel="login Modal"
      className="login-popup"
      id="login-popup-form"
      overlayClassName="cart-modal-overlay"
      style={DELETE_CONFIRM_STYLES}
    >
      <div className="container modal-wrapper"
           style = {{
             cursor:'default'
           }}
           >
        <div className="col-md-12">
          <div className="row" style={{ marginBottom: 15, paddingBottom: 15 }}>
            <form className="mb-1">
              <h5>{props.message}</h5>
            </form>
          </div>
        </div>
        <ModalActions
          label="Confirm"
          close={props.cancel}
          confirm={props.confirm}
        />
      </div>
      <button
        title="Close (Esc)"
        type="button"
        className="mfp-close"
        onClick={props.cancel}
      >
        ×
      </button>
    </Modal>
  );
};

export const ModalActions = (props) => {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        position: "fixed",
        zIndex: 1000,
        bottom: 0,
        left: 0,
        padding: "1rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
      className="rounded shadow-lg border-top"
    >
      <button
        className={`btn btn-outline-danger btn-sm mr-2 rounded`}
        onClick={props.close}
        style={{ width: 150 }}
      >
        Cancel
      </button>

      <button
        className={`btn btn-outline-primary btn-sm mr-2 rounded`}
        onClick={props.confirm}
        style={{ width: 150 }}
      >
        {props.label ? props.label : "Save"}
      </button>
    </div>
  );
};
