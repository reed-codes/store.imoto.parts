import React, { useState } from "react";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import AddFooterWidgetButton from "./add-footer-widget-button";

const ColumnTitle = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [enableTitleEditing, setEnableTitleEditing] = useState(false);
  const handleEnableTitleEditing = () => setEnableTitleEditing(true);
  const handleDisableTitleEditing = () => {
    props.commitNewTitle();
    setEnableTitleEditing(false);
  };

  return (
    <>
      {enableTitleEditing ? (
        <form
          style={{
            margin: "0 0 17px 0 !important",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleDisableTitleEditing();
          }}
        >
          <input
            type="text"
            className="form-control widget-title p-0 border-0 footer-column-title footer-column-title-input-field"
            style={{
              color: sellerConfigs.Theme.ColorPalette["White"],
              background: "transparent",
              fontFamily: "Poppins,sans-serif !important",
              fonrWeight: "700 !important",
              height: 30,
            }}
            onChange={props.handleChange}
            value={props.title}
            autoFocus={true}
            onBlur={handleDisableTitleEditing}
          />
        </form>
      ) : (
        <>
          {Boolean(props.title) ? (
            <h4
              className="widget-title"
              onClick={handleEnableTitleEditing}
              style={{
                display: "flex",
                cursor: "pointer",
                minHeight: 30,
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Poppins,sans-serif !important",
                  color: sellerConfigs.Theme.ColorPalette["White"],
                }}
              >
                {props.title}
                <div
                  style={{
                    height: 27,
                    width: 27,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    marginLeft: 3,
                    position: "absolute",
                    right: -30,
                  }}
                  className={"appear-on-hover-item-action-container"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="rgb(8, 136, 203)"
                    className="bi bi-pencil-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                  </svg>
                </div>
              </span>
            </h4>
          ) : (
            <h4
              style={{
                height: 30,
                minHeight: 30,
                width: "100%",
                background: "#333538",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              placeholder="Column title"
            >
              <AddFooterWidgetButton add={handleEnableTitleEditing} />
            </h4>
          )}
        </>
      )}
    </>
  );
};

export default ColumnTitle;
