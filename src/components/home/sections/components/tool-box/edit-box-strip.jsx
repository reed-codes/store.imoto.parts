import React from "react";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import "./styles.css";

const EditBoxStrip = (props) => {
  const { sellerConfigs } = useSellerConfig();

  if (!sellerConfigs.UserInfo.enableEditing) return <></>;

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "5px",
          background: props.isDeleted ? "#dc354573" : "#afd4ec",
          position: "fixed",
          top: "0",
          right: "0",
          zIndex: 1000,
        }}
        className="edit-box-strip"
      />
    </>
  );
};

export default EditBoxStrip;
