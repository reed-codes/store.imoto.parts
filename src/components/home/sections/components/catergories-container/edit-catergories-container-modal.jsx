import React, { useState, useEffect } from "react";

import { useDropzone } from "react-dropzone";
import { ImpulseSpinner } from "react-spinners-kit";
import { PREDEFINED_TYPES } from "../../../../../utils/icons";

import CarouselSlidesDndListOrderController from "../brands-carousel/carousel-slides-dnd-list-order-controller"
import Pagination from "../brands-carousel/pagination";

import ModalActions from "../modal-actions";

const INIT_SLIDE = {
  id: "",
  order: 0,
  image: "",
  hyperlink: "",
};

const EditCatergoriesContainerModal = (props) => {
  const {
    brands,
    files,
    setFiles,
    index,
    setIndex,
    close,
    slide,
    setSlide,
    handleEditBrand,
    handleSetReorderedSlides,
    handleItemContentChange
  } = props;
  
  const [imageIsLoading, setImageIsLoading] = useState(true);
 
  const handleNext = () => {
    if (index){
      setIndex(index + 1);
    } else {
      setIndex(0)
    };
  };

  const handlePrev = () => {
    if (index === 0) {
      setIndex(index - 1);
    } else {
      setIndex(brands.length - 1);
    }
  };

  const handleChangeSlideIndex = (e) => {
    setIndex(Number(e.currentTarget.id));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/webp",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    if (brands.length)
      setSlide(
        brands[index]
      );
    else {
      setSlide(INIT_SLIDE);
    }
    setFiles([]);
    setImageIsLoading(true)
  }, [index]);

  useEffect(() => {
    //Finding the new position of the current slide - this is after user has re-ordered the slides
    const newPos = brands.findIndex((slde) => slde.id === slide.id);
    if (newPos + 1 !== slide.order) {
      setSlide({
        ...slide,
        order: newPos + 1,
      });
    }
  }, [brands]);

  useEffect(() => {
    if (files[0]) {
      /*
      Ensuring that if a user updates a slide's image we update the image shown for this particular slide 
      in the section that we use to let users control the slides order
      This is accomplished by updating the img property of the particular slide within the array of slides that the ordering component uses to render out slides 
      */
      const newOrderedSlides = brands.map((slde) => {
        if (slde.id === slide.id) {
          return {
            ...slde,
            image: files[0].preview,
          };
        } else return slde;
      });
      handleSetReorderedSlides(newOrderedSlides);
    } else {
      const newOrderedSlides = brands.map((slde) => {
        if (slde.id === slide.id) {
          return {
            ...slde,
            image: slide.image,
          };
        } else return slde;
      });
      handleSetReorderedSlides(newOrderedSlides);
    }

    return () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <>
      <div
        id="progress-line"
        style={{
          width: `100%%`,
        }}
      />
        <Pagination
          slides={brands}
          index={index}
          IS_FIRST_SLIDE={0 === index}
          IS_LAST_SLIDE={index === brands.length - 1}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleChangeSlide={handleChangeSlideIndex}
        />
      <div
        style={{
          width: "100%",
          marginBottom: "5px",
        }}
      >
        <div
          style={{
            background: "#fff",
            position: "relative",
            cursor: "pointer",
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          <div
            {...getRootProps({
              className: "dropzone",
            })}
            style={{
              minHeight: "170px",
              maxHeight: "170px",
              width: "100%",
              userSelect: "none",
              objectFit: "contain",
              background: "#43494e",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -20,
                right: 0,
                zIndex: 5,
                padding: 0,
                fontSize: "1rem",
                background: "#fff",
              }}
            >
              Recommended dimensions - 140 by 60 pixels
            </div>

            <button
              className="btn btn-primary btn-sm mr-2 shadow-lg rounded-full"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "#fff",
                height: "40px",
                width: "40px",
                padding: 0,
                border: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                zIndex: 5,
                opacity: 0.7,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#08C"
                className="bi bi-pencil-fill"
                viewBox="0 0 16 16"
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
            </button>

            {slide.image || files[0] ? (
              <>
                <img
                  style={{
                    height: "100%",
                    minHeight: "170px",
                    maxHeight: "170px",
                    width: "100%",
                    userSelect: "none",
                    pointerEvents: "none",
                    objectFit: "contain",
                    backgroundColor: "#f6f7f9"
                  }}
                  src={files[0] ? files[0].preview : slide.image}
                  alt={"Slide"}
                  className="shadow-sm animate__animated animate__fadeIn hover-dark"
                  onLoad={() => setImageIsLoading(false)}
                />
                {imageIsLoading && (
                  <div>
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        background: "rgb(244, 244, 244)",
                        top: 0,
                        left: 0,
                        left: 0,
                        position: "absolute",
                        zIndex: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid rgba(144, 153, 157, 0.16)",
                        cursor: "default",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ImpulseSpinner size={30} frontColor="#fff" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  maxHeight: "100%",
                  height: "100%",
                  width: "100%",
                  userSelect: "none",
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
                title="click to select slide image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fff"
                  className="bi bi-image-alt"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5l-4.777-3.947z" />
                </svg>
                <br />

                <h6 style={{ color: "#fff" }}>
                  Click here or 'drag n drop' image file to upload
                </h6>
                <small style={{ fontSize: 10, opacity: 0.7 }}>
                  format : jpg, png or webp
                </small>
              </div>
            )}

            <input
              style={{ height: "100%", width: "100%" }}
              {...getInputProps()}
            />
          </div>
        </div>
        <div
          className="mt-1"
          style={{
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          <div style={{ marginTop: 25, width: "100%"}}>
            <select
              name="type"
              value={slide.type}
              onChange={(e) => handleItemContentChange(e)}
              className="form-control form-control-sm"
            >
              <option value="">Select item type...</option>
              {PREDEFINED_TYPES.map((type, index) =>
                <option key={index} value={type}>
                  {type}
                </option>
              )}
            </select>
          </div>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Type item name..."
            name="name"
            onChange={(e) => handleItemContentChange(e)}
            value={slide.name}
          />
          <div
            className="alert alert-primary d-flex align-items-center"
            role="alert"
            style={{
              marginTop: 15,
              marginBottom: "1rem",
              minHeight: "59px",
              fontSize: "1.2rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-info-circle-fill"
              viewBox="0 0 16 16"
              style={{ marginRight: 10 }}
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            <div>
              Reoder the brands in the brands container by dragging and droping.
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            padding: "1rem 0",
            paddingTop: "3px",
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          <h6
            style={{
              marginBottom: 4,
              cursor: "default",
            }}
          >
            Order
          </h6>
          <CarouselSlidesDndListOrderController
            slides={brands}
            currentSlide={brands[index]}
            reorder={handleSetReorderedSlides}
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "1rem 0",
            paddingTop: "3px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "63px",
              background: "#fff",
              position: "fixed",
              bottom: "0px",
              left: 0,
              padding: "1rem 3rem",
              zIndex: 10000,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <ModalActions closeTitle="Cancel" saveTitle="Save" handleClose={close} handleSave={handleEditBrand}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCatergoriesContainerModal;