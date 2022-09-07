import React from "react";
import ReactDOM from "react-dom";
const modalRoot = document.getElementById("edit-modal");

const FancyEditBox = (props) => {
  return ReactDOM.createPortal(
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1050,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={props.close}
    >
      <div
        style={{
          border: "3px green solid",
          width: "60vw",
          minHeight: props.autoHeight ? "unset" : "400px",
          maxHeight: "718px",
          maxWidth: "650px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          pointerEvents: "auto",
          backgroundColor: "#fff",
          backgroundClip: "padding-box",
          border: "1px solid rgba(0,0,0,.2)",
          transform: "translate(0,0)",
          borderRadius: ".3rem",
          overflow: props.autoHeight ? "unset" : "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1 1 auto",
            boxSizing: "border-box",
            padding: "1rem 3rem",
            paddingBottom: "65px",
            paddingTop: "65px",
            height: "100%",
            overflow: "visible",
          }}
        >
          {props.children}
        </div>
      </div>
    </div>,

    modalRoot
  );
};

export default FancyEditBox;
