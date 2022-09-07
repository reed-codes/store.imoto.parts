import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import ProductColumn from "./product-column";

const EditProductColumnModal = (props) => {
  return (
    <FancyEditBox close={props.close} autoHeight>
      <FancyEditBoxHeader title="" close={props.close} />
      <ProductColumn {...props} />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default EditProductColumnModal;
