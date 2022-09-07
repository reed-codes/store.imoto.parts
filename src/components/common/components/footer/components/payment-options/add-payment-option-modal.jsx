import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import PaymentOption from "./payment-option";

const AddPaymentOptionModal = (props) => {
  return (
    <FancyEditBox close={props.close} autoHeight={false}>
      <FancyEditBoxHeader title="Add Payment option" close={props.close} />
      <PaymentOption close={props.close} />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default AddPaymentOptionModal;
