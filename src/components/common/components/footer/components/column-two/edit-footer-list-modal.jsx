import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import EditFooterListModalContent from "./edit-footer-list-modal-content";

const EditCarouselSlidesModal = (props) => {
  return (
    <FancyEditBox close={props.close} autoHeight={false}>
      <FancyEditBoxHeader title="" close={props.close} />
      <EditFooterListModalContent close={props.close} save={props.save} />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default EditCarouselSlidesModal;
