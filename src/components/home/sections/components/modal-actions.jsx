import React from "react";

const ModalActions = (props) => {
  const {handleClose, handleSave, closeTitle, saveTitle} = props;
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
        className="btn btn-outline-danger btn-sm mr-2 rounded"
        onClick={handleClose}
        style={{
          cursor: "pointer",
          width: "150px"
        }}
      >
        {closeTitle ? closeTitle : "No"}
      </button>
      <button
        className="btn btn-outline-primary btn-sm mr-2 rounded"
        onClick={handleSave}
        style={{
          cursor: "pointer",
          width: "150px"
        }}
      >
        {saveTitle ? saveTitle : "Yes"}
      </button>
    </div>
  );
};

export default ModalActions;