import React from "react";

const ModalActions = (props) => {
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
        className={`btn btn-outline-${
            props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "disabled" : "danger"
        } btn-sm mr-2 rounded`}
        onClick={() => {
            if (!(props.deleteConfirmationRequired) || !(props.deleteConfirmationRequired && props.deleteConfirmationRequired.state)) {
              props.handleClose();
            }
        }}
        style={{
          cursor: props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "not-allowed" : "pointer",
            width: "150px"
        }}
      >
        Cancel
      </button>

      <button
        className={`btn btn-outline-${
            props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "disabled" : "primary"
        } btn-sm mr-2 rounded`}
        onClick={() => {
          if (!(props.deleteConfirmationRequired) || !(props.deleteConfirmationRequired && props.deleteConfirmationRequired.state)) {
            props.handleSave();
          }
        }}
        style={{
          cursor: props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "not-allowed" : "pointer",
            width: "150px"
        }}
      >
        {props.saveTitle ? props.saveTitle : "Save"}
      </button>
    </div>
  );
};

export default ModalActions;