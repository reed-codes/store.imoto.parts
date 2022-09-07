import React, { useEffect, useState } from "react";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import AddFooterWidgetButton from "./components/add-footer-widget-button";

const CopyRightGrid = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [copyrightText, setCopyrightText] = useState(props.copyrightText);
  const [enableTextEditing, setEnableTextEditing] = useState(false);

  const COMPONENT_IS_EMPTY = !Boolean(copyrightText.length);

  const handleEnableTextEditing = () => setEnableTextEditing(true);
  const handleDisableTextEditing = () => {
    if (copyrightText !== props.copyrightText) {
      props.updateCopyRightText(copyrightText);
    }
    setEnableTextEditing(false);
  };

  useEffect(() => {
    if (enableTextEditing) {
      const copy_right_input_field = document.querySelector(
        "#copy-right-input-field"
      );
      if (copy_right_input_field)
        copy_right_input_field.style.width =
          (copyrightText.length + 1) * 8 + "px";
    }
  }, [enableTextEditing]);

  const handleChange = (e) => {
    const _this = e.target;
    _this.style.width = (_this.value.length + 1) * 8 + "px";
    setCopyrightText(_this.value);
  };

  if (COMPONENT_IS_EMPTY) return <></>;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", color: "yellow" }}>
        {enableTextEditing ? (
          <>
            <p className="footer-copyright py-3 pr-1 mb-0">&copy;</p>
            <form
              style={{ margin: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleDisableTextEditing();
              }}
            >
              <input
                id="copy-right-input-field"
                className="form-control footer-copyright py-3 p-0 pr-4 mb-0 border-0"
                onChange={handleChange}
                value={copyrightText}
                autoFocus={true}
                onBlur={handleDisableTextEditing}
                style={{
                  background: "transparent",
                  border: "none !important",
                  minWidth: 300,
                  color: sellerConfigs.Theme.ColorPalette["Gray-40"],
                  background: "transparent",
                }}
              />
            </form>
          </>
        ) : copyrightText ? (
          <>
            <p
              className="footer-copyright py-3 pr-1 mb-0"
              style={{
                color: sellerConfigs.Theme.ColorPalette["Gray-40"],
              }}
            >
              &copy;
            </p>
            <p
              className="footer-copyright py-3 pr-4 mb-0"
              onClick={handleEnableTextEditing}
              style={{
                position: "relative",
                color: sellerConfigs.Theme.ColorPalette["Gray-40"],
                background: "transparent",
              }}
            >
              {copyrightText}
              <span
                style={{
                  height: 27,
                  width: 27,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 3,
                  position: "absolute",
                  right: -20,
                  top: 10,
                }}
                className={"appear-on-hover-item-action-container"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                </svg>
              </span>
            </p>
          </>
        ) : (
          <div
            style={{
              height: 44,
              width: 220,
              background: "#27292d",
              border: "1px solid #313438",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              position: "relative",
            }}
          >
            <AddFooterWidgetButton add={handleEnableTextEditing} />
          </div>
        )}
      </div>
    </>
  );
};

export default CopyRightGrid;
