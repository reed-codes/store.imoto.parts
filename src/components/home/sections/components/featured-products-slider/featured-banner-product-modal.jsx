import React from "react";
import AddBannerModalOptions from "../add-banner-modal-options";
import FancyEditBox from "../fancy-edit-box";
import FancyEditBoxHeader from "../fancy-edit-box-header";
import NewProductAdder from "./featured-product-adder";

const FeaturedProductSliderModal = (props) => {
  return (
    <FancyEditBox
      autoHeight
      handleClose={props.handleCloseProductAdder}
      deleteConfirmationRequired={{ state: false }}
    >
      <FancyEditBoxHeader
        title="Add Product"
        handleClose={props.handleCloseProductAdder}
        deleteConfirmationRequired={{ state: false }}
      />

      <NewProductAdder handleAdd={props.handleAddProduct} />

      <AddBannerModalOptions handleClose={props.handleCloseProductAdder} />
    </FancyEditBox>
  );
};

export default FeaturedProductSliderModal;
