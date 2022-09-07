import React, { useEffect, useState } from "react";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { getObjectDeepCopy } from "../../../../utils";
import ColumnTitle from "../footer/components/column-title";
import { v4 as uuidv4 } from "uuid";
import EditFooterListModalContent from "./components/column-two/edit-footer-list-modal";
import WidgetOptions from "./components/widget-options";
import AddFooterWidgetButton from "./components/add-footer-widget-button";
import styled from "styled-components";

const AnchorLink = styled.a`
  cursor: pointer;
  &:hover {
    color: ${(props) => props.hoverTextColor} !important;
  }
  &:active {
    color: ${(props) => props.hoverTextColor} !important;
  }
`;

const ColumnTwo = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [column, setColumn] = useState(
    getObjectDeepCopy(sellerConfigs.UIConfig.Footer.columns[1])
  );
  const [openEditColumnListModal, setOpenEditColumnListModal] = useState(false);

  const COLUMN_IS_EMPTY =
    !Boolean(column.title) && !Boolean(column.itemList.length);

  const handleOpenEditColumnListModal = () => setOpenEditColumnListModal(true);
  const handleCloseEditColumnListModal = () =>
    setOpenEditColumnListModal(false);

  const handleTitleChange = (e) => {
    setColumn({
      ...sellerConfigs.UIConfig.Footer.columns[1],
      title: e.target.value,
    });
  };

  useEffect(() => {
    setColumn(sellerConfigs.UIConfig.Footer.columns[1]);
  }, [sellerConfigs.UIConfig.Footer.columns[1]]);

  const commitNewTitle = () => {
    const col = getObjectDeepCopy(column);
    if (sellerConfigs.UIConfig.Footer.columns[1].title === column.title) {
      return;
    } else {
      props.updateColumn(col, 1);
    }
  };

  if (COLUMN_IS_EMPTY) return <></>;

  return (
    <>
      <div className="col-lg-3 col-sm-6">
        <div className="widget">
          <ColumnTitle
            title={column.title}
            handleChange={handleTitleChange}
            commitNewTitle={commitNewTitle}
          />

          <ul className="links" style={{ position: "relative" }}>
            {Boolean(column.itemList.length) ? (
              <>
                {column.itemList.map((item) => {
                  return (
                    <li key={uuidv4()}>
                      <AnchorLink
                        href={item.hyperAncho}
                        hoverTextColor={
                          sellerConfigs.Theme.ColorPalette["Primary"]
                        }
                      >
                        {item.label}
                      </AnchorLink>
                    </li>
                  );
                })}
                <WidgetOptions openEditOption={handleOpenEditColumnListModal} />
              </>
            ) : (
              <ListItemsPlaceholder
                openEditModal={handleOpenEditColumnListModal}
              />
            )}
          </ul>
        </div>
      </div>

      {openEditColumnListModal && (
        <EditFooterListModalContent
          save={props.updateColumn}
          close={handleCloseEditColumnListModal}
        />
      )}
    </>
  );
};

const ListItemsPlaceholder = (props) => {
  return (
    <>
      <ListItemSkeleton width="95%" />
      <ListItemSkeleton width="50%" />
      <ListItemSkeleton width="70%" />
      <ListItemSkeleton width="45%" />
      <ListItemSkeleton width="55%" />
      <ListItemSkeleton width="65%" />
      <AddFooterWidgetButton add={props.openEditModal} float />
    </>
  );
};

const ListItemSkeleton = ({ width }) => {
  return (
    <li style={{ width: "100%", display: "block" }}>
      <span
        style={{
          height: 19,
          background: "#ffffff05",
          marginBottom: 5,
          width: width,
          display: "block",
        }}
      />
    </li>
  );
};

export default ColumnTwo;
