import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useSellerConfig } from "../../../../../../store/sellerConfigContext";
import { DeleteConfirmationDialogue } from "../../../../../home/sections/components/delete-confirmation-dialogue";
import { toast } from "react-toastify";

const EditFooterSocialMediaModalContent = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    index: null,
    needed: false,
  });
  const [column, setColumn] = useState(
    sellerConfigs.UIConfig.Footer.columns[0]
  );
  const [newItem, setNewItem] = useState({
    label: "",
    value: "",
  });

  const IS_EDITED =
    JSON.stringify(column) !==
      JSON.stringify(sellerConfigs.UIConfig.Footer.columns[0]) ||
    Boolean(newItem.label) ||
    Boolean(newItem.value);

  useEffect(() => {
    if (column.itemList.length === 0) setAddingNewItem(true);
  }, [column.itemList]);

  const handleTitleChange = (e) => {
    setColumn({
      ...column,
      title: e.target.value,
    });
  };

  const handleEnableNewItemAdditionMode = () => {
    if (addingNewItem && !newItem.label && !newItem.value) {
      const newItemRow = document.querySelector("#new-item-row");
      const labelInput = newItemRow.getElementsByTagName("input")[0];
      labelInput.focus();
    } else if (newItem.label || newItem.value) {
      setColumn({
        ...column,
        itemList: [...column.itemList, newItem],
      });
      setNewItem({
        label: "",
        value: "",
      });
    } else {
      setAddingNewItem(true);
    }
  };

  const handleDisableNewItemAdditionMode = () => {
    setAddingNewItem(false);
    setNewItem({
      label: "",
      value: "",
    });
  };

  const handleNewItemPropertyChange = (property, val) => {
    setNewItem({
      ...newItem,
      [property]: val,
    });
  };

  const handlePropertyChange = (property, val, i) => {
    const newItemList = [...column.itemList];
    const updatedObject = {
      ...newItemList[i],
      [property]: val,
    };
    newItemList[i] = updatedObject;

    setColumn({
      ...column,
      itemList: newItemList,
    });
  };

  const handleSetDeleteConfirmation = (i) => {
    setDeleteConfirmation({
      index: i,
      needed: true,
    });
  };

  const handleUnsetSetDeleteConfirmation = () => {
    setDeleteConfirmation({
      index: null,
      needed: false,
    });
  };

  const handleRemoveListItem = () => {
    const newItemList = [];
    for (let i = 0; i < column.itemList.length; i++) {
      if (deleteConfirmation.index !== i) newItemList.push(column.itemList[i]);
    }
    setColumn({
      ...column,
      itemList: newItemList,
    });
    handleUnsetSetDeleteConfirmation();
  };

  const handleSave = () => {
    const WAS_ADDING_NEW_ITEM_BUT_ENTERED_NO_VALUES = Boolean(
      addingNewItem && !newItem.label && !newItem.value && (column.itemList.length !== 0)
    );
    const AT_LEAST_ONE_OF_THE_FIELDS_OF_NEW_ITEM_IS_FILLED = Boolean(
      newItem.label || newItem.value
    );

    if (WAS_ADDING_NEW_ITEM_BUT_ENTERED_NO_VALUES) {
      handleDisableNewItemAdditionMode();
      toast.warning("No changes detected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      return;
    } else if (AT_LEAST_ONE_OF_THE_FIELDS_OF_NEW_ITEM_IS_FILLED) {
      const updatedItemList = [...column.itemList, newItem];
      const updatedCol = {
        ...column,
        itemList: updatedItemList,
      };
      props.save(updatedCol, 0);
      props.close();
    } else if (IS_EDITED) {
      props.save(column, 0);
      props.close();
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
      <div
        style={{
          width: "100%",
          minHeight: 260,
        }}
      >
        <div
          style={{
            width: "100%",
            borderBottom: "1px #efefef solid",
            padding: "10px 0 10px 0",
          }}
        >
          <input
            type="text"
            className="form-control section-sub-title"
            placeholder="type column title here."
            style={{
              textAlign: "center",
              fontWeight: "700",
            }}
            onChange={handleTitleChange}
            value={column.title}
          />
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: 0,
                }}
              >
                #
              </th>

              <th scope="col">
                <span
                  style={{
                    position: "relative",
                    top: -3,
                  }}
                >
                  Labels
                </span>
              </th>

              <th scope="col">Value</th>

              <th
                scope="col"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: 0,
                }}
              >
                <AddNewItemButton
                  handleEnableNewItemAdditionMode={
                    handleEnableNewItemAdditionMode
                  }
                  addingNewItem
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {column.itemList.map((item, i) => {
              return (
                <tr key={"row-" + i}>
                  <td scope="row">
                    <div
                      style={{
                        height: 58,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <input
                      value={item.label}
                      onChange={(e) =>
                        handlePropertyChange("label", e.target.value, i)
                      }
                      className="form-control m-0"
                      style={{
                        height: "100%",
                        width: "100%",
                        background: "transparent",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={item.value}
                      onChange={(e) =>
                        handlePropertyChange("value", e.target.value, i)
                      }
                      className="form-control m-0"
                      style={{
                        height: "100%",
                        width: "100%",
                        background: "transparent",
                      }}
                    />
                  </td>

                  <td>
                    <span
                      style={{
                        width: "100%",
                        height: 58,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        className="btn btn-danger"
                        style={{
                          height: 30,
                          width: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          borderRadius: 3,
                          background: "transparent",
                        }}
                        onClick={() => handleSetDeleteConfirmation(i)}
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="red"
                          viewBox="0 0 16 16"
                          className="bi bi-trash-fill"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}

            {addingNewItem && (
              <tr
                className="animate__animated animate__headShake"
                id="new-item-row"
              >
                <td scope="row">
                  <div
                    style={{
                      height: 58,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {column.itemList.length + 1}
                  </div>
                </td>
                <td>
                  <input
                    autoFocus={true}
                    value={newItem.label}
                    placeholder={"e.g. ADDRESS"}
                    onChange={(e) =>
                      handleNewItemPropertyChange("label", e.target.value)
                    }
                    className="form-control m-0"
                    style={{
                      height: "100%",
                      width: "100%",
                      background: "transparent",
                      color: "#fff",
                    }}
                  />
                </td>
                <td
                  style={{
                    position: "relative",
                  }}
                >
                  <input
                    value={newItem.value}
                    placeholder={"e.g. 123 Street Name, City, England"}
                    onChange={(e) =>
                      handleNewItemPropertyChange("value", e.target.value)
                    }
                    className="form-control m-0"
                    style={{
                      height: "100%",
                      width: "100%",
                      background: "transparent",
                      color: "#fff",
                    }}
                  />
                </td>

                <td>
                  <span
                    style={{
                      width: "100%",
                      height: 58,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn btn-danger"
                      style={{
                        height: 30,
                        width: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        borderRadius: 3,
                        background: "transparent",
                        color: "#ff0200",
                      }}
                      onClick={handleDisableNewItemAdditionMode}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="red"
                        viewBox="0 0 16 16"
                        className="bi bi-trash-fill"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </button>
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
            You can add a new list item by clicking on the <b>plus (+)</b> sign
          </div>
        </div>

        <ModalActions
          save={handleSave}
          close={props.close}
          edited={IS_EDITED}
        />
      </div>

      {deleteConfirmation.needed && (
        <DeleteConfirmationDialogue
          message={"Are you sure you want to delete this list item ?"}
          cancel={handleUnsetSetDeleteConfirmation}
          confirm={handleRemoveListItem}
        />
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
        background: "transparent",
      }}
      onClick={props.handleEnableNewItemAdditionMode}
      data-tip
      data-for="add-new-image-option"
    >
      <ReactTooltip
        place="left"
        id="add-new-image-option"
        effect="solid"
        type="info"
      >
        Add new item
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

const ModalActions = (props) => {
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
            onClick={props.close}
          >
            Cancle
          </button>

          <button
            className={`btn ${
              props.edited ? "animate__animated animate__bounce" : ""
            } btn-outline-primary btn-sm mr-2 rounded button-white-backdrop`}
            style={{
              position: "relative",
              opacity: props.edited ? 1 : 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              borderColor: "#08C",
              minWidth: 150,
              zIndex: 10,
            }}
            onClick={props.save}
          >
            {!props.edited && (
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

export default EditFooterSocialMediaModalContent;
