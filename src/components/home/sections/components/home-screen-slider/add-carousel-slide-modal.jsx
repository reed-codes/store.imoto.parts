import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import CarouselSlide from "./carousel-slide";

const AddCarouselSlideModal = (props) => {
  return (
    <FancyEditBox close={props.close} autoHeight={false}>
      <FancyEditBoxHeader title="" close={props.close} />
      <CarouselSlide close={props.close} />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default AddCarouselSlideModal;
