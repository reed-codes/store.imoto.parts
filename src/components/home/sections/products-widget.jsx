import React, { useState } from "react";
import ProductTypeFour, {
  ProductTypeFourPlaceholder,
} from "../../features/product/product-type-four";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../../utils";
import ToolBox from "./components/tool-box/tool-box";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { v4 as uuidv4 } from "uuid";
import { updateComponent } from "../../../action";
import EditProductColumnModal from "./components/products-widget/edit-product-column-modal";
import { DeleteConfirmationDialogue } from "./components/delete-confirmation-dialogue";
import { toast } from "react-toastify";

const INIT_COLUMN = {
  deleted: false,
  title: "",
  products: [],
  position: null,
};

export const COLUMN_TYPE = "COLUMN_TYPE";
export const COLUMN_PRODUCT_TYPE = "COLUMN_PRODUCT_TYPE";

const ProductsWidget = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [componentData, setCompontentData] = useState(
    getObjectDeepCopy(sellerConfigs.UIConfig.ProductsWidget)
  );
  const [currentColumn, setCurrentColumn] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    payload: null,
    needed: false,
  });

  const IS_DELETED = sellerConfigs.UIConfig.ProductsWidget.deleted;
  const MAXIMUM_COLUMN_COUNT_REACHED = componentData.columns.every((col) =>
    Boolean(col.title)
  );

  const handleCloseSlidesEditor = () => setCurrentColumn(null);

  const handleAddNewColumn = () => {
    const emptyColumns = componentData.columns.filter((col) => !col.title);
    handleSetCurrentColumn(null, emptyColumns[0].position);
  };

  const handleSetCurrentColumn = (column, pos) => {
    if (column) {
      setCurrentColumn(column);
    } else if (pos >= 0) {
      setCurrentColumn({
        ...INIT_COLUMN,
        position: pos,
      });
    }
  };

  const handleSetDeleteConfirmation = (payload) => {
    setDeleteConfirmation({
      payload: payload,
      needed: true,
    });
  };

  const handleUnsetSetDeleteConfirmation = () => {
    setDeleteConfirmation({
      payload: null,
      needed: false,
    });
  };

  const updateColumn = (col) => {
    let updatedProductWidget = null;
    if (col.position >= 0) {
      updatedProductWidget = {
        ...componentData,
        columns: componentData.columns.map((column, index) => {
          if (col.position === index) return col;
          else return column;
        }),
      };
      setCompontentData(updatedProductWidget);
    } else {
      updatedProductWidget = {
        ...componentData,
        columns: componentData.columns.map((column, index) => {
          if (index === 0) return col;
          else return column;
        }),
      };
      setCompontentData(updatedProductWidget);
    }
    handleUnsetSetDeleteConfirmation();
    persistChangesToS3(updatedProductWidget);
  };

  const handleDeleteAttribute = () => {
    let updatedProductWidget = null;

    if (deleteConfirmation.payload.type === COLUMN_TYPE) {
      updatedProductWidget = {
        ...componentData,
        columns: componentData.columns.map((column) => {
          if (column.position === deleteConfirmation.payload.column.position) {
            return {
              ...column,
              title: "",
              products: [],
            };
          } else return column;
        }),
      };
      setCompontentData(updatedProductWidget);
    } else if (deleteConfirmation.payload.type === COLUMN_PRODUCT_TYPE) {
      updatedProductWidget = {
        ...componentData,
        columns: componentData.columns.map((column) => {
          if (deleteConfirmation.payload.position === column.position) {
            return {
              ...column,
              products: column.products.filter(
                (product) => product.ProductID === deleteConfirmation.payload.Id
              ),
            };
          } else return column;
        }),
      };
      setCompontentData(updatedProductWidget);
    }
    handleUnsetSetDeleteConfirmation();
    persistChangesToS3(updatedProductWidget);
  };

  const persistChangesToS3 = async (updatedProductWidget) => {
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        ProductsWidget: {
          ...updatedProductWidget,
          deleted: IS_DELETED,
        },
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, _] = await updateSellerConfigS3File(
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
            ...componentData,
            deleted: IS_DELETED,
          },
          component: "ProductsWidget",
        })
      );
    }
  };

  const toggleDeletedStatus = async () => {
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        ProductsWidget: {
          ...componentData,
          deleted: !IS_DELETED,
        },
      },
    };

    sellerConfigDispatch(
      updateComponent({
        data: {
          ...componentData,
          deleted: !IS_DELETED,
        },
        component: "ProductsWidget",
      })
    );

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );
  };
  const ALL_COLUMNS_ARE_EMPTY = componentData.columns.every(
    (col) => !Boolean(col.title) && !Boolean(col.products.length)
  );

  return (
    <>
      <div
        style={{
          position: "relative",
          transform: "translate(0,0)",
          border: sellerConfigs.UserInfo.enableEditing
            ? IS_DELETED
              ? `1px #dc3545 solid`
              : `1px transparent solid`
            : "",
          width: "100%",
          marginBottom: 0,
          marginTop: 25,
          display:
            ALL_COLUMNS_ARE_EMPTY && !sellerConfigs.UserInfo.enableEditing
              ? "none"
              : "block",
        }}
        className={`edit-box p-0 ${
          sellerConfigs.UserInfo.enableEditing
            ? IS_DELETED
              ? "deleted-edit-box"
              : "primary-edit-box"
            : ""
        }`}
      >
        {IS_DELETED ? (
          <RestorationAfterDeleteToolBox restore={toggleDeletedStatus} />
        ) : (
          <ToolBox
            handleDeleteComponent={toggleDeletedStatus}
            handleAdd={MAXIMUM_COLUMN_COUNT_REACHED ? null : handleAddNewColumn}
            addTooltip={"Add new product column"}
          />
        )}
        <EditBoxStrip isDeleted={IS_DELETED} />

        <section
          style={{
            padding: "25px 10px 20px",
          }}
        >
          <div className="container">
            <div className="product-widgets-container row mb-2 pb-2">
              {componentData.columns.map((col, index) => {
                if (col.title) {
                  return (
                    <ProductColumn
                      key={uuidv4()}
                      column={col}
                      handleSetDeleteConfirmation={handleSetDeleteConfirmation}
                      setCurrentColumn={handleSetCurrentColumn}
                      updateColumn={updateColumn}
                    />
                  );
                } else {
                  if (sellerConfigs.UserInfo.enableEditing) {
                    return (
                      <ProductColumnPlaceholder
                        key={uuidv4()}
                        position={index}
                        column={col}
                        setCurrentColumn={handleSetCurrentColumn}
                      />
                    );
                  } else {
                    return null;
                  }
                }
              })}
            </div>
          </div>
        </section>
      </div>

      {currentColumn && (
        <EditProductColumnModal
          close={handleCloseSlidesEditor}
          column={currentColumn}
          updateColumn={updateColumn}
        />
      )}

      {deleteConfirmation.needed && (
        <DeleteConfirmationDialogue
          message={
            deleteConfirmation.payload.Id
              ? "Are you sure you want to remove product from column ?"
              : "Are you sure you want to delete column ?"
          }
          cancel={handleUnsetSetDeleteConfirmation}
          confirm={handleDeleteAttribute}
        />
      )}
    </>
  );
};

