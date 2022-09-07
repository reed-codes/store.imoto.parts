import React, { useState, useEffect } from "react";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import ToolBox from "./components/tool-box/tool-box";
import { useDropzone } from "react-dropzone";
import { updateComponent } from "../../../action";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { toast } from "react-toastify";
import {
  handleImageUpload,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
  getObjectDeepCopy,
} from "../../../utils";

const SectionImage = (props) => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(true); // FOR TRACKING IMAGHE VISIBILITY ON SCREEN
  const [editMode, setEditMode] = useState(false);
  const [progress, setProgress] = useState(-1);
  const [sectionImage, setSectionImage] = useState(
    sellerConfigs.UIConfig[props.component]
  );

  const IMAGE_TO_DISPLAY_PRESENT =
    sellerConfigs.UIConfig[props.component].img || files[0];
  const IS_DELETED = sellerConfigs.UIConfig[props.component].deleted;
  const CHANGE_INCLUDES_IMAGE = Boolean(files[0]);
  const IS_EDITED =
    sectionImage.img !== sellerConfigs.UIConfig[props.component].img ||
    sectionImage.hyperlink !==
      sellerConfigs.UIConfig[props.component].hyperlink ||
    files[0];
  const UPLOAD_COMPLETE = progress === 100;
  const SHOW_PROGRESS_PERCENTAGE = isLoading && progress !== -1;

  const handleImageLoadingStart = () => setImageIsLoading(true);
  const handleImageLoadingComplete = () => setImageIsLoading(false);

  const handleUpdateUploadProgress = (val) => setProgress(val);

  const handleEnableEditMode = () => {
    if (!isLoading) setEditMode(true);
  };

  const handleDisableEditMode = () => {
    setEditMode(false);
  };

  const handleHyperlinkChange = (e) => {
    setSectionImage({
      ...sectionImage,
      hyperlink: e.target.value,
    });
  };

  const handleSavePromo = async () => {
    if (isLoading) return;

    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let updatedSectionBannerImage = getObjectDeepCopy(sectionImage);

    setIsLoading(true);

    // IF CHANGE INVOLVES IMAGE, WE FIRST NEED TO UPLOAD THE IMAGE FILE
    if (CHANGE_INCLUDES_IMAGE) {
      handleDisableEditMode();
      setSectionImage({
        ...sectionImage,
        img: files[0].preview,
      });

      handleUpdateUploadProgress(0);

      const [URL, err] = await handleImageUpload(
        files[0],
        sellerConfigs.SellerID,
        handleUpdateUploadProgress
      );

      //THIS IF IS EXECUTED IF THE FUNCTION FAILED TO RETURN THE UPLOADED IMAGESS URL
      //THEREFORE DUE TO SUCH A FAILURE WE WOULD WANT TO ABOUT THE ENTIRE PROCESS OTHER WISE WE WILL HAVE A COMPONENT WITH A BROKEN IMAGE TAG
      if (URL) {
        updatedSectionBannerImage.img = URL;
      } else {
        setIsLoading(false);
        return;
      }
    }

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        [props.component]: {
          ...updatedSectionBannerImage,
          deleted: false,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      toast.success("Update successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
      });

      sellerConfigDispatch(
        updateComponent({
          data: {
            ...updatedSectionBannerImage,
            deleted: false,
          },
          component: props.component,
        })
      );
      setIsLoading(false);
      handleUpdateUploadProgress(-1);
    } else {
      setIsLoading(false);
      handleUpdateUploadProgress(-1);
    }
  };

  const toggleDeletedStatus = async () => {
    if (isLoading) return;

    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        [props.component]: {
          ...sectionImage,
          deleted: !IS_DELETED,
        },
      },
    };

    sellerConfigDispatch(
      updateComponent({
        data: {
          ...sectionImage,
          deleted: !IS_DELETED,
        },
        component: props.component,
      })
    );

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );
  };

  const restart = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    let updatedSellerConfig = { ...sellerConfigs };

    updatedSellerConfig = {
      ...sellerConfigs,
      UIConfig: {
        ...sellerConfigs.UIConfig,
        [props.component]: {
          deleted: false,
          img: "",
          hyperlink: "",
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      setSectionImage({
        deleted: false,
        img: "",
        hyperlink: "",
      });
      sellerConfigDispatch(
        updateComponent({
          data: {
            deleted: false,
            img: "",
            hyperlink: "",
          },
          component: props.component,
        })
      );
      handleDisableEditMode();
      setFiles([]);
    } else {
    }
  };

  const handleCancel = () => {
    if (isLoading) return;

    setSectionImage(sellerConfigs.UIConfig[props.component]);
    handleDisableEditMode();
    setFiles([]);
  };

  useEffect(() => {
    handleImageLoadingStart();
  }, [editMode]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

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

  return (
    <div
      style={{
        position: "relative",
        transform: "translate(0,0)",
        border: IS_DELETED ? `1px #dc3545 solid` : `1px transparent solid`,
        marginBottom: 15,
        height: imageIsLoading && IMAGE_TO_DISPLAY_PRESENT ? 245 : "auto",
      }}
      className={ sellerConfigs.UserInfo.enableEditing ?
        `edit-box ${IS_DELETED ? "deleted-edit-box" : "primary-edit-box"}`
        :
        ""
      }  
    >
      <section
        style={{
          width: "100%",
          backgroundSize: "contain",
          padding: `13px 0 ${editMode ? "3px" : "13px"}  0 `,
          position: "relative",
        }}
        className="container"
      >
        {SHOW_PROGRESS_PERCENTAGE && (
          <div
            className="shadow-lg"
            style={{
              position: "absolute",
              top: 23,
              left: 10,
              zIndex: 5,
              background: "rgba(0, 0, 0, 0.6)",
              maxWidth: 165,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0.7em 1.6em",
              color: "rgb(255, 255, 255)",
              fontWeight: 700,
              fontSize: "1rem",
              border: "1px rgba(130, 130, 130, 0.7) solid",
              borderRadius: 20,
              backdropFilter: "blur(3px)",
            }}
          >
            {UPLOAD_COMPLETE ? "Finishing up" : <>Uploading : {progress}%</>}
          </div>
        )}

        {sectionImage.img && !editMode && (
          <a
            href={sectionImage.hyperlink}
            style={{
              cursor: sectionImage.hyperlink ? "pointer" : "default",
              opacity: IS_DELETED ? 0.7 : 1,
            }}
            onClick={(e) => {
              if (!sectionImage.hyperlink || isLoading) e.preventDefault();
            }}
          >
            <img
              style={{
                width: "100%",
                filter: imageIsLoading ? "contrast(0)" : "unset",
                height: imageIsLoading ? 245 : "auto",
                background: imageIsLoading ? "rgb(67, 73, 78)" : "transparent",
                objectFit: "contain",
                opacity: IS_DELETED ? 0.7 : 1,
                border: IS_DELETED
                  ? "1px #dc3545 solid"
                  : "1px transparent solid",
              }}
              src={sectionImage.img}
              className="animate__animated animate__fadeIn"
              onLoad={handleImageLoadingComplete}
            />
          </a>
        )}

        {!IMAGE_TO_DISPLAY_PRESENT && !editMode && (
          <div
            style={{
              height: "245px",
              width: "100%",
              background: "#f4f4f4",
              border: "1px #90999d29 solid",
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
              title="Add a section banner image"
              onClick={handleEnableEditMode}
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
              Click to add a section banner image
            </h6>
          </div>
        )}

        {editMode && (
          <BannerEditor
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            imageIsLoading={imageIsLoading}
            file={files[0]}
            img={sectionImage.img}
            restart={restart}
            handleImageLoadingComplete={handleImageLoadingComplete}
            IMAGE_TO_DISPLAY_PRESENT={IMAGE_TO_DISPLAY_PRESENT}
          />
        )}

        {!isLoading &&
          (IS_DELETED ? (
            <RestorationAfterDeleteToolBox restore={toggleDeletedStatus} />
          ) : (
            <ToolBox
              handleEdit={handleEnableEditMode} 
              handleDeleteComponent={toggleDeletedStatus}
            />
          ))}
        <EditBoxStrip isDeleted={IS_DELETED} />

        {editMode && (
          <div className="pt-3">
            <div className="mt-1">
              <input
                type="text"
                className="form-control"
                placeholder="Paste hyperlink here."
                name="hyperlink"
                onChange={handleHyperlinkChange}
                value={sectionImage.hyperlink}
                style={{
                  opacity: IS_DELETED ? 0.7 : 1,
                  cursor: IS_DELETED ? "not-allowed" : "auto",
                }}
              />
            </div>

            <div
              style={{
                width: "100%",
                padding: "3px 0 1rem 0",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {!isLoading && (
                <button
                  className="btn btn-outline-danger btn-sm rounded"
                  onClick={handleCancel}
                  style={{ minWidth: 150 }}
                >
                  Cancle
                </button>
              )}

              {IS_EDITED && (
                <button
                  className="btn btn-outline-primary btn-sm rounded ml-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "3px",
                    minWidth: 150,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    pointerEvents: isLoading ? "none" : "auto",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onClick={handleSavePromo}
                >
                  {isLoading ? <>Saving</> : "Save"}
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const BannerEditor = (props) => {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        marginBottom: "5px",
      }}
    >
      <div
        {...props.getRootProps({
          className: "dropzone",
        })}
        style={{
          height: "100%",
          width: "100%",
          userSelect: "none",
          cursor: "pointer",
          opacity: 1,
          pointerEvents: "auto",
        }}
      >
        <button
          className="btn btn-primary btn-sm mr-2 shadow-lg rounded-full"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            height: "40px",
            width: "40px",
            padding: 0,
            border: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            zIndex: 100,
            background: "#fff",
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

        {props.IMAGE_TO_DISPLAY_PRESENT && (
          <img
            src={props.file ? props.file.preview : props.img}
            alt="store Ad banner"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              filter: props.imageIsLoading ? "contrast(0)" : "unset",
              background: props.imageIsLoading
                ? "rgb(67, 73, 78)"
                : "transparent",
            }}
            onLoad={props.handleImageLoadingComplete}
          />
        )}

        {!props.IMAGE_TO_DISPLAY_PRESENT && (
          <div
            style={{
              height: 245,
              width: "100%",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              background: props.imageIsLoading
                ? "rgb(67, 73, 78)"
                : "transparent",
            }}
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

        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 10,
            zIndex: 5,
            padding: 0,
            fontSize: "1rem",
            background: "#fff",
          }}
        >
          Recommended dimensions - 1584 by 396 pixels
        </div>

        <input
          style={{ height: "100%", width: "100%" }}
          {...props.getInputProps()}
        />
      </div>
    </div>
  );
};

export default SectionImage;
