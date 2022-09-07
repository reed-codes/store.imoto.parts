import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useDropzone } from "react-dropzone";
import { ImpulseSpinner } from "react-spinners-kit";
import {
  deleteHomeScreenSlide,
  updateHomeScreenSlider,
} from "../../../../../action";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  handleImageUpload,
  updateSellerConfigS3File,
} from "../../../../../utils";
import { CircleSpinner } from "react-spinners-kit";
import DndListOrderController from "./components/dnd-slides-reorder/dnd-list-order-controller";
import { DeleteConfirmationDialogue } from "../delete-confirmation-dialogue";
import { toast } from "react-toastify";

const INIT_SLIDE = {
  id: "",
  order: 0,
  img: "",
  hyperlink: "",
};

const CarouselSlides = (props) => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = sellerConfigs.UIConfig.HomeScreenSlider.slides;
  const [reorderedSlides, setReorderedSlides] = useState(slides);
  const [slide, setSlide] = useState(
    slides.length
      ? slides[currentSlideIndex]
      : {
          ...INIT_SLIDE,
          order: String(slides.length + 1),
        }
  );
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // FOR UPLOADING
  const [imageIsLoading, setImageIsLoading] = useState(true); // FOR TRACKING IMAGHE VISIBILITY ON SCREEN
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [progress, setProgress] = useState(-1);

  const IS_FIRST_SLIDE = 0 === currentSlideIndex;
  const IS_LAST_SLIDE = currentSlideIndex === slides.length - 1;
  const IS_EDITED =
    Boolean(files[0]) ||
    (slide.order
      ? Number(slide.order) !==
        Number(
          sellerConfigs.UIConfig.HomeScreenSlider.slides[currentSlideIndex]
            .order
        )
      : false) ||
    (slide.hyperlink
      ? slide.hyperlink !==
        sellerConfigs.UIConfig.HomeScreenSlider.slides[currentSlideIndex]
          .hyperlink
      : false);

  const handleEnableDeleteConfirmation = () => setDeleteConfirmation(true);
  const handleDisableDeleteConfirmation = () => setDeleteConfirmation(false);

  const handleNext = () => {
    if (!IS_LAST_SLIDE) setCurrentSlideIndex(currentSlideIndex + 1);
    else setCurrentSlideIndex(0);
  };

  const handlePrev = () => {
    if (!IS_FIRST_SLIDE) setCurrentSlideIndex(currentSlideIndex - 1);
    else setCurrentSlideIndex(slides.length - 1);
  };

  const handleChangeSlideIndex = (e) => {
    setCurrentSlideIndex(Number(e.currentTarget.id));
  };

  const handleSliderChange = (e) => {
    setSlide({
      ...slide,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleUpdateUploadProgress = (val) => setProgress(val);

  const handleUpdateSlide = async () => {
    if (!IS_EDITED) {
      toast.warning("No changes detected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    }

    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let updatedSlide = getObjectDeepCopy(slide); //MAKING A LOCAL COPY OF the "slide" OBJECT THAT WE CAN LOCALLY UPDATE
    const USER_HAS_UPLOADED_IMAGE = Boolean(files[0]);

    setIsLoading(true);

    // IF CHANGE INVOLVES IMAGE, WE FIRST NEED TO UPLOAD THE IMAGE FILE
    if (USER_HAS_UPLOADED_IMAGE) {
      handleUpdateUploadProgress(0);
      const [URL, err] = await handleImageUpload(
        files[0],
        sellerConfigs.SellerID,
        handleUpdateUploadProgress
      );

      //THIS "IF" IS EXECUTED IF THE FUNCTION FAILED TO RETURN THE UPLOADED IMAGE'S URL
      //THEREFORE DUE TO SUCH A FAILURE WE WOULD WANT TO ABORT THE ENTIRE PROCESS OTHER-WISE WE WILL HAVE A COMPONENT WITH A BROKEN IMAGE TAG
      if (err) {
        setIsLoading(false);
        return;
      } else updatedSlide.img = URL;
    }

    const updatedSlidesList = reorderedSlides.map((slde, index) => {
      slde.order = index + 1;
      if (slde.id === slide.id) {
        return slide;
      } else {
        return slde;
      }
    });

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        HomeScreenSlider: {
          ...updatedSellerConfig.UIConfig.HomeScreenSlider,
          slides: updatedSlidesList,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      sellerConfigDispatch(updateHomeScreenSlider(updatedSlide));
      setFiles([]);
      handleUpdateUploadProgress(-1);
      setIsLoading(false);
      props.close();
    } else {
      handleUpdateUploadProgress(-1);
      setIsLoading(false);
    }
  };

  const handleDeleteSlide = async () => {
    handleDisableDeleteConfirmation();
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let updatedSlide = getObjectDeepCopy(slide); //MAKING A LOCAL COPY OF the "slide" OBJECT THAT WE CAN LOCALLY UPDATE
    setIsLoading(true);

    // DELTING S3 IMAGE
    // const [imageUploadResponse, imageUploadErr] = await handleImageUpload(files[0], sellerConfigs.SellerID);
    //   if(imageUploadErr) return

    const updatedSlidesList = sellerConfigs.UIConfig.HomeScreenSlider.slides.filter(
      (slde) => slde.id !== slide.id
    );

    updatedSellerConfig = {
      ...sellerConfigs,
      UIConfig: {
        ...sellerConfigs.UIConfig,
        HomeScreenSlider: {
          ...sellerConfigs.UIConfig.HomeScreenSlider,
          slides: updatedSlidesList,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [
      SELLER_CONFIG_S3_UPDATE_SUCCESSFUL,
      err,
    ] = await updateSellerConfigS3File(blob, sellerConfigs.SellerID);

    if (SELLER_CONFIG_S3_UPDATE_SUCCESSFUL) {
      // sellerConfigDispatch(deleteHomeScreenSlide(updatedSlide.id));
      setFiles([]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      handleDisableDeleteConfirmation();
    }
  };

  const handleSetReorderedSlides = (list) => setReorderedSlides(list);

  const handleImageLoadingStart = () => setImageIsLoading(true);
  const handleImageLoadingComplete = () => setImageIsLoading(false);

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
    if (slides.length)
      setSlide(
        sellerConfigs.UIConfig.HomeScreenSlider.slides[currentSlideIndex]
      );
    else {
      setSlide(INIT_SLIDE);
    }
    setFiles([]);
    handleImageLoadingStart();
  }, [currentSlideIndex]);

  useEffect(() => {
    //Finding the new position of the current slide - this is after user has re-ordered the slides
    const newPos = reorderedSlides.findIndex((slde) => slde.id === slide.id);
    if (newPos + 1 !== Number(slide.order)) {
      setSlide({
        ...slide,
        order: newPos + 1,
      });
    }
  }, [reorderedSlides]);

  useEffect(() => {
    if (files[0]) {
      /*
      Ensuring that if a user updates a slide's image we update the image shown for this particular slide 
      in the section that we use to let users control the slides order
      This is accomplished by updating the img property of the particular slide within the array of slides that the ordering component uses to render out slides 
      */
      const newOrderedSlides = reorderedSlides.map((slde) => {
        if (slde.id === slide.id) {
          return {
            ...slde,
            img: files[0].preview,
          };
        } else return slde;
      });
      handleSetReorderedSlides(newOrderedSlides);
    } else {
      const newOrderedSlides = reorderedSlides.map((slde) => {
        if (slde.id === slide.id) {
          return {
            ...slde,
            img: slide.img,
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
      <button
        className="btn btn-primary"
        style={{
          height: 30,
          width: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderRadius: 3,
          background: "#fff",
          position: "absolute",
          top: 15,
          left: 30,
          zIndex: 1010,
        }}
        onClick={props.addNewSlide}
        data-tip
        data-for="add-new-image-option"
      >
        <ReactTooltip
          place="right"
          id="add-new-image-option"
          effect="solid"
          type="info"
        >
          Add new banner image
        </ReactTooltip>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="#08C"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </button>

      <Pagination
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        IS_FIRST_SLIDE={IS_FIRST_SLIDE}
        IS_LAST_SLIDE={IS_LAST_SLIDE}
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
            pointerEvents: isLoading ? "none" : "auto",
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
            {isLoading && progress !== -1 && (
              <div
                className="shadow-lg"
                style={{
                  position: "absolute",
                  inset: 0,
                  margin: "auto",
                  background: "rgba(0,0,0,.7)",
                  height: 40,
                  width: 160,
                  minWidth: 165,
                  maxWidth: 165,
                  zIndex: 5,
                  color: "rgb(255, 255, 255)",
                  fontWeight: 700,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1em 1.6em",
                  fontSize: "1.2rem",
                  border: "1px #0189ca solid",
                  borderRadius: 20,
                  backdropFilter: "blur(3px)",
                }}
              >
                {progress === 100 ? (
                  "Finishing up"
                ) : (
                  <>Uploading : {progress}%</>
                )}
              </div>
            )}

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
              Recommended dimensions - 1584 by 396 pixels
            </div>

            <button
              className="btn btn-primary btn-sm mr-2 shadow-lg rounded-full"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "#fff",
                height: 40,
                minWidth: 40,
                padding: 0,
                border: 0,
                display: isLoading ? "none" : "flex",
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

            {slide.img || files[0] ? (
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
                  }}
                  src={files[0] ? files[0].preview : slide.img}
                  alt={"Slide"}
                  className="shadow-sm animate__animated animate__fadeIn hover-dark"
                  onLoad={handleImageLoadingComplete}
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
                      <ImpulseSpinner size={30} frontColor="#0189cb" />
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
                  style={{
                    opacity: 0.7,
                  }}
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
            opacity: isLoading ? 0.7 : 1,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Paste hyperlink here."
            name="hyperlink"
            onChange={handleSliderChange}
            value={slide.hyperlink}
            style={{
              marginTop: 25,
            }}
          />
          <div
            className="alert alert-primary d-flex align-items-center"
            role="alert"
            style={{
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
              The <b>optional</b> hyperlink property represents where users will
              be taken upon clicking this carousel banner
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            padding: "1rem 0",
            paddingTop: "3px",
            opacity: isLoading ? 0.7 : 1,
            pointerEvents: isLoading ? "none" : "auto",
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
          <DndListOrderController
            slides={reorderedSlides}
            currentSlide={slides[currentSlideIndex]}
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 5,
              opacity: isLoading ? 0.7 : 1,
              pointerEvents: isLoading ? "none" : "auto",
              width: "100%",
            }}
          >
            <div
              style={{
                height: "100%",
                width: 57,
                height: 55,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input
                type="number"
                name="order"
                min="1"
                disabled={true}
                className="form-control"
                onChange={handleSliderChange}
                value={slide.order}
              />
            </div>
            <div
              className="alert alert-primary d-flex align-items-center"
              role="alert"
              style={{
                marginBottom: "0",
                minHeight: "59px",
                transform: "translateY(2px)",
                fontSize: "1.2rem",
                flex: 1,
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
                Pick the position you would like this slide to take by dragging
                and dropping
              </div>
            </div>
          </div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  minWidth: 150,
                }}
                className="btn btn-outline-danger btn-sm mr-3 rounded"
                onClick={handleEnableDeleteConfirmation}
              >
                Delete
              </button>

              <button
                className={`btn ${
                  1 ? "btn-outline-primary" : "btn-outline-secondary"
                } btn-sm mr-2 rounded`}
                style={{
                  position: "relative",
                  opacity: IS_EDITED && !isLoading ? 1 : 0.7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  borderColor: "#08C",
                  minWidth: 150,
                }}
                onClick={handleUpdateSlide}
              >
                {(!IS_EDITED || isLoading) && (
                  <div
                    style={{
                      cursor: "not-allowed",
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 10,
                    }}
                  />
                )}

                {isLoading ? (
                  <>
                    {" "}
                    <CircleSpinner color={"#004081"} size={15} /> Saving changes
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteConfirmation && (
        <DeleteConfirmationDialogue
          message={"Are you sure you want to delete image from carousel ?"}
          cancel={handleDisableDeleteConfirmation}
          confirm={handleDeleteSlide}
        />
      )}
    </>
  );
};

const Pagination = (props) => {
  return (
    <div
      style={{
        width: "fit-content",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 63,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        zIndex: 110,
      }}
    >
      <nav>
        <div
          className="pagination"
          style={{
            margin: 0,
            padding: "1rem 3rem",
            display: "flex",
            alignItems: "center",
            gap: 5,
            userSelect: "none",
          }}
        >
          <div>
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{
                opacity: props.IS_FIRST_SLIDE ? 0.9 : 1,
                pointerEvents: props.IS_FIRST_SLIDE ? "none" : "auto",
                color: props.IS_FIRST_SLIDE ? "#777" : "#0088cb",
                borderColor: props.IS_FIRST_SLIDE ? "#ccc" : "#0088cb",
              }}
              onClick={() => !props.IS_FIRST_SLIDE && props.handlePrev()}
            >
              Prev
            </button>
          </div>

          <div className="page-item">
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{ color: "#0088cb", borderColor: "#0088cb" }}
            >
              {props.currentSlideIndex + 1}
            </button>
          </div>
          <span
            style={{
              height: "100%",
              transform: "translateX(3px)",
              opacity: 0.3,
            }}
          >
            /
          </span>
          <div
            className="page-item"
            id={props.slides.length - 1}
            onClick={props.handleChangeSlideIndex}
          >
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{
                color: props.IS_LAST_SLIDE ? "#0088cb" : "#777",
                borderColor: props.IS_LAST_SLIDE ? "#0088cb" : "#ccc",
              }}
            >
              {props.slides.length}
            </button>
          </div>

          <div>
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{
                opacity: props.IS_LAST_SLIDE ? 0.9 : 1,
                pointerEvents: props.IS_LAST_SLIDE ? "none" : "auto",
                color: props.IS_LAST_SLIDE ? "#777" : "#0088cb",
                borderColor: props.IS_LAST_SLIDE ? "#ccc" : "#0088cb",
              }}
              onClick={() => !props.IS_LAST_SLIDE && props.handleNext()}
            >
              Next
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CarouselSlides;
