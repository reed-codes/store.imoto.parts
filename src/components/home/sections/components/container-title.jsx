import React, { useState } from "react";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { TitleEditIcon } from "./tool-box/edit-delete-item-actions";

const ContainerTitle = (props) => {
  const { title, handleTitleChange, handleSaveTitle, DELETED } = props;
  const { sellerConfigs } = useSellerConfig();
  const [editingSectionTitle, setisEditingSectionTitle] = useState(false);

  return (
    <>
      {editingSectionTitle && sellerConfigs.UserInfo.enableEditing ? (
        <form
          style={{ margin: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            setisEditingSectionTitle(false);
          }}
        >
          <input
            type="text"
            className="form-control text-center section-title heading-border ls-20 border-0 p-0 h-auto"
            style={{
              fontWeight: 700,
              color: sellerConfigs.Theme.ColorPalette["Gray-10"],
              background: sellerConfigs.Theme.ColorPalette["Body"],
            }}
            onChange={handleTitleChange}
            value={title}
            autoFocus={true}
            onBlur={() => setisEditingSectionTitle(false)}
            onKeyDown={handleSaveTitle}
          />
        </form>
      ) : (
        <h2
          className="section-title heading-border ls-20 border-0"
          onClick={() => setisEditingSectionTitle(true)}
          style={{
            opacity: DELETED ? 0.7 : 1,
            pointerEvents: DELETED ? "none" : "auto",
            cursor: "auto",
            color: sellerConfigs.Theme.ColorPalette["Gray-10"],
            background: sellerConfigs.Theme.ColorPalette["Body"],
          }}
        >
          {title}
          <TitleEditIcon />
        </h2>
      )}
    </>
  );
};

export default ContainerTitle;
