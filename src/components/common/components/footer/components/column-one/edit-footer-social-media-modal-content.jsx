import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useSellerConfig } from "../../../../../../store/sellerConfigContext";
import { DeleteConfirmationDialogue } from "../../../../../home/sections/components/delete-confirmation-dialogue";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import DndListOrderController from "./components/dnd-slides-reorder/dnd-list-order-controller";
import { SOCIAL_MEDIA_OPTIONS } from "../../../../../../utils/social-media-options";

const INIT_SOCIAL_MEDIA_OPTION = {
  id: uuidv4(),
  name: "Instagram",
  icon: `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    fill="#fff"
    className="bi bi-instagram"
    viewBox="0 0 16 16"
  >
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
  </svg>`,
  hyperlink: "",
};

const EditFooterListModalContent = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [column, setColumn] = useState(
    sellerConfigs.UIConfig.Footer.columns[0]
  );
  const [currentSocialMediaOption, setCurrentSocialMediaOption] = useState(
    column.socialMediaOptions.length
      ? column.socialMediaOptions[currentOptionIndex]
      : INIT_SOCIAL_MEDIA_OPTION
  );
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [addingNewSocialMediaOption, setAddingNewSocialMediaOption] = useState(
    column.socialMediaOptions.length ? false : true
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const IS_EDITED =
    JSON.stringify(column) !==
    JSON.stringify(sellerConfigs.UIConfig.Footer.columns[0]);
  const IS_FIRST_SLIDE = currentOptionIndex === 0;
  const IS_LAST_SLIDE =
    currentOptionIndex === column.socialMediaOptions.length - 1;

  useEffect(() => {
    if (column.socialMediaOptions.length) {
      setCurrentSocialMediaOption(
        column.socialMediaOptions[currentOptionIndex]
      );
    }
  }, [currentOptionIndex]);

  const handleNext = () => {
    if (!IS_LAST_SLIDE) setCurrentOptionIndex(currentOptionIndex + 1);
    else setCurrentOptionIndex(0);
  };

  const handlePrev = () => {
    if (!IS_FIRST_SLIDE) setCurrentOptionIndex(currentOptionIndex - 1);
    else setCurrentOptionIndex(column.socialMediaOptions.length - 1);
  };

  const handleChangeSlideIndex = (e) => setCurrentOptionIndex(Number(e.currentTarget.id));

  const handleSetCurrentSocialMediaOptionToDefault = (col) => {
    const options = col ? col.socialMediaOptions : column.socialMediaOptions;

    if (options.length) {
      if (options[currentOptionIndex])
        setCurrentSocialMediaOption(options[currentOptionIndex]);
      else setCurrentSocialMediaOption(options[currentOptionIndex - 1]);
    } else {
      setCurrentSocialMediaOption(INIT_SOCIAL_MEDIA_OPTION);
      setAddingNewSocialMediaOption(true);
    }
  };

  const handleEnableNewSocialMediaOptionAdditionMode = () => {
    setAddingNewSocialMediaOption(true);
    setCurrentSocialMediaOption(INIT_SOCIAL_MEDIA_OPTION);
  };

  const handleDisableNewSocialMediaOptionAdditionMode = (col) => {
    const options = col ? col.socialMediaOptions : column.socialMediaOptions;

    if (options.length) {
      setAddingNewSocialMediaOption(false);
      handleSetCurrentSocialMediaOptionToDefault(col);
    } else {
      props.close();
    }
  };

  const handleSetCurrentSocialMediaOption = (option, index) => {
    setCurrentSocialMediaOption(option);
    if (index !== undefined) setCurrentOptionIndex(index);
  };

  const handleHyperlinkChange = (e, IS_NEW_ITEM) => {
    const updatedCurrentOption = {
      ...currentSocialMediaOption,
      hyperlink: e.target.value,
    };
    setCurrentSocialMediaOption(updatedCurrentOption);

    if (!IS_NEW_ITEM)
      handleUpdateThisCurrentOptionInSocialMediaOptionsArr(
        updatedCurrentOption
      );
  };

  const handleIconChange = (e, IS_NEW_ITEM) => {
    const icon_name = e.target.value;
    const current_icon_svg = SOCIAL_MEDIA_OPTIONS.find(
      (option) => option.name === icon_name
    ).icon;

    const updatedCurrentOption = {
      ...currentSocialMediaOption,
      name: icon_name,
      icon: current_icon_svg,
    };

    setCurrentSocialMediaOption(updatedCurrentOption);

    if (!IS_NEW_ITEM)
      handleUpdateThisCurrentOptionInSocialMediaOptionsArr(
        updatedCurrentOption
      );
  };

  const handleUpdateThisCurrentOptionInSocialMediaOptionsArr = (
    updatedCurrentOption
  ) => {
    const updatedCol = {
      ...column,
      socialMediaOptions: column.socialMediaOptions.map((option, index) => {
        if (index === currentOptionIndex) return updatedCurrentOption;
        else return option;
      }),
    };
    setCurrentSocialMediaOption(updatedCurrentOption);
    setColumn(updatedCol);
  };

  const handleAddNewSocialMediaOption = () => {
    const updatedCol = {
      ...column,
      socialMediaOptions: [
        ...column.socialMediaOptions,
        currentSocialMediaOption,
      ],
    };
    setColumn(updatedCol);
    handleDisableNewSocialMediaOptionAdditionMode(updatedCol);
    handleSetCurrentSocialMediaOptionToDefault(updatedCol);
  };

  const handleSetReOrdered = (list) => {
    setColumn({
      ...column,
      socialMediaOptions: list,
    });
  };

  const handleEnableDeleteConfirmation = (i) => {
    setDeleteConfirmation(true);
  };

  const handleDisableDeleteConfirmation = () => {
    setDeleteConfirmation(false);
  };

  const handleRemoveListItem = () => {
    const updatedCol = {
      ...column,
      socialMediaOptions: column.socialMediaOptions.filter(
        (option, i) => i !== currentOptionIndex
      ),
    };

    if (updatedCol.socialMediaOptions.length === 0) {
      const PREVENT_MODAL_CLOSE = true;
      handleSave(updatedCol, PREVENT_MODAL_CLOSE);
    }
    setColumn(updatedCol);
    handleSetCurrentSocialMediaOptionToDefault(updatedCol);
    handleDisableDeleteConfirmation();
  };

  const handleSocialMediaOptionDelete = () => {
    handleEnableDeleteConfirmation();
  };

  const handleSave = (updatedCol, PREVENT_MODAL_CLOSE) => {
    const col = updatedCol ? updatedCol : column;

    if (IS_EDITED) {
      props.save(col, 0);
      if (!PREVENT_MODAL_CLOSE) props.close();
    } else {
      toast.warning("No changes detected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      {addingNewSocialMediaOption ? (
        <AddNewSocialMediaOptionContent
          currentSocialMediaOption={currentSocialMediaOption}
          handleIconChange={handleIconChange}
          handleHyperlinkChange={handleHyperlinkChange}
          handleAddNewSocialMediaOption={handleAddNewSocialMediaOption}
          handleDisableNewSocialMediaOptionAdditionMode={
            handleDisableNewSocialMediaOptionAdditionMode
          }
        />
      ) : (
        <EditSocialMediaOptionsContent
          currentSocialMediaOption={currentSocialMediaOption}
          handleIconChange={handleIconChange}
          currentOptionIndex={currentOptionIndex}
          IS_FIRST_SLIDE={IS_FIRST_SLIDE}
          IS_LAST_SLIDE={IS_LAST_SLIDE}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleChangeSlideIndex={handleChangeSlideIndex}
          handleDelete={handleSocialMediaOptionDelete}
          handleHyperlinkChange={handleHyperlinkChange}
          handleEnableNewSocialMediaOptionAdditionMode={
            handleEnableNewSocialMediaOptionAdditionMode
          }
          socialMediaOptions={column.socialMediaOptions}
          handleSetReOrdered={handleSetReOrdered}
          handleSetCurrentSocialMediaOption={handleSetCurrentSocialMediaOption}
          handleEnableDeleteConfirmation={handleEnableDeleteConfirmation}
          handleSave={handleSave}
          IS_EDITED={IS_EDITED}
        />
      )}
      {/*  */}
      {deleteConfirmation && (
        <DeleteConfirmationDialogue
          message={`Are you sure you want to remove ${currentSocialMediaOption.name} from list ?`}
          cancel={handleDisableDeleteConfirmation}
          confirm={handleRemoveListItem}
        />
      )}
    </>
  );
};

