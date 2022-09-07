import React from "react";
import AddBannerModalOptions from "../add-banner-modal-options";
import FancyEditBox from "../fancy-edit-box";
import FancyEditBoxHeader from "../fancy-edit-box-header";
import ProductEditor from "./product-editor";

const FeaturedProductSliderModal = (props) => {
  return (
    <FancyEditBox
      autoHeight
      handleClose={props.handleCloseProductEditor}
      deleteConfirmationRequired={{ state: false }}
    >
      <FancyEditBoxHeader
        title="Edit Product"
        handleClose={props.handleCloseProductEditor}
        deleteConfirmationRequired={{ state: false }}
      />

      <ProductEditor
        slides={props.UIConfig.FeaturedProductsSlider.products}
        handleAdd={props.handleAddProduct}
        handleOpenProductEditor={props.handleOpenProductEditor}
        product={props.product}
      />

      <AddBannerModalOptions handleClose={props.handleCloseProductEditor} />
    </FancyEditBox>
  );
};

export default FeaturedProductSliderModal;
