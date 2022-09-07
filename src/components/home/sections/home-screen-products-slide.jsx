import React, { useState } from "react";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import ToolBox from "./components/tool-box/tool-box";
import Carousel from "../../features/carousel";
import { owlSetting2 } from "../../../utils/settings";
import NewProductSliderModal from "./components/new-products-slider/add-new-product-modal";
import EditProductSliderModal from "./components/new-products-slider/edit-product-modal";
import Product from "./components/new-products-slider/product";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { updateComponent } from "../../../action";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../../utils";
import { DeleteConfirmationDialogue } from "./components/delete-confirmation-dialogue";

function HomeScreenProductsSlide(props) {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [openProductEditor, setOpenProductEditor] = useState({
    state: false,
    product: null,
  });
  const [openNewProductAdder, setOpenNewProductAdder] = useState(false);
  const [editingSectionTitle, setisEditingSectionTitle] = useState(false);
  const [componentData, setCompontentData] = useState(
    sellerConfigs.UIConfig[props.component]
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    payload: null,
    needed: false,
  });

  const IS_DELETED = sellerConfigs.UIConfig[props.component].deleted;

  const noProductsAndisCustomer =
    componentData.products.length === 0 &&
    !sellerConfigs.UserInfo.enableEditing;

  const handleSectionTitleEditorOpen = () => {
    setisEditingSectionTitle(true);
  };

  const handleSectionTitleEditorClose = () => {
    setisEditingSectionTitle(false);

    const IS_MODIFIED =
      componentData.title !== sellerConfigs.UIConfig[props.component].title;

    if (IS_MODIFIED) persistChangesToS3(componentData);
  };

  const handleTitleChange = (e) => {
    setCompontentData({
      ...componentData,
      title: e.target.value.toUpperCase(),
    });
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

  const handleOpenProductAdder = () => {
    setOpenNewProductAdder(true);
  };
  const handleCloseProductAdder = () => setOpenNewProductAdder(false);
  const handleOpenProductEditor = (product) => {
    setOpenProductEditor({
      state: true,
      product,
    });
  };

  const handleCloseProductEditor = () => {
    setOpenProductEditor({
      state: false,
      product: null,
    });
  };

  const handleAddProduct = (product) => {
    let updatedComponent = null;
    if (product.SliderID) {
      updatedComponent = {
        ...componentData,
        products: componentData.products.map((item) => {
          if (product.SliderID === item.SliderID) {
            return product;
          } else return item;
        }),
      };
    } else {
      const newProduct = {
        ...product,
        SliderID: uuidv4(),
      };

      updatedComponent = {
        ...componentData,
        products: [...componentData.products, newProduct],
      };
    }

    const IS_MODIFIED =
      JSON.stringify(updatedComponent.products) !==
      JSON.stringify(sellerConfigs.UIConfig[props.component].products);

    handleCloseProductAdder();
    handleCloseProductEditor();

    if (IS_MODIFIED) {
      setCompontentData(updatedComponent);
      persistChangesToS3(updatedComponent);
    }
  };

  const handleDeleteProduct = () => {
    let updatedComponent = {
      ...componentData,
      products: componentData.products.filter(
        (product) => product.SliderID !== deleteConfirmation.payload.SliderID
      ),
    };

    handleUnsetSetDeleteConfirmation();

    const IS_MODIFIED =
      JSON.stringify(updatedComponent.products) !==
      JSON.stringify(sellerConfigs.UIConfig[props.component].products);

    if (IS_MODIFIED) {
      setCompontentData(updatedComponent);
      persistChangesToS3(updatedComponent);
    }
  };

  const persistChangesToS3 = async (updatedComponent) => {
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        [props.component]: {
          ...updatedComponent,
          deleted: IS_DELETED,
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
            ...componentData,
            deleted: IS_DELETED,
          },
          component: [props.component],
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
        [props.component]: {
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
        component: props.component,
      })
    );

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );
  };

  const productSlider = {
    ...owlSetting2,
    responsive: {
      ...owlSetting2.responsive,
      992: {
        items: sellerConfigs.Theme.Template === 2 ? 3 : 4,
      },
      1200: {
        items: sellerConfigs.Theme.Template === 2 ? 4 : 5,
      },
    },
    nav: true,
    dots: false,
    margin: 20,
    navText: [
      '<i class="icon-angle-left"></i>',
      '<i class="icon-angle-right"></i>',
    ],
  };

  return (
    <>
      <div
        style={{
          display: noProductsAndisCustomer ? "none" : "block",
          position: "relative",
          transform: "translate(0,0)",
          marginTop: 0,
          marginBottom: 0,
          paddingBottom: 0,
          paddingTop: 15,
          border: IS_DELETED ? `1px #dc3545 solid` : `1px transparent solid`,
        }}
        className={
          sellerConfigs.UserInfo.enableEditing
            ? `edit-box ${IS_DELETED ? "deleted-edit-box" : "primary-edit-box"}`
            : ""
        }
      >
        <section
          className={"container"}
          style={{
            padding: 0,
            overflow: "hidden",
          }}
        >
          <EditBoxStrip IS_DELETED={IS_DELETED} />

          {IS_DELETED ? (
            <RestorationAfterDeleteToolBox restore={toggleDeletedStatus} />
          ) : (
            <ToolBox
              handleDeleteComponent={toggleDeletedStatus}
              handleAdd={handleOpenProductAdder}
            />
          )}

          <div
            style={{
              marginBottom: 10,
            }}
          >
            {editingSectionTitle ? (
              <form
                style={{ margin: 0 }}
                onSubmit={handleSectionTitleEditorClose}
              >
                <input
                  type="text"
                  className="form-control text-center section-title heading-border ls-20 border-0 p-0 h-auto"
                  style={{
                    fontWeight: 700,
                    color: sellerConfigs.Theme.ColorPalette["Gray-10"],
                    background: sellerConfigs.Theme.ColorPalette["Body"],
                  }}
                  onChange={handleTitleChange}
                  value={componentData.title}
                  autoFocus={true}
                  onBlur={handleSectionTitleEditorClose}
                />
              </form>
            ) : (
              <h2
                className="section-title heading-border ls-20 border-0"
                onClick={handleSectionTitleEditorOpen}
                style={{
                  opacity: IS_DELETED ? 0.7 : 1,
                  pointerEvents: IS_DELETED ? "none" : "auto",
                  display: "flex",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    color: sellerConfigs.Theme.ColorPalette["Gray-10"],
                  }}
                >
                  {componentData.title}
                  <div
                    style={{
                      height: 27,
                      width: 27,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      marginLeft: 3,
                      position: "absolute",
                      right: -25,
                      top: 0,
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
                </span>
              </h2>
            )}

            {/*  */}

            <div
              style={{
                opacity: IS_DELETED ? 0.7 : 1,
                pointerEvents: IS_DELETED ? "none" : "auto",
                height: componentData.products.length ? "fit-content" : "380px",
                background: componentData.products.length
                  ? "transparent"
                  : "#f4f4f4",
                display: componentData.products.length ? "block" : "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {componentData.products.length ? (
                <Carousel
                  addClass="products-slider custom-products nav-outer show-nav-hover nav-image-center"
                  settings={productSlider}
                >
                  {componentData.products.map((item, index) => (
                    <Product
                      product={item}
                      key={uuidv4()}
                      width={220}
                      height={220}
                      handleDelete={handleSetDeleteConfirmation}
                      handleEdit={handleOpenProductEditor}
                    />
                  ))}
                </Carousel>
              ) : (
                <div
                  style={{
                    height: "380px",
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
                      opacity: IS_DELETED ? 0.7 : 1,
                      cursor: IS_DELETED ? "not-allowed" : "pointer",
                    }}
                    onClick={handleOpenProductAdder}
                    title="Click to add product to slider"
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
                    Click to add a product to product slider
                  </h6>
                </div>
              )}
            </div>
          </div>
        </section>

        {openNewProductAdder && (
          <NewProductSliderModal
            close={handleCloseProductAdder}
            addProduct={handleAddProduct}
          />
        )}

        {openProductEditor.state && (
          <EditProductSliderModal
            product={openProductEditor.product}
            addProduct={handleAddProduct}
            close={handleCloseProductEditor}
          />
        )}

        {deleteConfirmation.needed && (
          <DeleteConfirmationDialogue
            message={`Are you sure you want to delete ${deleteConfirmation.payload.Description} from slider ?`}
            cancel={handleUnsetSetDeleteConfirmation}
            confirm={handleDeleteProduct}
          />
        )}
      </div>
    </>
  );
}

export default HomeScreenProductsSlide;