const AddNewSocialMediaOptionContent = (props) => {
  return (
    <>
      <div style={{ width: "100%" }}>
        <h5
          style={{
            marginBottom: 0,
            lineHeight: 1.5,
            fontSize: "20px",
            position: "absolute",
            top: 15,
            left: 30,
            zIndex: 1010,
            color: "#706f6c",
            cursor: "default",
          }}
        >
          Add New Social Media Link
        </h5>

        <div
          style={{
            marginTop: 15,
            width: "100%",
            background: "#EDEDED",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                height: 160,
                width: 160,
                minWidth: 160,
                background: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "5px #EDEDED solid",
                borderRight: 0,
                borderColor: "1px solid #dfdfdf",
              }}
              className="p-2 social-media-modal-current-icon-wrapper"
              id="current-svg-container"
              dangerouslySetInnerHTML={{
                __html: props.currentSocialMediaOption.icon,
              }}
            />

            <div
              style={{
                height: 160,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              className="p-2"
            >
              <select
                className="form-control m-0 mb-1"
                type="text"
                value={props.currentSocialMediaOption.name}
                onChange={(e) => props.handleIconChange(e, "NEW_ITEM")}
              >
                {SOCIAL_MEDIA_OPTIONS.map((option) => {
                  return (
                    <option value={option.name} key={uuidv4()}>
                      {option.name}
                    </option>
                  );
                })}
              </select>

              <div className="form-group">
                <input
                  className="form-control m-0"
                  type="text"
                  value={props.currentSocialMediaOption.hyperlink}
                  onChange={(e) => props.handleHyperlinkChange(e, "NEW_ITEM")}
                  placeholder="Paste hyperlink here."
                  aria-describedby="hyperlink-help"
                  autoFocus={true}
                />
                <small id="hyperlink-help" className="form-text text-muted">
                  Enter the link to the social media account.
                </small>
              </div>
            </div>
          </div>
        </div>

        <div
          className="alert alert-primary d-flex align-items-center"
          role="alert"
          style={{
            marginTop: 10,
            marginBottom: "1rem",
            fontSize: "1.2rem",
            minHeight: "59px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#004085"
            className="bi bi-info-circle-fill"
            viewBox="0 0 16 16"
            style={{ marginRight: 10 }}
          >
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          <div>
            <b>Select</b> the desired social media link from the drop-down then
            subsequently enter the URL linking to the social media account
          </div>
        </div>

        <AddNewOptionActions
          add={props.handleAddNewSocialMediaOption}
          close={props.handleDisableNewSocialMediaOptionAdditionMode}
        />
      </div>
    </>
  );
};

const EditSocialMediaOptionsContent = (props) => {
  return (
    <>
      {props.currentSocialMediaOption && (
        <>
          <div
            style={{
              width: "100%",
              marginBottom: 3,
            }}
          >
            <AddNewItemButton
              enableNewSocialMediaOptionAdditionMode={
                props.handleEnableNewSocialMediaOptionAdditionMode
              }
              disableNewSocialMediaOptionAdditionMode={
                props.handleDisableNewSocialMediaOptionAdditionMode
              }
            />

            <div
              style={{
                marginTop: 15,
                width: "100%",
                background: "#EDEDED",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    height: 160,
                    width: 160,
                    minWidth: 160,
                    background: "#fff",
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "5px #e6e6e6 solid",
                    borderRight: 0,
                  }}
                  className="p-2 social-media-modal-current-icon-wrapper"
                  dangerouslySetInnerHTML={{
                    __html: props.currentSocialMediaOption.icon,
                  }}
                />

                <div
                  style={{
                    height: 160,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className="p-2"
                >
                  <select
                    className="form-control m-0 mb-1"
                    type="text"
                    value={props.currentSocialMediaOption.name}
                    onChange={props.handleIconChange}
                  >
                    {SOCIAL_MEDIA_OPTIONS.map((option) => {
                      return (
                        <option value={option.name} key={uuidv4()}>
                          {option.name}
                        </option>
                      );
                    })}
                  </select>

                  <div className="form-group">
                    <input
                      className="form-control m-0"
                      type="text"
                      value={props.currentSocialMediaOption.hyperlink}
                      onChange={props.handleHyperlinkChange}
                      placeholder="Paste hyperlink here."
                      aria-describedby="hyperlink-help"
                      autoFocus={true}
                    />
                    <small id="hyperlink-help" className="form-text text-muted">
                      Enter the link to the social media account.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="alert alert-primary d-flex align-items-center"
              role="alert"
              style={{
                marginTop: 10,
                marginBottom: "1rem",
                fontSize: "1.2rem",
                minHeight: "59px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#004085"
                className="bi bi-info-circle-fill"
                viewBox="0 0 16 16"
                style={{ marginRight: 10 }}
              >
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              <div>
                You can add a new social media link option by clicking on the{" "}
                <b>plus (+)</b> sign
              </div>
            </div>

            <div>
              <DndListOrderController
                options={props.socialMediaOptions}
                reorder={props.handleSetReOrdered}
                setCurrentSocialMediaOption={
                  props.handleSetCurrentSocialMediaOption
                }
              />
            </div>

            <SaveChangesActions
              save={props.handleSave}
              handleDelete={props.handleDelete}
              IS_EDITED={props.IS_EDITED}
            />
          </div>

          <Pagination
            options={props.socialMediaOptions}
            currentOptionIndex={props.currentOptionIndex}
            IS_FIRST_SLIDE={props.IS_FIRST_SLIDE}
            IS_LAST_SLIDE={props.IS_LAST_SLIDE}
            handleNext={props.handleNext}
            handlePrev={props.handlePrev}
            handleChangeOption={props.handleChangeOptionIndex}
          />
        </>
      )}
    </>
  );
};

const AddNewItemButton = (props) => {
  return (
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
      onClick={props.enableNewSocialMediaOptionAdditionMode}
      data-tip
      data-for="add-new-image-option"
    >
      <ReactTooltip
        place="right"
        id="add-new-image-option"
        effect="solid"
        type="info"
      >
        Add new social media link
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
              {props.currentOptionIndex + 1}
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
            id={props.options.length - 1}
            onClick={props.handleChangeOption}
          >
            <button
              className="page-link btn btn-outline-primary btn-sm"
              style={{
                color: props.IS_LAST_SLIDE ? "#0088cb" : "#777",
                borderColor: props.IS_LAST_SLIDE ? "#0088cb" : "#ccc",
              }}
            >
              {props.options.length}
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

const AddNewOptionActions = (props) => {
  return (
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
            onClick={() => props.close()}
          >
            Cancle
          </button>

          <button
            className={`btn btn-outline-primary btn-sm mr-2 rounded`}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              borderColor: "#08C",
              minWidth: 150,
            }}
            onClick={props.add}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const SaveChangesActions = (props) => {
  return (
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
            onClick={props.handleDelete}
          >
            Delete
          </button>

          <button
            className={`btn ${
              props.IS_EDITED ? "animate__animated animate__bounce" : ""
            } btn-outline-primary btn-sm mr-2 rounded button-white-backdrop`}
            style={{
              position: "relative",
              opacity: props.IS_EDITED ? 1 : 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              borderColor: "#08C",
              minWidth: 150,
              zIndex: 10,
            }}
            onClick={() => props.save()}
          >
            {!props.IS_EDITED && (
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFooterListModalContent;
