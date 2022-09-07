import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import ToolBox from "./components/tool-box/tool-box";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import { AddFeatureModal } from "./components/feature-boxes/feature-box-modals";
import FeatureBoxActions from "./components/feature-boxes/feature-box-actions";
import FeatureBoxNoContent from "./components/feature-boxes/feature-box-no-content";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import {
  addFeatureBox,
  editFeatureBoxByIndex,
  deleteFeatureBoxByIndex,
  toggleComponentDeletedStatus,
} from "../../../action";
import {
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../../utils";
import ConfirmDelete from "./components/confirm-delete";
import { ItemActions } from "./components/tool-box/edit-delete-item-actions";

const FeatureBoxes = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const DELETED = sellerConfigs.UIConfig.FeatureBoxes.deleted;

  const [editingFeatureBox, setEditingFeatureBox] = useState(-1);
  const [deletingFeatureBox, setDeletingFeatureBox] = useState(-1);
  const [openFeatureBoxModal, setOpenFeatureBoxModal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [featureBoxes, setFeatureBoxes] = useState([
    ...sellerConfigs.UIConfig.FeatureBoxes.features,
  ]);
  const [newFeatureBox, setNewFeatureBox] = useState({
    id: uuidv4(),
    icon: "",
    heading: "",
    subheading: "",
    paragraph: "",
  });

  useEffect(() => {
    setFeatureBoxes([...sellerConfigs.UIConfig.FeatureBoxes.features]);
  }, [sellerConfigs.UIConfig.FeatureBoxes.features]);

  /**
   * Function triggered when save or confirm is clicked. this function asserts the
   * 'editingInfoBox' and the 'deletingInfoBox' state variable to know if the user
   * is creating, editing or deleting and info box.
   */
  const handleSaveFeatureBoxClicked = async () => {
    // make a copy of infoboxes and update the infobox @editingInfoBox
    let copyLocalFeatureBoxes = [...featureBoxes];
    let dispatchFunction = () => {};
    let successMessage = "",
      errorMessage = "";

    if (editingFeatureBox >= 0) {
      setOpenFeatureBoxModal(false);
      copyLocalFeatureBoxes[editingFeatureBox] = { ...newFeatureBox };
      dispatchFunction = editFeatureBoxByIndex({
        index: editingFeatureBox,
        featureBox: newFeatureBox,
      });
      setEditingFeatureBox(-1);
      successMessage = "Info Box update successfully";
      errorMessage = "Error updating Info Box";
    } else if (deletingFeatureBox >= 0) {
      setOpenConfirmDelete(false);

      copyLocalFeatureBoxes.splice(deletingFeatureBox, 1);
      dispatchFunction = deleteFeatureBoxByIndex(deletingFeatureBox);
      setDeletingFeatureBox(-1);
      successMessage = "Info Box deleted successfully";
      errorMessage = "Error deleting Info Box";
    } else {
      setOpenFeatureBoxModal(false);

      copyLocalFeatureBoxes.push({ ...newFeatureBox });
      dispatchFunction = addFeatureBox({ ...newFeatureBox });

      successMessage = "Info Box added successfully";
      errorMessage = "Error adding Info Box";
    }
    sellerConfigDispatch(dispatchFunction);

    const [SUCCESS, _] = await persistFeatureBoxesChanges(
      copyLocalFeatureBoxes
    );
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
    setFeatureBoxes([...copyLocalFeatureBoxes]);
    setNewFeatureBox({
      id: uuidv4(),
      icon: "",
      heading: "",
      subheading: "",
      paragraph: "",
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
  const persistFeatureBoxesChanges = async (copyFeatureBoxes) => {
    const copySellerConfigs = { ...sellerConfigs };
    copySellerConfigs.UIConfig.FeatureBoxes.features = [...copyFeatureBoxes];

    const blob = getSellerConfigJsonBlob(copySellerConfigs);
    const [SUCCESS, ERROR] = await updateSellerConfigS3File(blob, "localhost");

    return [SUCCESS, ERROR];
  };

  /**
   * Function used to hide a widgtet. This function will update the widgets
   * deleted field in context.
   */
  const toggleDeletedStatus = () => {
    sellerConfigDispatch(toggleComponentDeletedStatus("FeatureBoxes"));
  };

  /**
   * Function triggered by the add and edit feature box state change. We use 2
   * way binding to target and update state for the fields that have changed.
   *
   * @param {object} event the object that will be used to update state
   */
  const handleFeatureBoxContentChange = (event) => {
    setNewFeatureBox({
      ...newFeatureBox,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Function triggered when delete infobox is clicked. Here we set the index of
   * the deleting infobox and open the confirm delete info box modal.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleDeleteFeatureBoxClicked = (index) => {
    setDeletingFeatureBox(index);
    setOpenConfirmDelete(true);
  };

  /**
   * Function used when add new info box is clicked. Here we set the init info box
   * and set editing to -1 and open the modal
   */
  const handleAddFeatureBoxClicked = () => {
    setNewFeatureBox({ ...newFeatureBox });
    setEditingFeatureBox(-1);
    setOpenFeatureBoxModal(true);
  };

  /**
   * Function used or call when the edit infobox is clicked. Here we open the
   * modal, set the editing info box and the index.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleEditFeatureBoxClicked = (index) => {
    setEditingFeatureBox(index);
    setNewFeatureBox({ ...featureBoxes[index] });
    setOpenFeatureBoxModal(true);
  };

  const handleCancelClicked = () => {
    setOpenFeatureBoxModal(false);
    setNewFeatureBox({
      id: uuidv4(),
      icon: "",
      heading: "",
      subheading: "",
      paragraph: "",
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        border: DELETED ? "1px #dc3545 solid" : "1px transparent solid",
      }}
      className={
        sellerConfigs.UserInfo.enableEditing
          ? `edit-box ${DELETED ? "deleted-edit-box" : "primary-edit-box"}`
          : ""
      }
    >
      <div
        className={sellerConfigs.Theme.IsContained ? "container" : ""}
        style={{
          padding: 0,
        }}
      >
        <EditBoxStrip isDeleted={DELETED} />
        {DELETED ? (
          <RestorationAfterDeleteToolBox restore={toggleDeletedStatus} />
        ) : (
          <ToolBox
            addDisabled={featureBoxes.length === 3}
            handleAdd={() => setOpenFeatureBoxModal(true)}
            addTooltip="Click to add a Feature-Box"
            hideTooltip="Click to hide Feature-Boxes container"
            handleDeleteComponent={toggleDeletedStatus}
          />
        )}
        {featureBoxes.length === 0 ? (
          <div className="feature-boxes-container">
            <FeatureBoxNoContent openAddInfoBox={handleAddFeatureBoxClicked} />
          </div>
        ) : (
          <section
            className="feature-boxes-container"
            style={{
              background: sellerConfigs.Theme.ColorPalette["Gray-60"],
            }}
          >
            <div
              style={{
                width: "100%",
                opacity: DELETED ? 0.7 : 1,
                pointerEvents: DELETED ? "none" : "auto",
                position: "relative",
              }}
            >
              <div className="container">
                <div className="row">
                  {featureBoxes.length &&
                    featureBoxes.map((item, index) => (
                      <div className="col-md-4" key={"feature" + index}>
                        <div className="feature-box px-sm-5 feature-box-simple text-center">
                          <i
                            className={item.icon}
                            style={{
                              color:
                                sellerConfigs.Theme.ColorPalette["Primary"],
                            }}
                          ></i>
                          <div className="feature-box-content">
                            <h3
                              className="m-b-3"
                              style={{
                                color:
                                  sellerConfigs.Theme.ColorPalette["Gray-10"],
                              }}
                            >
                              {item.heading}
                            </h3>
                            <h5
                              className="m-b-3"
                              style={{
                                color:
                                  sellerConfigs.Theme.ColorPalette["Gray-30"],
                              }}
                            >
                              {item.subheading}
                            </h5>
                            <p
                              style={{
                                color:
                                  sellerConfigs.Theme.ColorPalette["Gray-40"],
                              }}
                            >
                              {item.paragraph}
                            </p>
                            <ItemActions
                              deleteClicked={() =>
                                handleDeleteFeatureBoxClicked(index)
                              }
                              editClicked={() =>
                                handleEditFeatureBoxClicked(index)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      {openFeatureBoxModal && (
        <AddFeatureModal
          addingFeatureBox={editingFeatureBox === -1}
          state={newFeatureBox}
          handleChange={handleFeatureBoxContentChange}
          handleSave={handleSaveFeatureBoxClicked}
          handleCloseModal={handleCancelClicked}
        />
      )}
      {openConfirmDelete && (
        <ConfirmDelete
          cancel={() => setOpenConfirmDelete(false)}
          confirm={handleSaveFeatureBoxClicked}
          message="Are you sure you would like to delete this Feature Box from the Feature Box container permanantly?"
        />
      )}
    </div>
  );
};

export default FeatureBoxes;
