import React from "react";
import NewProductAdder from "./new-product-adder";
import AddBannerModalOptions from "../add-banner-modal-options";
import FancyEditBox from "../fancy-edit-box";
import FancyEditBoxHeader from "../fancy-edit-box-header";

const NewProductSliderModal = (props) => {
  return (
    <FancyEditBox
      autoHeight
      close={props.close}
    >
      <FancyEditBoxHeader
        title="Add Product"
        close={props.close}
      />

      <NewProductAdder addProduct={props.addProduct} />

      <AddBannerModalOptions />
    </FancyEditBox>
  );
};

export default NewProductSliderModal;
