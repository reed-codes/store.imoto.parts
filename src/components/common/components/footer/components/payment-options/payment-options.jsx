import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useDropzone } from "react-dropzone";
import { ImpulseSpinner } from "react-spinners-kit";
import { useSellerConfig } from "../../../../../../store/sellerConfigContext";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  handleImageUpload,
  updateSellerConfigS3File,
} from "../../../../../../utils";
import { CircleSpinner } from "react-spinners-kit";
import DndListOrderController from "./components/dnd-reorder/dnd-list-order-controller";
import { DeleteConfirmationDialogue } from "../../../../../home/sections/components/delete-confirmation-dialogue";
import { toast } from "react-toastify";
import { updateComponent } from "../../../../../../action";

const INIT_OPTION = {
  id: "",
  order: 0,
  img: "",
  hyperlink: "",
};

const PaymentOptions = (props) => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState(
    sellerConfigs.UIConfig.Footer.paymentMethods
  );
  const [reorderedItems, setReorderedItems] = useState(paymentMethods);
  const [option, setOption] = useState(
    paymentMethods.length
      ? paymentMethods[currentItemIndex]
      : {
          ...INIT_OPTION,
          order: String(paymentMethods.length + 1),
        }
  );

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // FOR UPLOADING
  const [imageIsLoading, setImageIsLoading] = useState(true); // FOR TRACKING IMAGHE VISIBILITY ON SCREEN
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [progress, setProgress] = useState(-1);

  const IS_FIRST_OPTION = 0 === currentItemIndex;
  const IS_LAST_OPTION = currentItemIndex === paymentMethods.length - 1;

  const IS_EDITED =
    JSON.stringify(reorderedItems) !== JSON.stringify(paymentMethods);

  const handleEnableDeleteConfirmation = () => setDeleteConfirmation(true);
  const handleDisableDeleteConfirmation = () => setDeleteConfirmation(false);

  const handleNext = () => {
    if (!IS_LAST_OPTION) setCurrentItemIndex(currentItemIndex + 1);
    else setCurrentItemIndex(0);
  };

  const handlePrev = () => {
    if (!IS_FIRST_OPTION) setCurrentItemIndex(currentItemIndex - 1);
    else setCurrentItemIndex(paymentMethods.length - 1);
  };

  const handleChangeOptionIndex = (e) => {
    setCurrentItemIndex(Number(e.currentTarget.id));
  };

  const handleUpdateUploadProgress = (val) => setProgress(val);

  const handleUpdateOption = async () => {
    if (!IS_EDITED) {
      toast.warning("No changes detected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    }

    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let updatedOption = getObjectDeepCopy(option); //MAKING A LOCAL COPY OF the "option" OBJECT THAT WE CAN LOCALLY UPDATE
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
      } else updatedOption.img = URL;
    }

    const updatedOptionsList = reorderedItems.map((opt, index) => {
      opt.order = index + 1;
      if (opt.id === updatedOption.id) {
        return updatedOption;
      } else {
        return opt;
      }
    });

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        Footer: {
          ...updatedSellerConfig.UIConfig.Footer,
          paymentMethods: updatedOptionsList,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      const payload = getObjectDeepCopy(updatedSellerConfig.UIConfig.Footer);
      sellerConfigDispatch(
        updateComponent({
          data: payload,
          component: "Footer",
        })
      );
      props.close();
    } else {
      handleUpdateUploadProgress(-1);
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    handleDisableDeleteConfirmation();
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    setIsLoading(true);

    // DELTING S3 IMAGE
    // const [imageUploadResponse, imageUploadErr] = await handleImageUpload(files[0], sellerConfigs.SellerID);
    //   if(imageUploadErr) return

    const updatedOptionsList = sellerConfigs.UIConfig.Footer.paymentMethods.filter(
      (opt) => opt.id !== option.id
    );

    updatedSellerConfig = {
      ...sellerConfigs,
      UIConfig: {
        ...sellerConfigs.UIConfig,
        Footer: {
          ...sellerConfigs.UIConfig.Footer,
          paymentMethods: updatedOptionsList,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [
      SELLER_CONFIG_S3_UPDATE_SUCCESSFUL,
      err,
    ] = await updateSellerConfigS3File(blob, sellerConfigs.SellerID);

    if (SELLER_CONFIG_S3_UPDATE_SUCCESSFUL) {
      const payload = getObjectDeepCopy(updatedSellerConfig.UIConfig.Footer);

      if (payload.paymentMethods.length) {
        setCurrentItemIndex(0);
        setFiles([]);
        setIsLoading(false);
        setPaymentMethods(updatedOptionsList);
        sellerConfigDispatch(
          updateComponent({
            data: payload,
            component: "Footer",
          })
        );
      } else {
        props.addNewItem();
      }
    } else {
      setIsLoading(false);
      handleDisableDeleteConfirmation();
    }
  };

  const handleSetReorderedItems = (list) => setReorderedItems(list);

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
    if (paymentMethods.length)
      setOption(sellerConfigs.UIConfig.Footer.paymentMethods[currentItemIndex]);
    else {
      setOption(INIT_OPTION);
    }
    setFiles([]);
    handleImageLoadingStart();
  }, [currentItemIndex]);

  useEffect(() => {
    setReorderedItems(paymentMethods);
  }, [paymentMethods]);

  useEffect(() => {
    //Finding the new position of the current option - this is after user has re-ordered the paymentMethods
    const newPos = reorderedItems.findIndex((opt) => opt.id === option.id);
    if (newPos + 1 !== Number(option.order)) {
      setOption({
        ...option,
        order: newPos + 1,
      });
    }
  }, [reorderedItems]);

  useEffect(() => {
    if (files[0]) {
      /*
      Ensuring that if a user updates a option's image we update the image shown for this particular option 
      in the section that we use to let users control the paymentMethods order
      This is accomplished by updating the img property of the particular option within the array of paymentMethods that the ordering component uses to render out paymentMethods 
      */
      const newOrderedItems = reorderedItems.map((opt) => {
        if (opt.id === option.id) {
          return {
            ...opt,
            img: files[0].preview,
          };
        } else return opt;
      });
      handleSetReorderedItems(newOrderedItems);
    } else {
      const newOrderedItems = reorderedItems.map((opt) => {
        if (opt.id === option.id) {
          return {
            ...opt,
            img: option.img,
          };
        } else return opt;
      });
      handleSetReorderedItems(newOrderedItems);
    }

    return () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <>
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
        onClick={props.addNewItem}
        data-tip
        data-for="add-new-image-option"
      >
        <ReactTooltip
          place="right"
          id="add-new-image-option"
          effect="solid"
          type="info"
        >
          Add new payment option
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
        items={paymentMethods}
        currentItemIndex={currentItemIndex}
        IS_FIRST_OPTION={IS_FIRST_OPTION}
        IS_LAST_OPTION={IS_LAST_OPTION}
        handleNext={handleNext}
        handlePrev={handlePrev}
        handleChangeOption={handleChangeOptionIndex}
      />

      <div
        style={{
          width: "100%",
          marginBottom: "5px",
        }}
      >
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            opacity: 1,
            pointerEvents: isLoading ? "none" : "auto",
            minHeight: "90px",
            maxHeight: "90px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <div
            {...getRootProps({
              className: "dropzone",
            })}
            style={{
              minHeight: "80px",
              maxHeight: "80px",
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
                Click to update image
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

            {option.img || files[0] ? (
              <>
                <img
                  style={{
                    height: "100%",
                    minHeight: "80px",
                    maxHeight: "80px",
                    width: "100%",
                    userSelect: "none",
                    pointerEvents: "none",
                    objectFit: "contain",
                  }}
                  src={files[0] ? files[0].preview : option.img}
                  alt={"option"}
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
            items={reorderedItems}
            currentItem={paymentMethods[currentItemIndex]}
            reorder={handleSetReorderedItems}
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
                value={option.order}
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
                Pick the position you would like this option to take by dragging
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
                onClick={handleUpdateOption}
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
                    <CircleSpinner color={"#fff"} size={15} /> Saving changes
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
          message={
            "Are you sure you want to delete this payment option image ?"
          }
          cancel={handleDisableDeleteConfirmation}
          confirm={handleDeleteItem}
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
                opacity: props.IS_FIRST_OPTION ? 0.9 : 1,
                pointerEvents: props.IS_FIRST_OPTION ? "none" : "auto",
                color: props.IS_FIRST_OPTION ? "#777" : "#0088cb",
                borderColor: props.IS_FIRST_OPTION ? "#ccc" : "#0088cb",
              }}
              onClick={() => !props.IS_FIRST_OPTION && props.handlePrev()}
            >
              Prev
            </button>
          </div>

          <div className="page-item">
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{ color: "#0088cb", borderColor: "#0088cb" }}
            >
              {props.currentItemIndex + 1}
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
            id={props.items.length - 1}
            onClick={props.handleChangeOptionIndex}
          >
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{
                color: props.IS_LAST_OPTION ? "#0088cb" : "#777",
                borderColor: props.IS_LAST_OPTION ? "#0088cb" : "#ccc",
              }}
            >
              {props.items.length}
            </button>
          </div>

          <div>
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{
                opacity: props.IS_LAST_OPTION ? 0.9 : 1,
                pointerEvents: props.IS_LAST_OPTION ? "none" : "auto",
                color: props.IS_LAST_OPTION ? "#777" : "#0088cb",
                borderColor: props.IS_LAST_OPTION ? "#ccc" : "#0088cb",
              }}
              onClick={() => !props.IS_LAST_OPTION && props.handleNext()}
            >
              Next
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PaymentOptions;
