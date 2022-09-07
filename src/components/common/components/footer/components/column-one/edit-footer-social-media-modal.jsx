import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import EditFooterSocialMediaModalContent from "./edit-footer-social-media-modal-content";

const EditFooterSocialMediaModal = (props) => {
  return (
    <FancyEditBox close={props.close} autoHeight={false}>
      <FancyEditBoxHeader title="" close={props.close} />
      <EditFooterSocialMediaModalContent
        close={props.close}
        save={props.save}
      />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default EditFooterSocialMediaModal;
