import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactTooltip from "react-tooltip";
import { useSellerConfig } from "../../../../../../store/sellerConfigContext";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  handleImageUpload,
  updateSellerConfigS3File,
} from "../../../../../../utils";
import { toast } from "react-toastify";
import { CircleSpinner } from "react-spinners-kit";
import { v4 as uuidv4 } from "uuid";
import { updateComponent } from "../../../../../../action";

const INIT_OPTION = {
  id: "",
  order: 0,
  img: "",
  hyperlink: "",
};

const PaymentOption = (props) => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [option, setOption] = useState({
    ...INIT_OPTION,
    id: uuidv4(),
    order: String(sellerConfigs.UIConfig.Footer.paymentMethods.length + 1),
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(-1);
  const USER_HAS_UPLOADED_IMAGE = Boolean(files[0]);

  const handleUpdateUploadProgress = (val) => setProgress(val);

  const handleAddOption = async () => {
    if (isLoading) return;
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let newItem = option; //MAKING A LOCAL COPY OF the "option" OBJECT THAT WE CAN LOCALLY UPDATE

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
      } else newItem.img = URL;
    } else {
      setIsLoading(false);
      toast.warning("Image required", {
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
        Footer: {
          ...updatedSellerConfig.UIConfig.Footer,
          paymentMethods: [
            ...updatedSellerConfig.UIConfig.Footer.paymentMethods,
            newItem,
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
      // sellerConfigDispatch(addHomeScreenSilde(newItem));
      const payload = getObjectDeepCopy(updatedSellerConfig.UIConfig.Footer);

      sellerConfigDispatch(
        updateComponent({
          data: payload,
          component: "Footer",
        })
      );
      // setFiles([]);
      // setIsLoading(false);
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
          background: `#43494e`,
        }}
      >
        <div
          {...getRootProps({
            className: "dropzone",
          })}
          style={{
            height: "240px",
            maxHeight: "240px",
            minHeight: "240px",
            width: "100%",
            userSelect: "none",
            objectFit: "contain",
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
                minWidth: 160,
                maxWidth: 160,
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
            }}
            data-tip
            data-for="edit-image-option"
          >
            <ReactTooltip
              place="right"
              id="edit-image-option"
              effect="solid"
              type="info"
            >
              Click to upload image
            </ReactTooltip>

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
                minHeight: "240px",
                maxHeight: "240px",
                width: "100%",
                userSelect: "none",
                pointerEvents: "none",
                objectFit: "contain",
              }}
              src={files[0].preview}
              alt="option"
              className="shadow-sm"
            />
          ) : (
            <div
              style={{
                maxHeight: "100%",
                minHeight: "240px",
                maxHeight: "240px",
                userSelect: "none",
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
              title="click to select option image"
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
              minWidth: 150,
            }}
            onClick={handleAddOption}
          >
            {isLoading ? (
              <>
                {" "}
                <CircleSpinner color={"#fff"} size={15} /> Saving
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

export default PaymentOption;
