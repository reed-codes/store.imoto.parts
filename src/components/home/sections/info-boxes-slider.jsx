import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import EditBoxStrip from "./components/tool-box/edit-box-strip";
import ToolBox from "./components/tool-box/tool-box";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import { AddInfoBoxModal } from "./components/info-box-slider/InfoBoxModals";

import Carousel from "../../features/carousel";
import { owlSetting8 } from "../../../utils/settings";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import {
  addInfoBoxSlide,
  deleteInfoBoxSlideByIndex,
  editInfoBoxSlideIconByIndex,
  toggleComponentDeletedStatus,
} from "../../../action";
import ConfirmDelete from "./components/confirm-delete";
import { ItemActions } from "./components/tool-box/edit-delete-item-actions";
import {
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../../utils";
import NoContentContainer from "./components/no-content-container";

const InfoBoxesSlider = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const DELETED = sellerConfigs.UIConfig.InfoBoxesSlider.deleted;

  const [deletingInfoBox, setDeletingInfoBox] = useState(-1);
  const [editingInfoBox, setEditingInfoBox] = useState(-1);
  const [openAddInfoBox, setOpenAddInfoBox] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [infoBoxes, setInfoBoxes] = useState([
    ...sellerConfigs.UIConfig.InfoBoxesSlider.info,
  ]);
  const [newInfoBox, setNewInfoBox] = useState({
    id: uuidv4(),
    name: "",
    title: "",
    desc: "",
  });

  useEffect(() => {
    setInfoBoxes([...sellerConfigs.UIConfig.InfoBoxesSlider.info]);
    // console.log("useEffect");
    // console.log("sellerConfigs.UIConfig.InfoBoxesSlider.info:",
    //   sellerConfigs.UIConfig.InfoBoxesSlider.info
    // );
  }, [sellerConfigs.UIConfig.InfoBoxesSlider.info]);

  /**
   * Function triggered when save or confirm is clicked. this function asserts the
   * 'editingInfoBox' and the 'deletingInfoBox' state variable to know if the user
   * is creating, editing or deleting and info box.
   */
  const handleSaveInfoBoxClicked = async () => {
    // make a copy of infoboxes and update the infobox @editingInfoBox
    let copyLocalInfoBoxes = [...infoBoxes];
    let dispatchFunction = () => {};
    let successMessage = "",
      errorMessage = "";

    if (editingInfoBox >= 0) {
      setOpenAddInfoBox(false);
      setEditingInfoBox(-1);

      copyLocalInfoBoxes[editingInfoBox] = { ...newInfoBox };
      dispatchFunction = editInfoBoxSlideIconByIndex({
        index: editingInfoBox,
        name: newInfoBox.name,
      });
      successMessage = "Info Box update successfully";
      errorMessage = "Error updating Info Box";
    } else if (deletingInfoBox >= 0) {
      setOpenConfirmDelete(false);
      setDeletingInfoBox(-1);

      copyLocalInfoBoxes.splice(deletingInfoBox, 1);
      dispatchFunction = deleteInfoBoxSlideByIndex(deletingInfoBox);
      successMessage = "Info Box deleted successfully";
      errorMessage = "Error deleting Info Box";
    } else {
      setOpenAddInfoBox(false);

      copyLocalInfoBoxes.push({ ...newInfoBox });
      dispatchFunction = addInfoBoxSlide({ ...newInfoBox });

      successMessage = "Info Box added successfully";
      errorMessage = "Error adding Info Box";
    }
    sellerConfigDispatch(dispatchFunction);

    const [SUCCESS, _] = await persistInfoBoxesChanges(copyLocalInfoBoxes);
    if (SUCCESS) {
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } else {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }

    // reset state variables accordingly
    setInfoBoxes([...copyLocalInfoBoxes]);
    setNewInfoBox({
      id: uuidv4(),
      name: "",
      title: "",
      desc: "",
    });
  };

  /**
   * Function used to persist the changes made to the local InfoBoxes with the
   * InfoBoxes in S3 and Global state. This function will make a copy of the
   * Global state and get the JSON blob file that will be writen to S3 and then
   * attemp to write the blob file to S3. The caller is responsible for checking
   * if the write was successful so that Global state is synced or updated with
   * whats in S3 and local state.
   *
   * @param {array} copyInfoBoxes copy of the local infoboxes.
   */
  const persistInfoBoxesChanges = async (copyInfoBoxes) => {
    const copySellerConfigs = { ...sellerConfigs };
    copySellerConfigs.UIConfig.InfoBoxesSlider.info = [...copyInfoBoxes];

    const blob = getSellerConfigJsonBlob(copySellerConfigs);
    const [SUCCESS, ERROR] = await updateSellerConfigS3File(blob, "localhost");

    return [SUCCESS, ERROR];
  };

  /**
   * Function used to hide a widgtet. This function will update the widgets
   * deleted field in context.
   */
  const toggleDeletedStatus = () => {
    sellerConfigDispatch(toggleComponentDeletedStatus("InfoBoxesSlider"));
  };

  /**
   * Function triggered by the add and edit infobox state change. We use 2 way
   * binding to target and update state for the fields that have changed.
   *
   * @param {object} event the object that will be used to update state
   */
  const handleInfoBoxContentChange = (event) => {
    setNewInfoBox({
      ...newInfoBox,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Function triggered when delete infobox is clicked. Here we set the index of
   * the deleting infobox and open the confirm delete info box modal.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleDeleteInfoBoxClicked = (index) => {
    setDeletingInfoBox(index);
    setOpenConfirmDelete(true);
  };

  /**
   * Function used when add new info box is clicked. Here we set the init info box
   * and set editing to -1 and open the modal
   */
  const handleAddInfoBoxClicked = () => {
    setNewInfoBox({ ...newInfoBox });
    setEditingInfoBox(-1);
    setOpenAddInfoBox(true);
  };

  /**
   * Function used or call when the edit infobox is clicked. Here we open the
   * modal, set the editing info box and the index.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleEditInfoBoxClicked = (index) => {
    setEditingInfoBox(index);
    setNewInfoBox({ ...infoBoxes[index] });
    setOpenAddInfoBox(true);
  };

  /**
   * Function called when the cancel button is clicked in the Edit or Add
   * InfoBox modal.
   */
  const handleCancelClicked = () => {
    setOpenAddInfoBox(false);

    setNewInfoBox({
      id: uuidv4(),
      name: "",
      title: "",
      desc: "",
    });
  };

  return (
    <div
      style={{
        position: "relative",
        transform: "translate(0,0)",
        border: DELETED ? `1px #dc3545 solid` : `1px transparent solid`,
      }}
      className={
        sellerConfigs.UserInfo.enableEditing
          ? `edit-box ${DELETED ? "deleted-edit-box" : "primary-edit-box"}`
          : ""
      }
    >
      <EditBoxStrip isDeleted={DELETED} />
      {DELETED ? (
        <RestorationAfterDeleteToolBox restore={toggleDeletedStatus} />
      ) : (
        <ToolBox
          handleAdd={handleAddInfoBoxClicked}
          addTooltip="Click to add an Info-Box"
          hideTooltip="Click to hide Info-Box slider"
          handleDeleteComponent={toggleDeletedStatus}
        />
      )}
      {infoBoxes.length === 0 ? (
        <NoContentContainer
          containerHeight="140px"
          addItem={handleAddInfoBoxClicked}
          message="Click to add a Info Box Slide to the Slider"
        />
      ) : (
        <div
          style={{
            width: "100%",
            opacity: DELETED ? 0.7 : 1,
            pointerEvents: DELETED ? "none" : "auto",
            position: "relative",
          }}
        >
          <div className="container">
            <Carousel
              addClass="info-boxes-slider owl-carousel owl-theme mb-1"
              settings={{ ...owlSetting8, margin: 0 }}
            >
              {infoBoxes.length &&
                infoBoxes.map((item, index) => (
                  <div
                    className={"info-box info-box-icon-left"}
                    key={"info" + index}
                    style={{
                      position: "relative",
                      color: sellerConfigs.Theme.ColorPalette["Gray-10"],
                      borderColor: sellerConfigs.Theme.ColorPalette["Gray-60"],
                    }}
                  >
                    <i className={item.name}></i>
                    <div className={"info-box-content "}>
                      <h4 className={"m-b-3"}>{item.title}</h4>
                      <p>{item.desc}</p>
                      <ItemActions
                        deleteClicked={() => handleDeleteInfoBoxClicked(index)}
                        editClicked={() => handleEditInfoBoxClicked(index)}
                      />
                    </div>
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
      )}
      {openAddInfoBox && (
        <AddInfoBoxModal
          addingInfoBox={editingInfoBox === -1}
          state={newInfoBox}
          handleChange={handleInfoBoxContentChange}
          handleSave={handleSaveInfoBoxClicked}
          handleCloseModal={handleCancelClicked}
        />
      )}
      {openConfirmDelete && (
        <ConfirmDelete
          cancel={() => setOpenConfirmDelete(false)}
          confirm={handleSaveInfoBoxClicked}
          message="Are you sure you would like to delete this Info Box from the Info Box container permanantly?"
        />
      )}
    </div>
  );
};

export default InfoBoxesSlider;
