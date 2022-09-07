import React, { useState, useEffect } from "react";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { adjustColorBrightness, getObjectDeepCopy } from "../../../../utils";
import ColumnTitle from "../footer/components/column-title";
import WidgetOptions from "./components/widget-options";
import styled from "styled-components";

const SubmitButton = styled.input`
  cursor: pointer;
  color: ${(props) => props.textColor} !important;
  background: ${(props) => props.bgColor} !important;
  border-color: transparent !important;
  &:hover {
    filter: brightness(90%);
    border-color: ${(props) =>
      adjustColorBrightness(props.bgColor, -25)} !important;
  }
  &:active {
    filter: brightness(80%);
  }
`;

const InputField = styled.input`
  color: ${(props) => props.textColor} !important;
  background: ${(props) => props.bgColor} !important;
  &::placeholder {
    color: ${(props) => props.textColor} !important;
  }
`;

const ColumnFour = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [column, setColumn] = useState(
    sellerConfigs.UIConfig.Footer.columns[3]
  );

  const COLUMN_IS_EMPTY =
    !Boolean(column.title) && !Boolean(column.description);

  useEffect(() => {
    setColumn(sellerConfigs.UIConfig.Footer.columns[3]);
  }, [sellerConfigs.UIConfig.Footer.columns[3]]);

  const handleTitleChange = (e) => {
    setColumn({
      ...sellerConfigs.UIConfig.Footer.columns[3],
      title: e.target.value,
    });
  };

  const handleDescriptionChange = (e) => {
    setColumn({
      ...sellerConfigs.UIConfig.Footer.columns[3],
      description: e.target.value,
    });
  };

  const commitNewTitle = () => {
    const col = getObjectDeepCopy(column);
    if (sellerConfigs.UIConfig.Footer.columns[3].title === column.title) {
      return;
    } else {
      props.updateColumn(col, 3);
    }
  };

  const commitNewDescription = () => {
    const col = getObjectDeepCopy(column);
    if (
      sellerConfigs.UIConfig.Footer.columns[3].description ===
      column.description
    ) {
      return;
    } else {
      props.updateColumn(col, 3);
    }
  };

  if (COLUMN_IS_EMPTY) return <></>;

  return (
    <div className="col-lg-3 col-sm-6">
      <div className="widget widget-newsletter">
        <ColumnTitle
          title={column.title}
          handleChange={handleTitleChange}
          commitNewTitle={commitNewTitle}
        />

        {column.description ? (
          <ColumnDescription
            description={column.description}
            handleChange={handleDescriptionChange}
            commitNewDescription={commitNewDescription}
          />
        ) : (
          <DescriptionSkeleton />
        )}

        <form action="#" className="mb-0">
          <InputField
            type="email"
            className="form-control m-b-3"
            placeholder="Email address"
            required
            bgColor={sellerConfigs.Theme.ColorPalette["Gray-20"]}
            textColor={sellerConfigs.Theme.ColorPalette["Gray-40"]}
          />

          <SubmitButton
            type="submit"
            className="btn btn-primary shadow-none"
            value="Subscribe"
            bgColor={sellerConfigs.Theme.ColorPalette["Primary"]}
            textColor={sellerConfigs.Theme.ColorPalette["White"]}
          />
        </form>
      </div>
      <WidgetOptions />
    </div>
  );
};

const ColumnDescription = (props) => {
  const [enableDescriptionEditing, setEnableDescriptionEditing] =
    useState(false);
  const handleEnableDescriptionEditing = () =>
    setEnableDescriptionEditing(true);
  const handleDisableDescriptionEditing = () => {
    props.commitNewDescription();
    setEnableDescriptionEditing(false);
  };

  return (
    <>
      {enableDescriptionEditing ? (
        <form
          style={{ margin: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleDisableDescriptionEditing();
          }}
        >
          <textarea
            type="text"
            className="form-control p-0 rounded-0"
            style={{
              background: "transparent",
              marginBottom: "1.3rem",
              lineHeight: "1.846",
            }}
            onChange={props.handleChange}
            value={props.description}
            autoFocus={true}
            onBlur={handleDisableDescriptionEditing}
          />
        </form>
      ) : (
        <p
          style={{ position: "relative", cursor: "pointer" }}
          onClick={handleEnableDescriptionEditing}
        >
          {props.description}
          <span
            style={{
              height: 27,
              width: 27,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              margin: "auto",
              position: "absolute",
              right: 0,
              bottom: 0,
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
          </span>
        </p>
      )}
    </>
  );
};

const DescriptionSkeleton = () => {
  return (
    <div
      style={{
        height: 70,
        width: "100%",
        background: "#27292d",
        marginBottom: 13,
      }}
    />
  );
};

export default ColumnFour;