const ProductColumn = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [title, setTitle] = useState(props.column.title);
  const handleTitleChange = (e) => {
    setTitle(e.target.value.toUpperCase());
  };

  const commitNewTitle = () => {
    if (title === props.column.title) return;

    let updatedCol = {
      ...props.column,
      title,
    };

    props.updateColumn(updatedCol);
  };

  return (
    <>
      <div
        className="col-lg-3 col-sm-6 pb-5 pb-md-0"
        style={{
          position: "relative",
        }}
      >
        <ColumnTitle
          title={title}
          handleTitleChange={handleTitleChange}
          commitNewTitle={commitNewTitle}
        />

        {props.column.products.map((item, i) => (
          <ProductTypeFour
            addClass=" left-details product-widget"
            product={item}
            key={uuidv4()}
          />
        ))}

        {!Boolean(props.column.products.length) && (
          <>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#004084"
                className="bi bi-bag mr-1"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
              </svg>

              <span>No products to display</span>
            </div>
            <ProductTypeFourPlaceholder addClass="left-details product-widget" />
            <ProductTypeFourPlaceholder addClass="left-details product-widget" />
            <ProductTypeFourPlaceholder addClass="left-details product-widget" />
          </>
        )}

        {sellerConfigs.UserInfo.enableEditing && (
          <ColumnOptions
            handleSetDeleteConfirmation={props.handleSetDeleteConfirmation}
            column={props.column}
            setCurrentColumn={() => props.setCurrentColumn(props.column, null)}
          />
        )}
      </div>
    </>
  );
};

