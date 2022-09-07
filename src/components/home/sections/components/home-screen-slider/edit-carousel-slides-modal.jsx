import React from "react";
import ModalOptionsPanel from "./components/modal-options-panel";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import CarouselSlides from "./carousel-slides";

const EditCarouselSlidesModal = (props) => {
  return (
    <FancyEditBox
      close={props.close}
      autoHeight={false}
    >
      <FancyEditBoxHeader
        title=""
        close={props.close}
      />
      <CarouselSlides addNewSlide = {props.addNewSlide}
                      close = {props.close}
                      />
      <ModalOptionsPanel />
    </FancyEditBox>
  );
};

export default EditCarouselSlidesModal;
