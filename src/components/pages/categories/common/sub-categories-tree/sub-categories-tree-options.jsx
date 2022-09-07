import React, { useEffect, useContext, useState } from "react";
import SuperTreeview from "react-super-treeview";
import "./styles.css";
import { PricelistContext } from "../../../../../store/PricelistContext";
import { filterCategories } from "../../../../../action";

const SubCategories = () => {
  const { pricelistState, pricelistDispach } = useContext(PricelistContext);
  const [tree, setTree] = useState(
    pricelistState.filter.structuredCategories
      ? pricelistState.filter.structuredCategories
      : []
  );

  useEffect(() => {
    setTree(
      pricelistState.filter.structuredCategories
        ? pricelistState.filter.structuredCategories
        : []
    );
  }, [pricelistState.filter.structuredCategories]);

  return (
    // RENDER THE COMPONENT
    <SuperTreeview
      noChildrenAvailableMessage={""}
      keywordKey={"CategoryID"}
      keywordLabel={"Name"}
      isDeletable={() => false}
      isCheckable={() => false}
      data={tree}
      onExpandToggleCb={(category) => {
        pricelistDispach(filterCategories(category.CategoryID));
      }}
      onUpdateCb={(updatedData) => {
        setTree(updatedData);
      }}
      transitionEnterTimeout={500}
    />
  );
};

export default SubCategories;