const ColumnOptions = (props) => {
  return (
    <div
      style={{
        width: "100%",
        position: "absolute",
        zIndex: 15,
        bottom: -40,
        marginTop: 15,
        display: "flex",
        justifyContent: "center",
      }}
      className={"appear-on-hover-item-action-container"}
    >
      <div
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden !important",
        }}
        className="tool-box-option"
        onClick={props.setCurrentColumn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#0088cb"
          className="bi bi-pencil-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </div>
      <div
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden !important",
        }}
        className="tool-box-option"
        onClick={() =>
          props.handleSetDeleteConfirmation({
            type: COLUMN_TYPE,
            column: props.column,
          })
        }
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
      </div>
    </div>
  );
};

const ProductColumnPlaceholder = (props) => {
  return (
    <>
      <div
        className="col-lg-3 col-sm-6 pb-5 pb-md-0"
        style={{
          position: "relative",
        }}
      >
        <h4
          className="section-sub-title mb-2"
          style={{
            width: "100%",
            opacity: 0.2,
            height: 27,
          }}
        >
          Column Title
        </h4>

        <div>
          <ProductTypeFourPlaceholder addClass="left-details product-widget" />
          <ProductTypeFourPlaceholder addClass="left-details product-widget" />
          <ProductTypeFourPlaceholder addClass="left-details product-widget" />
        </div>

        <div
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              height: 84,
              width: 84,
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="shadow-sm"
          >
            <button
              className="btn btn-outline-secondary"
              style={{
                padding: 0,
                height: "100%",
                width: "100%",
              }}
              title="Add a product column"
              onClick={() => props.setCurrentColumn(null, props.position)}
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
          </div>
        </div>
      </div>
    </>
  );
};

const ColumnTitle = (props) => {
  const [editingSectionTitle, setIsEditingSectionTitle] = useState(false);
  const { sellerConfigs } = useSellerConfig();

  const handleSectionTitleEditorOpen = () => {
    if (sellerConfigs.UserInfo.enableEditing) {
      setIsEditingSectionTitle(true);
    }
  };

  const handleSectionTitleEditorClose = () => {
    props.commitNewTitle();
    setIsEditingSectionTitle(false);
  };

  return (
    <>
      {editingSectionTitle ? (
        <form
          style={{
            padding: 0,
            margin: 0,
            position: "relative",
            zIndex: 15,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSectionTitleEditorClose();
          }}
          className="mb-2"
        >
          <input
            type="text"
            style={{
              lineHeight: "1.35",
              color: sellerConfigs.Theme.ColorPalette["Gray-10"],
              background: sellerConfigs.Theme.ColorPalette["Body"],
              fontWeight: 700,
              fontSize: "16px",
              fontFamily: "Poppins,sans-serif",
              outline: "0",
              border: "none",
              padding: 0,
              minHeight: 27,
            }}
            onChange={props.handleTitleChange}
            value={props.title}
            autoFocus={true}
            onBlur={handleSectionTitleEditorClose}
            className="section-sub-title"
          />
        </form>
      ) : (
        <h4
          className="section-sub-title mb-2"
          onClick={handleSectionTitleEditorOpen}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 15,
            color: sellerConfigs.Theme.ColorPalette["Gray-10"],
            background: sellerConfigs.Theme.ColorPalette["Body"],
          }}
        >
          {props.title}

          {sellerConfigs.UserInfo.enableEditing && (
            <div
              style={{
                height: 27,
                width: 27,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                marginLeft: 3,
              }}
              className={"appear-on-hover-item-action-container"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="rgb(8, 136, 203)"
                className="bi bi-pencil-fill"
                viewBox="0 0 16 16"
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
            </div>
          )}
        </h4>
      )}
    </>
  );
};

export default ProductsWidget;
