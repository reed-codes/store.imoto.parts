import React from "react";
import ProductEditor from "./product-editor";
import AddBannerModalOptions from "../add-banner-modal-options";
import FancyEditBox from "../fancy-edit-box";
import FancyEditBoxHeader from "../fancy-edit-box-header";

const EditProductSliderModal = (props) => {
  return (
    <FancyEditBox
      autoHeight
      close={props.close}
    >
      <FancyEditBoxHeader
        title="Edit Product"
        close={props.close}
      />

      <ProductEditor
        handleAdd={props.addProduct}
        handleOpenProductEditor={props.handleOpenProductEditor}
        product={props.product}
      />

      <AddBannerModalOptions handleClose={props.close} />
    </FancyEditBox>
  );
};

export default EditProductSliderModal;
