import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Carousel from "../../features/carousel";
import { owlSetting5 } from "../../../utils/settings";

import {
  deleteItemFromCategorySliderByIndex,
  toggleComponentDeletedStatus,
  updateCategoriesSlider,
} from "../../../action";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import ToolBox from "./components/tool-box/tool-box";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import {
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
  handleImageUpload,
} from "../../../utils";
import ConfirmDelete from "./components/confirm-delete";
import { ItemActions } from "./components/tool-box/edit-delete-item-actions";
import NoContentContainer from "./components/no-content-container";
import ContainerTitle from "./components/container-title";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import ModalOptionsPanel from "./components/home-screen-slider/components/modal-options-panel";
import AddItemContainer from "./components/catergories-container/add-category-to-container-modal";
import EditCatergoriesContainerModal from "./components/catergories-container/edit-catergories-container-modal";

const CategoriesSlider = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const DELETED = sellerConfigs.UIConfig.CategoriesSlider.deleted;

  const [files, setFiles] = useState([]);
  const [slide, setSlide] = useState({});
  const [deletingItem, setDeletingItem] = useState(-1);
  const [editingItem, setEditingItem] = useState(-1);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [title, setTitle] = useState(
    sellerConfigs.UIConfig.CategoriesSlider.title
      ? sellerConfigs.UIConfig.CategoriesSlider.title
      : "Insert title here"
  );
  const [categories, setCategories] = useState([
    ...sellerConfigs.UIConfig.CategoriesSlider.categories,
  ]);

  useEffect(() => {
    setCategories([...sellerConfigs.UIConfig.CategoriesSlider.categories]);
    // console.log("useEffect");
    // console.log("sellerConfigs.UIConfig.CategoriesSlider.categories:",
    //   sellerConfigs.UIConfig.CategoriesSlider.categories
    // );
  }, [sellerConfigs.UIConfig.CategoriesSlider.categories]);

  const handleSetReorderedItems = (list) => setCategories(list);

  const handleAddItemClicked = () => {
    setOpenAddItem(true);
    setEditingItem(-1);
  };

  const handleEditItemClicked = (index) => {
    setSlide(categories[index]);
    setEditingItem(index);
    setOpenEditItem(true);
  };

  /**
   * Function triggered when delete infobox is clicked. Here we set the index of
   * the deleting infobox and open the confirm delete info box modal.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleDeleteItemClicked = (index) => {
    setDeletingItem(index);
    setOpenConfirmDelete(true);
  };

  /**
   * Function used to hide a widgtet. This function will update the widgets
   * deleted field in context.
   */
  const toggleDeletedStatus = () => {
    sellerConfigDispatch(toggleComponentDeletedStatus("CategoriesSlider"));
  };

  const handleConfirmDeleteClicked = async () => {
    const copyCategories = [...categories];
    copyCategories.splice(deletingItem, 1);
    sellerConfigDispatch(deleteItemFromCategorySliderByIndex(deletingItem));
    setOpenConfirmDelete(false);

    const [SUCCESS, ERROR] = await persistChanges(copyCategories);
    if (SUCCESS) {
      toast.success("item deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } else {
      toast.error("item delete unsuccessful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
    setDeletingItem(-1);
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
  const persistChanges = async (copyCategories) => {
    const copySellerConfigs = { ...sellerConfigs };
    copySellerConfigs.UIConfig.CategoriesSlider.categories = [
      ...copyCategories,
    ];

    const blob = getSellerConfigJsonBlob(copySellerConfigs);
    const [SUCCESS, ERROR] = await updateSellerConfigS3File(blob, "localhost");

    return [SUCCESS, ERROR];
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value.toUpperCase());
  };

  const handleCancelEditClicked = () => {
    setCategories([...sellerConfigs.UIConfig.CategoriesSlider.categories]);
    setOpenEditItem(false);
  };

  const handleItemContentChange = (event) => {
    setSlide({
      ...slide,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveTitle = async (event) => {
    if (event.key === "Enter") {
      const copySellerConfigs = { ...sellerConfigs };
      copySellerConfigs.UIConfig.CategoriesSlider.title = title;
      const blob = getSellerConfigJsonBlob(copySellerConfigs);
      const [SUCCESS, ERROR] = await updateSellerConfigS3File(
        blob,
        "localhost"
      );

      if (SUCCESS) {
        toast.success("title updated successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
      } else {
        toast.error("title update unsuccessful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
      }
    }
  };

  const handleCancelAddItem = () => {
    setOpenAddItem(false);
    setFiles([]);
  };

  const handleEditItem = async () => {
    const USER_HAS_UPLOADED_IMAGE = Boolean(files[0]);

    const copyCategories = [...categories];
    if (USER_HAS_UPLOADED_IMAGE) {
      copyCategories[editingItem] = { ...slide, image: files[0].preview };
    } else {
      copyCategories[editingItem] = { ...slide };
    }
    setCategories([...copyCategories]);

    handleCancelEditClicked();
    // there is an image upload image and asert error and alert user appropriatly
    if (USER_HAS_UPLOADED_IMAGE) {
      const [URL, err] = await handleImageUpload(
        files[0],
        sellerConfigs.SellerID
      );

      // check if an error occured at this point we wont be persisting the
      // changes
      if (err) {
        toast.error("image upload unsuccessful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
        return;
      }
      slide.image = URL;
    }

    const updatedSlidesList = categories.map((slde, index) => {
      return slde.id === slide.id ? slide : { ...slde, order: index + 1 };
    });
    sellerConfigDispatch(updateCategoriesSlider(updatedSlidesList));

    const [SUCCESS, _] = await persistChanges(updatedSlidesList);
    if (SUCCESS) {
      setFiles([]);
      toast.success("item updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } else {
      toast.error("item update unsuccessful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  const owlSetting = {
    ...owlSetting5,
    responsive: {
      ...owlSetting5.responsive,
      992: {
        items: sellerConfigs.Theme.Template === 2 ? 3 : 4,
      },
      1220: {
        items: sellerConfigs.Theme.Template === 2 ? 4 : 5,
      },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        border: DELETED ? "1px #dc3545 solid" : "1px transparent solid",
        pointerEvents: DELETED ? "none" : "auto",
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
          handleAdd={handleAddItemClicked}
          addTooltip="Click to add item"
          hideTooltip="Click to hide container"
          handleDeleteComponent={toggleDeletedStatus}
        />
      )}
      {categories.length ? (
        <div
          style={{
            opacity: DELETED ? 0.7 : 1,
            padding: 0,
            overflow: "hidden",
          }}
          className="container"
        >
          <section className="new-products-section">
            <ContainerTitle
              title={title}
              DELETED={DELETED}
              handleTitleChange={handleTitleChange}
              handleSaveTitle={handleSaveTitle}
            />
            <Carousel
              addClass="categories-slider show-nav-hover nav-outer"
              settings={owlSetting}
            >
              {categories.map((item, index) => (
                <div
                  key={item.id}
                  className={"product-category "}
                  data-src={`${process.env.PUBLIC_URL}/` + item.image}
                  style={{ height: "auto" }}
                >
                  <Link to={`${process.env.PUBLIC_URL}/categories/full-width`}>
                    <figure>
                      <img
                        src={item.image}
                        alt="banner"
                        width={220}
                        height={220}
                        style={{ borderRadius: 0 }}
                      />
                    </figure>
                  </Link>

                  <div
                    className={`category-content `}
                    style={{
                      background: sellerConfigs.Theme.ColorPalette["White"],
                    }}
                  >
                    <Link
                      to={`${process.env.PUBLIC_URL}/categories/full-width`}
                    >
                      <h3
                        style={{
                          color: sellerConfigs.Theme.ColorPalette["Gray-10"],
                        }}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <ItemActions
                      editClicked={() => handleEditItemClicked(index)}
                      deleteClicked={() => handleDeleteItemClicked(index)}
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </section>
        </div>
      ) : (
        <NoContentContainer
          addItem={handleAddItemClicked}
          containerHeight="365px"
          message="Click to add an item to the container"
        />
      )}
      {openConfirmDelete && (
        <ConfirmDelete
          cancel={() => setOpenConfirmDelete(false)}
          confirm={handleConfirmDeleteClicked}
          message="Are you sure you would like to delete this item from the container permanantly?"
        />
      )}
      {openAddItem && (
        <FancyEditBox autoHeight={true}>
          <FancyEditBoxHeader
            close={handleCancelAddItem}
            title="Add new item"
          />
          <AddItemContainer
            close={handleCancelAddItem}
            setCategories={setCategories}
          />
          <ModalOptionsPanel />
        </FancyEditBox>
      )}
      {openEditItem && (
        <FancyEditBox autoHeight={true}>
          <FancyEditBoxHeader
            close={handleCancelEditClicked}
            title="Add new item"
          />
          <EditCatergoriesContainerModal
            setBrands={setCategories}
            brands={categories}
            index={editingItem}
            setIndex={setEditingItem}
            close={handleCancelEditClicked}
            files={files}
            setFiles={setFiles}
            slide={slide}
            setSlide={setSlide}
            handleEditBrand={handleEditItem}
            handleSetReorderedSlides={handleSetReorderedItems}
            handleItemContentChange={handleItemContentChange}
          />
          <ModalOptionsPanel />
        </FancyEditBox>
      )}
    </div>
  );
};

export default CategoriesSlider;
