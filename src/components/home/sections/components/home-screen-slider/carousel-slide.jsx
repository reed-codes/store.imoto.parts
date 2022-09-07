import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { addHomeScreenSilde } from "../../../../../action";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  handleImageUpload,
  updateSellerConfigS3File,
} from "../../../../../utils";
import { toast } from "react-toastify";
import { CircleSpinner } from "react-spinners-kit";
import { v4 as uuidv4 } from "uuid";

const INIT_SLIDE = {
  id: "",
  order: 0,
  img: "",
  hyperlink: "",
};

const CarouselSlide = (props) => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [slide, setSlide] = useState({
    ...INIT_SLIDE,
    id: uuidv4(),
    order: String(sellerConfigs.UIConfig.HomeScreenSlider.slides.length + 1),
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(-1);
  const USER_HAS_UPLOADED_IMAGE = Boolean(files[0]);

  const handleSliderChange = (e) => {
    setSlide({
      ...slide,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleUpdateUploadProgress = (val) => setProgress(val);

  const handleAddSlide = async () => {
    if (isLoading) return;
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let newSlide = slide; //MAKING A LOCAL COPY OF the "slide" OBJECT THAT WE CAN LOCALLY UPDATE

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
      } else newSlide.img = URL;
    } else {
      setIsLoading(false);
      toast.warning("Carousel image required", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    }

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        HomeScreenSlider: {
          ...updatedSellerConfig.UIConfig.HomeScreenSlider,
          slides: [
            ...updatedSellerConfig.UIConfig.HomeScreenSlider.slides,
            newSlide,
          ],
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      sellerConfigDispatch(addHomeScreenSilde(newSlide));
      setFiles([]);
      setIsLoading(false);
      props.close();
    } else {
      setIsLoading(false);
    }
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

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
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
        }}
      >
        <div
          {...getRootProps({
            className: "dropzone",
          })}
          style={{
            height: "170px",
            maxHeight: "360px",
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
              Uploading : {progress}%
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
              height: "40px",
              width: "40px",
              padding: 0,
              border: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              zIndex: 5,
              opacity: 0.8,
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

          {USER_HAS_UPLOADED_IMAGE ? (
            <img
              style={{
                height: "100%",
                minHeight: "170px",
                maxHeight: "360px",
                width: "100%",
                userSelect: "none",
                pointerEvents: "none",
                objectFit: "contain",
              }}
              src={files[0].preview}
              alt="Slide"
              className="shadow-sm"
            />
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

      <div className="mt-1">
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
            fontSize: "1.2rem",
            minHeight: "59px",
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
            be taken upon clicking this carousel image
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
            justifyContent: "flex-end",
          }}
        >
          <button
            className={`btn btn-outline-primary btn-sm mr-2 rounded`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              cursor:
                isLoading || !USER_HAS_UPLOADED_IMAGE
                  ? "not-allowed"
                  : "pointer",
              opacity: isLoading || !USER_HAS_UPLOADED_IMAGE ? 0.7 : 1,
              minWidth: 150
            }}
            onClick={handleAddSlide}
          >
            {isLoading ? (
              <>
                {" "}
                <CircleSpinner
                  color={"#004081"}
                  size={15}
                />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselSlide;
