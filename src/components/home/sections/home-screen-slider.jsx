import React, { useState } from "react";
import Carousel from "../../features/carousel";
import { owlSetting4 } from "../../../utils/settings";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import ToolBox from "./components/tool-box/tool-box";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import AddCarouselSlideModal from "./components/home-screen-slider/add-carousel-slide-modal";
import EditCarouselSlidesModal from "./components/home-screen-slider/edit-carousel-slides-modal";
import { updateComponent } from "../../../action";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../../utils";

const HomeScreenSlider = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [openSlidesEditor, setOpenSlidesEditor] = useState(false);
  const [openSlideAdder, setOpenSlideAdder] = useState(false);
  const orderdSlides = sellerConfigs.UIConfig
    ? sellerConfigs.UIConfig.HomeScreenSlider.slides.sort(
        (a, b) => Number(a.order) - Number(b.order)
      )
    : [];

  const IS_DELETED = sellerConfigs.UIConfig.HomeScreenSlider.deleted;

  const handleOpenSlidesEditor = () => setOpenSlidesEditor(true);
  const handleCloseSlidesEditor = () => setOpenSlidesEditor(false);
  const handleOpenSlideAdder = () => {
    handleCloseSlidesEditor();
    setOpenSlideAdder(true);
  };
  const handleCloseSlideAdder = () => setOpenSlideAdder(false);

  const toggleDeletedStatus = async () => {
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        HomeScreenSlider: {
          ...updatedSellerConfig.UIConfig.HomeScreenSlider,
          deleted: !IS_DELETED,
        },
      },
    };
    sellerConfigDispatch(
      updateComponent({
        data: {
          ...updatedSellerConfig.UIConfig.HomeScreenSlider,
          deleted: !IS_DELETED,
        },
        component: "HomeScreenSlider",
      })
    );

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );
  };

  return (
    <div
      style={{
        position: "relative",
        transform: "translate(0,0)",
        border: IS_DELETED
          ? `1px #dc3545 solid`
          : `1px ${sellerConfigs.Theme.ColorPalette["Body"]} solid`,
        padding: 0,
      }}
      className={
        sellerConfigs.UserInfo.enableEditing
          ? `edit-box ${IS_DELETED ? "deleted-edit-box" : "primary-edit-box"}`
          : sellerConfigs.Theme.IsContained
          ? "container"
          : ""
      }
    >
      <EditBoxStrip isDeleted={IS_DELETED} />

      {IS_DELETED ? (
        <RestorationAfterDeleteToolBox restore={toggleDeletedStatus} />
      ) : (
        <ToolBox
          handleEdit={orderdSlides.length ? handleOpenSlidesEditor : null}
          handleAdd={handleOpenSlideAdder}
          handleDeleteComponent={toggleDeletedStatus}
        />
      )}

      <div
        style={{
          width: "100%",
          minHeight: 345,
          opacity: IS_DELETED ? 0.7 : 1,
          pointerEvents: IS_DELETED ? "none" : "auto",
          position: "relative",
        }}
      >
        {orderdSlides.length ? (
          <Carousel
            addClass="home-slider owl-carousel owl-theme owl-carousel-lazy show-nav-hover nav-big mb-0 text-uppercase"
            settings={owlSetting4}
          >
            {orderdSlides.map((slide) => {
              if (slide.hyperlink) {
                return (
                  <div className="home-slide home-slide1 banner" key={uuidv4()}>
                    <Link to={slide.hyperlink}>
                      <img
                        className="owl-lazy slide-bg"
                        src={`${process.env.PUBLIC_URL}/assets/images/demo/lazy.png`}
                        data-src={slide.img}
                        alt="slider"
                        style={{
                          minHeight: 345,
                        }}
                      />
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div className="home-slide home-slide1 banner" key={uuidv4()}>
                    <img
                      className="owl-lazy slide-bg"
                      src={`${process.env.PUBLIC_URL}/assets/images/demo/lazy.png`}
                      data-src={slide.img}
                      alt="slider"
                      style={{
                        minHeight: 345,
                      }}
                    />
                  </div>
                );
              }
            })}
          </Carousel>
        ) : (
          <div
            style={{
              minHeight: 345,
              height: "100%",
              width: "100%",
              background: "#f4f4f4",
              border: "1px #90999d29 solid",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <button
              className="btn btn-outline-secondary"
              style={{
                padding: 0,
                height: 50,
                width: 50,
              }}
              title="Click to add a new banner image to carousel"
              onClick={handleOpenSlideAdder}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </button>

            <h6
              style={{
                marginTop: 10,
              }}
            >
              Click to add a new banner image to carousel
            </h6>
          </div>
        )}
      </div>

      {openSlidesEditor && (
        <EditCarouselSlidesModal
          close={handleCloseSlidesEditor}
          addNewSlide={handleOpenSlideAdder}
        />
      )}

      {openSlideAdder && (
        <AddCarouselSlideModal close={handleCloseSlideAdder} />
      )}
    </div>
  );
};

export default HomeScreenSlider;
