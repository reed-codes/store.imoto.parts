import React from "react";

const FancyEditBoxHeader = (props) => {
  return (
    <div
      className="modal-header"
      style={{
        height: 60,
        width: "100%",
        cursor: "default",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 110,
        background: "#fff",
      }}
    >
      <h5
        style={{
          marginBottom: 0,
          lineHeight: 1.5,
          fontSize: "20px",
        }}
      >
        {props.title}
      </h5>

      <button
        className="btn btn-primary"
        style={{
          height: 30,
          width: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderRadius: 3,
          background: "transparent",
          borderColor: "transparent",
          cursor: "pointer !important",
        }}
        onClick={props.close}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#111"
          className="bi bi-x-lg"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
          />
          <path
            fillRule="evenodd"
            d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default FancyEditBoxHeader;
