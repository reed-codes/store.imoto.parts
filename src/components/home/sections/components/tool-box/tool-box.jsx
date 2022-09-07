import React from "react";
import ReactTooltip from "react-tooltip";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";

const ToolBox = (props) => {
  const { sellerConfigs } = useSellerConfig();

  if (!sellerConfigs.UserInfo.enableEditing) return <></>;

  return (
    <>
      <div
        style={{
          height: 40,
          position: "absolute",
          zIndex: 1000,
          top: -40,
          right: 20,
          display: "flex",
          background: "rgb(8 136 203)",
          borderRadius: "13px 13px 0px 0px",
          overflow: "hidden",
        }}
        className="shadow-lg tool-box"
      >
        {props.handleAdd && (
          <div
            style={{
              width: 42,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "13px 0px 0px 0px",
              border: "1px #056da059 solid",
              cursor: props.addDisabled
                ? "not-allowed !important"
                : "pointer !important",
              opacity: props.addDisabled ? 0.7 : 1,
            }}
            className="tool-box-option"
            data-tip
            data-for="add-tool-box-option"
            onClick={() => !props.addDisabled && props.handleAdd()}
          >
            {props.addDisabled ? (
              <ReactTooltip
                place="top"
                id="add-tool-box-option"
                effect="solid"
                type="info"
              >
                {"Maximum amount of columns reached."}
              </ReactTooltip>
            ) : (
              <ReactTooltip
                place="top"
                id="add-tool-box-option"
                effect="solid"
                type="info"
              >
                {props.addTooltip
                  ? props.addTooltip
                  : "Click to add new banner image"}
              </ReactTooltip>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="#fff"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </div>
        )}

        {props.handleEdit && (
          <div
            style={{
              width: 42,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px #056da059 solid",
              opacity: 1,
              cursor: "pointer",
            }}
            className="tool-box-option"
            onClick={props.handleEdit}
            data-tip
            data-for="edit-tool-box-option"
          >
            <ReactTooltip
              place="top"
              id="edit-tool-box-option"
              effect="solid"
              type="info"
            >
              {props.editTooltip ? props.editTooltip : "Edit section"}
            </ReactTooltip>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#fff"
              className="bi bi-pencil-fill"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </div>
        )}

        <div
          style={{
            width: 42,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(220, 53, 69)",
            border: "1px #dc35455e solid",
            borderRadius: "0px 13px 0px 0px",
          }}
          className="tool-box-option tool-box-delete-option"
          onClick={props.handleDeleteComponent}
          data-tip
          data-for="hide-tool-box-option"
        >
          <ReactTooltip
            place="top"
            id="hide-tool-box-option"
            effect="solid"
            type="error"
          >
            {props.hideTooltip ? props.hideTooltip : "Hide"}
          </ReactTooltip>

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
        </div>
      </div>
    </>
  );
};

export default ToolBox;
