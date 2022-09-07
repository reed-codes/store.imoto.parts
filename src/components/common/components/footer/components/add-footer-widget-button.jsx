import React from "react";

const AddFooterWidgetButton = (props) => {
  return (
    <div
      style={{
        height: "100%",
        width: props.autoWidth ? "auto" : "100%",
        position: props.float ? "absolute" : "static",
        top: 0,
        left: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={"appear-on-hover-item-action-container"}
    >
      <div
        style={{
          height: 24,
          width: 24,
          background: "#3c4044",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="shadow-sm"
      >
        <button
          className="btn btn-outline-secondary rounded-0"
          style={{
            padding: 0,
            height: "100%",
            width: "100%",
            fontSize: 12,
          }}
          title="Add a product column"
          onClick={props.add}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="#999"
            className="bi bi-plus"
            viewBox="0 0 16 16"
            style={{ color: "#999 !important" }}
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddFooterWidgetButton;
