import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import PaymentOptions from './payment-options'

const EditPaymentOptionaModal = (props) => {
  return (
    <FancyEditBox
      close={props.close}
      autoHeight={false}
    >
      <FancyEditBoxHeader
        close={props.close}
      />
      <PaymentOptions addNewItem = {props.addNewItem}
                      close = {props.close}
                      />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default EditPaymentOptionaModal;
