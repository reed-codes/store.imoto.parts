import React, { useState } from "react";
import {
  hideDeletedComponents,
  showDeletedComponents,
} from "../../../../action";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
const ViewDeletedSectionsToggleButton = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const toggleDeletedSectionsView = () => {
    if (sellerConfigs.UIConfig.viewDeleteSections) {
      sellerConfigDispatch(hideDeletedComponents());
    } else {
      sellerConfigDispatch(showDeletedComponents());
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10,
        bottom: "16px",
        left: "16px",
        background: sellerConfigs.UIConfig.viewDeleteSections
          ? "rgba(0,0,0,.5)"
          : "transparent",
        backdropFilter: sellerConfigs.UIConfig.viewDeleteSections
          ? "blur(50px)"
          : "unset",
        padding: 4,
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        cursor: "default",
        border: `1px ${
          sellerConfigs.UIConfig.viewDeleteSections
            ? "rgba(0,0,0,.15)"
            : "transparent"
        } solid`,
        color: "#fff",
        transition: "all 0.1s ease-out",
      }}
      className={`${
        sellerConfigs.UIConfig.viewDeleteSections ? "shadow-lg" : ""
      } view-deleted-section-toggle-btn animate__animated animate__rubberBand`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="btn btn-danger rounded-circle shadow-lg"
        style={{
          padding: 0,
          height: "100%",
          width: "100%",
          height: 50,
          width: 50,
        }}
        onClick={toggleDeletedSectionsView}
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#fff"
            className="bi bi-eye-slash-fill"
            viewBox="0 0 16 16"
          >
            <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
            <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
          </svg>

      </button>

      {sellerConfigs.UIConfig.viewDeleteSections && (
        <div
          style={{
            height: "100%",
            marginLeft: 4,
            marginRight: 16,
            fontSize: 12,
          }}
        >
          Toggle view hidden section : <b>ON</b>
        </div>
      )}

      {isHovered && !sellerConfigs.UIConfig.viewDeleteSections && (
        <div
          style={{
            height: "100%",
            marginLeft: 4,
            marginRight: 16,
            fontSize: 12,
          }}
        >
          Toggle view hidden section : <b>OFF</b>
        </div>
      )}
    </div>
  );
};

export default ViewDeletedSectionsToggleButton;
