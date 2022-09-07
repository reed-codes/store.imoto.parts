import React from "react";

const EditBannerModalOptions = (props) => {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        position: "fixed",
        zIndex: 1000,
        bottom: 0,
        left: 0,
        padding: "1rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
      className="rounded shadow-lg border-top"
    >
      <button
        className={`btn btn-outline-${
          props.deleteConfirmationRequired.state ? "disabled" : "primary"
        } btn-sm mr-2 rounded`}
        onClick={() => {
          if (!props.deleteConfirmationRequired.state) {
            props.handleClose();
          }
        }}
        style={{
          cursor: props.deleteConfirmationRequired.state
            ? "not-allowed"
            : "pointer",
        }}
      >
        Finish
      </button>
    </div>
  );
};

export default EditBannerModalOptions;
