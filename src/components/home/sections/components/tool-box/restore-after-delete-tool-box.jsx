import React from "react";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";

const RestorationAfterDeleteToolBox = (props) => {
  const { sellerConfigs } = useSellerConfig();

  if(!sellerConfigs.UserInfo.enableEditing) return <></>

  return (
    <>
      {sellerConfigs.UserInfo.enableEditing && (
        <div
          style={{
            height: 42,
            position: "absolute",
            zIndex: 1000,
            top: -42,
            right: 20,
            display: "flex",
            alignItems: "center",
            color: "#fff",
            background: "#dc3545",
            padding: "6px 16px",
            borderRadius: 13,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            fontSize: 12,
            cursor: "default",
          }}
          className="shadow-lg"
        >
          <button
            style={{
              padding: "6px 12px",
              fontWeight: 700,
              borderColor: "#fff",
              color: "#fff",
              border: "1px #fff solid",
              background: "transparent",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
            className="restore-section-btn"
            onClick={props.restore}
          >
            <div>This section is hidden, click to restore</div>
          </button>
        </div>
      )}
    </>
  );
};

export default RestorationAfterDeleteToolBox;
