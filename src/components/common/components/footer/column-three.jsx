import React, { useState, useEffect } from "react";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { getObjectDeepCopy } from "../../../../utils";
import ColumnTitle from "../footer/components/column-title";
import EditFooterListModalContent from "./components/column-three/edit-footer-list-modal";
import WidgetOptions from "./components/widget-options";
import AddFooterWidgetButton from "./components/add-footer-widget-button";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const AnchorLink = styled.a`
  cursor: pointer;
  border: 1px transparent solid !important;
  &:hover {
    color: ${(props) => props.hoverTextColor} !important;
    border: 1px ${(props) => (props.hoverTextColor)} solid !important;
  }
  &:active {
    color: ${(props) => props.hoverTextColor} !important;
  }
`;

const ColumnThree = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [column, setColumn] = useState(
    sellerConfigs.UIConfig.Footer.columns[2]
  );
  const [openEditColumnListModal, setOpenEditColumnListModal] = useState(false);

  const tags = column.commaSeparateditemList
    .split(",")
    .filter((item) => Boolean(item.length) && item !== "\n");

  const COLUMN_IS_EMPTY =
    !Boolean(column.title) && !Boolean(column.itemList.length);

  const handleOpenEditColumnListModal = () => setOpenEditColumnListModal(true);
  const handleCloseEditColumnListModal = () =>
    setOpenEditColumnListModal(false);

  const handleTitleChange = (e) => {
    setColumn({
      ...sellerConfigs.UIConfig.Footer.columns[2],
      title: e.target.value,
    });
  };

  useEffect(() => {
    setColumn(sellerConfigs.UIConfig.Footer.columns[2]);
  }, [sellerConfigs.UIConfig.Footer.columns[2]]);

  const commitNewTitle = () => {
    const col = getObjectDeepCopy(column);
    if (sellerConfigs.UIConfig.Footer.columns[2].title === column.title) {
      return;
    } else {
      props.updateColumn(col, 2);
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
          <div className="tagcloud" style={{ position: "relative" }}>
            {Boolean(tags.length) ? (
              <>
                {tags.map((tag) => {
                  return (
                    <AnchorLink
                      key={uuidv4()}
                      onClick={(e) => e.preventDefault()}
                      className="border-0"
                      href={"#"}
                      hoverTextColor={"red"}
                    >
                      {tag}
                    </AnchorLink>
                  );
                })}
                <WidgetOptions openEditOption={handleOpenEditColumnListModal} />
              </>
            ) : (
              <TagsSkeletonPlaceholder
                openEditModal={handleOpenEditColumnListModal}
              />
            )}
          </div>
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

const TagsSkeletonPlaceholder = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const str =
    "bag,pants,blue,sweater,winter,shorts,cosplay,pants,bag,pants,blue,sweater,winter,shorts,cosplay,pants";
  return (
    <>
      {str.split(",").map((item) => {
        return (
          <>
            <AnchorLink
              onClick={(e) => e.preventDefault()}
              key={uuidv4()}
              className="border-0"
              href={"#"}
              hoverTextColor={sellerConfigs.Theme.ColorPalette["White"]}
            >
              <span style={{ visibility: "hidden" }}>{item}</span>
            </AnchorLink>

            <AddFooterWidgetButton add={props.openEditModal} float />
          </>
        );
      })}
    </>
  );
};

export default ColumnThree;
