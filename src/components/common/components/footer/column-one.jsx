import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ColumnTitle from "../footer/components/column-title";
import WidgetOptions from "../footer/components/widget-options";
import EditFooterListModal from "../footer/components/column-one/edit-footer-list-modal";
import EditFooterSocialMediaOptionsListModal from "../footer/components/column-one/edit-footer-social-media-modal";
import { getObjectDeepCopy } from "../../../../utils";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { v4 as uuidv4 } from "uuid";
import AddFooterWidgetButton from "./components/add-footer-widget-button";
import styled from "styled-components";

const AnchorIconButton = styled.a`
  cursor: pointer;
  border: 1px transparent solid !important;
  &:hover {
    background: ${(props) => props.hoverBgColor} !important
  }
`;

const ColumnOne = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [column, setColumn] = useState(
    getObjectDeepCopy(sellerConfigs.UIConfig.Footer.columns[0])
  );
  const [openEditColumnListModal, setOpenEditColumnListModal] = useState(false);
  const [
    openEditSocialMediaListModal,
    setOpenEditSocialMediaListModal,
  ] = useState(false);

  const COLUMN_IS_EMPTY =
    !Boolean(column.title) &&
    !Boolean(column.itemList.length) &&
    !Boolean(column.socialMediaOptions.length);

  const handleOpenEditColumnListModal = () => setOpenEditColumnListModal(true);
  const handleCloseEditColumnListModal = () =>
    setOpenEditColumnListModal(false);

  const handleOpenEditSocialMediaListModal = () =>
    setOpenEditSocialMediaListModal(true);
  const handleCloseEditSocialMediaListModal = () =>
    setOpenEditSocialMediaListModal(false);

  const handleTitleChange = (e) => {
    setColumn({
      ...sellerConfigs.UIConfig.Footer.columns[0],
      title: e.target.value,
    });
  };

  useEffect(() => {
    setColumn(sellerConfigs.UIConfig.Footer.columns[0]);
  }, [sellerConfigs.UIConfig.Footer.columns[0]]);

  const commitNewTitle = () => {
    const col = getObjectDeepCopy(column);
    if (sellerConfigs.UIConfig.Footer.columns[0].title === column.title) {
      return;
    } else {
      props.updateColumn(col, 0);
    }
  };

  if (COLUMN_IS_EMPTY) return <></>;

  return (
    <>
      <div className="col-lg-3 col-sm-6">
        <div className="widget mb-0">
          <ColumnTitle
            title={column.title}
            handleChange={handleTitleChange}
            commitNewTitle={commitNewTitle}
          />
          <ul
            className="contact-info"
            style={{
              position: "relative",
              paddingBottom: 5,
              marginBottom: 0,
            }}
          >
            {Boolean(column.itemList.length) ? (
              <>
                {column.itemList.map((item) => {
                  return (
                    <li key={uuidv4()}>
                      <span
                        className="contact-info-label"
                        style={{
                          color: sellerConfigs.Theme.ColorPalette["Gray-60"],
                        }}
                      >
                        {item.label}
                      </span>
                      {item.value}
                    </li>
                  );
                })}
                <WidgetOptions openEditOption={handleOpenEditColumnListModal} />
              </>
            ) : (
              <ListItemsPlaceholder />
            )}
          </ul>

          {sellerConfigs.UserInfo.enableEditing ||
          Boolean(column.socialMediaOptions.length) ? (
            <div style={{ width: "100%" }}>
              <div className="social-icons">
                {Boolean(column.socialMediaOptions.length) ? (
                  column.socialMediaOptions.map((option, i) => {
                    return (
                      <AnchorIconButton
                        className="social-icon"
                        href={option.hyperlink}
                        target="_blank"
                        title={option.name}
                        key={i}
                        hoverBgColor={"red"}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: option.icon }}
                          className="footer-social-icon-wrapper-item"
                        />
                      </AnchorIconButton>
                    );
                  })
                ) : (
                  <SocialMediaOptionsPlaceholder />
                )}
              </div>

              <WidgetOptions
                openEditOption={handleOpenEditSocialMediaListModal}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {openEditColumnListModal && (
        <EditFooterListModal
          save={props.updateColumn}
          close={handleCloseEditColumnListModal}
        />
      )}

      {openEditSocialMediaListModal && (
        <EditFooterSocialMediaOptionsListModal
          save={props.updateColumn}
          close={handleCloseEditSocialMediaListModal}
        />
      )}
    </>
  );
};

const ListItemsPlaceholder = () => {
  return (
    <>
      <ListItemSkeleton />
      <ListItemSkeleton />
      <AddFooterWidgetButton float />
    </>
  );
};

const ListItemSkeleton = () => {
  return (
    <li style={{ marginBottom: 10 }}>
      <span
        className="contact-info-label"
        style={{
          height: 19,
          background: "#ffffff0f",
          marginBottom: 5,
          width: "95%",
          border: "1px solid #313438",
        }}
      />
      <div style={{ height: 35, background: "#ffffff05", width: "65%" }} />
    </li>
  );
};

const SocialMediaOptionsPlaceholder = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <SocialMediaOptionSkeleton />
      <SocialMediaOptionSkeleton />
      <SocialMediaOptionSkeleton />
      <SocialMediaOptionSkeleton />
      <AddFooterWidgetButton float />
    </div>
  );
};

const SocialMediaOptionSkeleton = () => {
  return (
    <a
      style={{
        minHeight: 36,
        minWidth: 36,
        background: "#27292d",
        borderRadius: "50%",
        cursor: "default",
        margin: "0 16px 0 0 !important",
      }}
      className="social-icon"
    />
  );
};

export default ColumnOne;
