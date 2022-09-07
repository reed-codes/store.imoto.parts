import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Carousel from "../../features/carousel";
import ToolBox from "./components/tool-box/tool-box";
import EditBoxStrip from "./components/tool-box/edit-box-strip";
import RestorationAfterDeleteToolBox from "./components/tool-box/restore-after-delete-tool-box";
import { owlSetting7 } from "../../../utils/settings";

import {
  updateBrandsContainer,
  deleteBrandByIndex,
  toggleComponentDeletedStatus,
} from "../../../action";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import {
  handleImageUpload,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../../utils";
import FancyEditBox from "./components/fancy-edit-box";
import FancyEditBoxHeader from "./components/fancy-edit-box-header";
import ModalOptionsPanel from "./components/home-screen-slider/components/modal-options-panel";

import EditBrandModal from "./components/brands-carousel/edit-brand-modal";
import AddBrandModal from "./components/brands-carousel/add-brand-modal";
import ConfirmDelete from "./components/confirm-delete";
import { ItemActions } from "./components/tool-box/edit-delete-item-actions";
import NoContentContainer from "./components/no-content-container";

const INIT_BRAND = {
  id: "",
  order: 0,
  image: "",
};

const BrandsCarousel = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const DELETED = sellerConfigs.UIConfig.BrandsCarousel.deleted;

  const [files, setFiles] = useState([]);
  const [slide, setSlide] = useState({});
  const [deletingBrand, setDeletingBrand] = useState(-1);
  const [editingBrand, setEditingBrand] = useState(-1);
  const [openEditBrandModal, setOpenEditBrandModal] = useState(false);
  const [openAddBrandModal, setOpenAddBrandModal] = useState(false);
  const [openDeleteBrandModal, setOpenDeleteBrandModal] = useState(false);
  const [brands, setBrands] = useState([
    ...sellerConfigs.UIConfig.BrandsCarousel.brands,
  ]);

  useEffect(() => {
    setBrands([...sellerConfigs.UIConfig.BrandsCarousel.brands]);
    // console.log("useEffect");
    // console.log("sellerConfigs.UIConfig.BrandsCarousel.brands:",
    //   sellerConfigs.UIConfig.BrandsCarousel.brands
    // );
  }, [sellerConfigs.UIConfig.BrandsCarousel.brands]);

  /**
   * Function used to hide a widgtet. This function will update the widgets
   * deleted field in context.
   */
  const toggleDeletedStatus = () => {
    sellerConfigDispatch(toggleComponentDeletedStatus("BrandsCarousel"));
  };

  /**
   * Function used or call when the edit infobox is clicked. Here we open the
   * modal, set the editing info box and the index.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleEditBrandClicked = (index) => {
    setEditingBrand(index);
    setOpenEditBrandModal(true);

    setSlide({
      ...INIT_BRAND,
      order: String(brands.length + 1),
    });
  };

  /**
   * Function called when the cancel button is clicked in the Edit or Add
   * InfoBox modal.
   */
  const handleCancelEditClicked = () => {
    setOpenEditBrandModal(false);
    setBrands([...sellerConfigs.UIConfig.BrandsCarousel.brands]);
  };

  /**
   * Function triggered when delete infobox is clicked. Here we set the index of
   * the deleting infobox and open the confirm delete info box modal.
   *
   * @param {integer} index the infobox clicked on
   */
  const handleDeleteBrandClicked = (index) => {
    setDeletingBrand(index);
    setOpenDeleteBrandModal(true);
  };

  /**
   * Function triggered when save or confirm is clicked. this function asserts the
   * 'editingInfoBox' and the 'deletingInfoBox' state variable to know if the user
   * is creating, editing or deleting and info box.
   */
  const handleSaveBrandsClicked = async () => {
    setOpenDeleteBrandModal(false);

    const copyLocalBrands = [...brands];
    copyLocalBrands.splice(deletingBrand, 1);

    // fix the order before persisting the changes
    const fixBrandsOrder = copyLocalBrands.map((item, index) => {
      return {
        ...item,
        order: index + 1,
      };
    });

    sellerConfigDispatch(deleteBrandByIndex(deletingBrand));
    setBrands([...fixBrandsOrder]);

    const [SUCCESS, _] = await persistBrandsChanges(fixBrandsOrder);
    if (SUCCESS) {
      toast.success("item deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      setFiles([]);
    } else {
      toast.error("deleting item unsuccessful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
    setDeletingBrand(-1);
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
  const persistBrandsChanges = async (copyBrands) => {
    const copySellerConfigs = { ...sellerConfigs };
    copySellerConfigs.UIConfig.BrandsCarousel.brands = [...copyBrands];

    const blob = getSellerConfigJsonBlob(copySellerConfigs);
    const [SUCCESS, ERROR] = await updateSellerConfigS3File(blob, "localhost");

    return [SUCCESS, ERROR];
  };

  const handleSetReorderedSlides = (list) => setBrands(list);

  const handleEditBrand = async () => {
    const USER_HAS_UPLOADED_IMAGE = Boolean(files[0]);

    const copyBrands = [...brands];
    if (USER_HAS_UPLOADED_IMAGE) {
      copyBrands[editingBrand] = { ...slide, image: files[0].preview };
    } else {
      copyBrands[editingBrand] = { ...slide };
    }
    setBrands([...copyBrands]);

    setOpenEditBrandModal(false);
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

    const updatedSlidesList = brands.map((slde, index) => {
      return slde.id === slide.id ? slide : { ...slde, order: index + 1 };
    });
    sellerConfigDispatch(updateBrandsContainer(updatedSlidesList));

    const [SUCCESS, _] = await persistBrandsChanges(updatedSlidesList);
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

  return (
    <>
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
              addDisabled={brands.length >= 6}
              addTooltip="Click to add a brand to the brands container"
              hideTooltip="Click to hide the brands container"
              handleAdd={() => setOpenAddBrandModal(true)}
              handleDeleteComponent={toggleDeletedStatus}
            />
          )}

          {brands.length === 0 ? (
            <NoContentContainer
              containerHeight="214px"
              addItem={() => setOpenAddBrandModal(true)}
              message="Click to add a Brand to the Brands Carousel"
            />
          ) : (
            <section className="blog-section">
              <div style={{ opacity: DELETED ? 0.1 : 1 }}>
                <Carousel
                  addClass="brands-slider images-center pb-2"
                  settings={owlSetting7}
                >
                  {brands.length &&
                    brands.map((item, index) => (
                      <div key={"feature" + item.id}>
                        <div className="lazy-overlay bg-transparent" />
                        <figure>
                          <img
                            alt="brand"
                            src={item.image}
                            threshold={500}
                            effect="blur"
                            width={140}
                            height={50}
                          />
                        </figure>
                        <ItemActions
                          deleteClicked={() => handleDeleteBrandClicked(index)}
                          editClicked={() => handleEditBrandClicked(index)}
                        />
                      </div>
                    ))}
                </Carousel>
              </div>
            </section>
          )}
        </div>
      </div>
      {openEditBrandModal && (
        <FancyEditBox handleClose={handleCancelEditClicked} autoHeight={false}>
          <FancyEditBoxHeader title={""} close={handleCancelEditClicked} />
          <EditBrandModal
            setBrands={setBrands}
            brands={brands}
            index={editingBrand}
            setIndex={setEditingBrand}
            close={handleCancelEditClicked}
            files={files}
            setFiles={setFiles}
            slide={slide}
            setSlide={setSlide}
            handleEditBrand={handleEditBrand}
            handleSetReorderedSlides={handleSetReorderedSlides}
          />
          <ModalOptionsPanel />
        </FancyEditBox>
      )}
      {openAddBrandModal && (
        <FancyEditBox
          handleClose={() => setOpenAddBrandModal(false)}
          autoHeight={true}
        >
          <FancyEditBoxHeader
            title="Add new brand"
            close={() => setOpenAddBrandModal(false)}
          />
          <AddBrandModal
            setBrands={setBrands}
            close={() => setOpenAddBrandModal(false)}
          />
          <ModalOptionsPanel />
        </FancyEditBox>
      )}
      {openDeleteBrandModal && (
        <ConfirmDelete
          cancel={() => setOpenDeleteBrandModal(false)}
          confirm={handleSaveBrandsClicked}
          message="Are you sure you would like to delete this brand from the brands container permanantly?"
        />
      )}
    </>
  );
};

export default BrandsCarousel;
