import React, { useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { addItemToCategoriesSlider } from "../../../../../action";

import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import {
  getSellerConfigJsonBlob,
  handleImageUpload,
  updateSellerConfigS3File,
} from "../../../../../utils";
import { PREDEFINED_TYPES } from "../../../../../utils/icons";
import ModalActions from "../modal-actions";


const AddItemContainer = (props) => {
  const { close, setCategories } = props
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();

  const [item, setItem] = useState({
    id: uuidv4(),
    image: "",
    type: "",
    name: "",
    order: sellerConfigs.UIConfig.CategoriesSlider.categories.length + 1,
  });

  const [files, setFiles] = useState([]);

  const USER_HAS_UPLOADED_IMAGE = Boolean(files[0]);

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleAddSlide = async () => {
    let updatedSellerConfig = sellerConfigs;
    let newSlide = item;

    // if there is no image alert the user and return execution
    if (!USER_HAS_UPLOADED_IMAGE) {
      toast.warning("image required before saving", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    }

    if (!item.name || !item.type) {
      toast.warning("item 'name' or 'type' can not be empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    }

    // at this point we know that we have an image. push the new item with the 
    // image preview. This helps display the image before uploading and getting
    // a link that can be used to display the image
    let copyCategories = [...sellerConfigs.UIConfig.CategoriesSlider.categories];
    copyCategories.push({
        ...newSlide,
        image: files[0].preview
      }
    );

    setCategories([...copyCategories]);
    close();

    // there is an image upload image and asert error and alert user appropriatly
    const [URL, err] = await handleImageUpload(
      files[0],
      sellerConfigs.SellerID
    );

    if (err) {
      toast.error("image add unsuccessful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    }
    
    newSlide.image = URL
    copyCategories[copyCategories.length - 1] = newSlide;

    updatedSellerConfig = {
      ...sellerConfigs,
      UIConfig: {
        ...sellerConfigs.UIConfig,
        CategoriesSlider: {
          ...sellerConfigs.UIConfig.CategoriesSlider,
          categories: copyCategories,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);
    const [SUCCESS, _] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (SUCCESS) {
      sellerConfigDispatch(addItemToCategoriesSlider(newSlide));
      toast.success("item added successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      
      setFiles([]);
    } else {
      toast.error("adding item unsuccessful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
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

  const handleItemContentChange = (event) => {
    setItem({
      ...item,
      [event.target.name]: event.target.value
    });
  }

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
            height: "160px",
            maxHeight: "160px",
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
            Recommended dimensions - 96 by 96 pixels
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
                backgroundColor: "#f6f7f9"
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
        <div
          className="alert alert-primary d-flex align-items-center"
          role="alert"
          style={{
            marginTop: "2rem",
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
            Select to search for either <b>Catergory</b>, <b>Brand</b> or <b>Tag</b> that will apper in the container,
          </div>
        </div>
        <div style={{ width: "100%"}}>
          <select
            name="type"
            value={item.type}
            onChange={(e) => handleItemContentChange(e)}
            className="form-control form-control-sm"
          >
            <option value="">Select item type...</option>
            {PREDEFINED_TYPES.map((type) =>
              <option key={type} value={type}>
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
          value={item.name}
          style={{
            marginTop: 15,
          }}
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
            justifyContent: "flex-end",
          }}
        >
          <ModalActions closeTitle="Cancel" saveTitle="Add" handleClose={close} handleSave={handleAddSlide}/>
        </div>
      </div>
    </div>
  );
};

export default AddItemContainer;