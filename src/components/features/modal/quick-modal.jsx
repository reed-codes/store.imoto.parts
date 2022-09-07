import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Magnifier } from "react-image-magnifiers";
import Modal from "react-modal";
import imagesLoaded from "imagesloaded";

import Qty from "../qty";
import Carousel from "../../features/carousel";

import { findCartIndex } from "../../../utils";
import { quickAddToCart, addToWishList, hideQuickView } from "../../../action";

import { PricelistContext } from "../../../store/PricelistContext";
import { CartWishListContext } from "../../../store/CartWishlistContext";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { addListItemToList } from "../../../api";
import { toast } from "react-toastify";

const customStyles = {
  content: {
    top: "50%",
    right: "auto",
    transform: "translateY(-50%)",
    position: "relative",
    maxWidth: "872px",
    width: "90%",
    padding: "20px 20px 0",
    overflow: "hidden",
  },
};

const QuickModal = () => {
  const { cartWishList,
    cartWishListDispach } = useContext(CartWishListContext);
  const { pricelistState, pricelistDispach } = useContext(PricelistContext);
  const { sellerConfigs } = useSellerConfig()
  const modalShow = pricelistState.quickShow;
  const product = pricelistState.single;

  let isInWishlist = false;
  if (product) {
    if (findCartIndex(cartWishList.wishlist, product.ProductID)) {
      isInWishlist = true
    } else {
      isInWishlist = false
    }
  } else {
    isInWishlist = false
  }

  const closeModal = () => {
    document.querySelector(".product-quick-view") &&
      (document.querySelector(".product-quick-view").style.opacity = 0);
    setTimeout(() => {
      pricelistDispach(hideQuickView());
    }, 40);
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    let val = parseInt(
      e.currentTarget.parentElement
        .querySelector(".horizontal-quantity")
        .getAttribute("value")
    );
    let listItem = {
      ProductID: product.ProductID,
      Quantity: val,
      ProductInfo: product.ProductInfo,
    };

    // reducer
    cartWishListDispach(quickAddToCart(product, val));

    // api call
    const [, addToCartError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);
    if (addToCartError === null) {
      toast.success("Item successfully added to cart.")
      return
    }
    toast.error("Item not successfully added to cart.")
    closeModal()

  }

  const onWithWishClick = (e) => {
    if (!isInWishlist) {
      e.preventDefault();
      cartWishListDispach(addToWishList(product));
    }
  }

  const setHeight = () => {
    let height;
    if (window.outerWidth >= 768) {
      height = parseInt(window.innerHeight * 0.7);
    } else {
      height = parseInt(window.innerHeight - 40);
    }
    if (height % 2 !== 0) height += 1;
    if (document.querySelector(".product-quick-view")) {
      document.querySelector(".product-quick-view").style.maxHeight =
        height + "px";
      document.querySelector(
        ".product-quick-view .custom-scrollbar"
      ).style.maxHeight = height + "px";
    }
  };

  const afterOpenModal = () => {
    let imgLoad = imagesLoaded(".product-single-gallery");

    if (document.querySelector(".quickview-modal-overlay .skeleton-body")) {
      document
        .querySelector(".quickview-modal-overlay .skeleton-body")
        .classList.remove("loaded");
    }

    imgLoad.on("done", () => {
      if (document.querySelector(".quickview-modal-overlay .skeleton-body")) {
        document
          .querySelector(".quickview-modal-overlay .skeleton-body")
          .classList.add("loaded");
      }
    });

    setHeight();
    window.onresize = () => {
      setHeight();
    };
    document.querySelector(".product-quick-view").style.opacity = 1;
  }

  const thumbActiveHandler = (e) => {
    e.currentTarget.parentNode.parentNode.querySelector(".active") &&
      e.currentTarget.parentNode.parentNode
        .querySelector(".active")
        .classList.remove("active");
    e.currentTarget.parentNode &&
      e.currentTarget.parentNode.classList.add("active");
  }

  return (
    <>
      {!modalShow ? (
        <div></div>
      ) : (
        <Modal
          isOpen={modalShow}
          onRequestClose={closeModal}
          shouldFocusAfterRender={false}
          className="product-single-container product-single-default product-quick-view container"
          style={customStyles}
          overlayClassName="quickview-modal-overlay"
          closeTimeoutMS={100}
          onAfterOpen={afterOpenModal}
        >
          <div
            className="row row-sparse skeleton-body skel-shop-products custom-scrollbar"
            style={{ overflowY: "auto" }}
          >
            <div className="col-md-6 product-single-gallery">
              <div className="skel-pro skel-magnifier"></div>
              <div className="product-slider-container">
                <Carousel addClass="product-single-carousel">
                  {product.ImageURL
                    ? product.ImageURL.map((gallery, index) => (
                      <div
                        className="product-item"
                        key={"product-item" + index}
                      >
                        <Magnifier
                          imageSrc={
                            "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/new-tech-gadgets-7-2-stand-hub-for-mac-mini-1625159248.jpg?resize=480:*"
                          }
                          imageAlt="product"
                          mouseActivation="hover"
                          cursorStyleActive="crosshair"
                          dragToMove={false}
                          className="product-single-image"
                        />
                      </div>
                    ))
                    : ""}
                </Carousel>
              </div>
              <div className="prod-thumbnail owl-dots">
                {product.ImageURL
                  ? product.ImageURL.map((gallery, index) => (
                    <div className="col-3 owl-dot" key={"prod-nav" + index}>
                      <img
                        src={
                          "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/new-tech-gadgets-7-2-stand-hub-for-mac-mini-1625159248.jpg?resize=480:*"
                        }
                        alt="product"
                        onClick={thumbActiveHandler}
                      />
                    </div>
                  ))
                  : ""}
              </div>
            </div>

            <div className="col-md-6">
              <div className="skel-pro skel-detail"></div>
              <div className=" product-single-details">
                <h1 className="product-title mt-1">{product.Description}</h1>

                <div className="ratings-container">
                  <div className="product-ratings">
                    <span
                      className="ratings"
                      style={{ width: 20 * product.Ranking + "%" }}
                    ></span>
                  </div>

                  <Link
                    to="#"
                    className="rating-link"
                  >{`( ${product.Ranking} Reviews )`}</Link>
                </div>

                <div className="price-box">
                  <span className="product-price">
                    ${product.Price.toFixed(2)}
                  </span>
                </div>

                <div className="product-desc">
                  <p>{product.LongDescription}</p>
                </div>

                <hr className="divider" />

                <div className="product-action mt-0">
                  <Qty stock={product.Stock} />

                  <Link
                    to="#"
                    className="btn btn-dark add-cart"
                    title="Add to Cart"
                    onClick={handleAddToCart}
                  >
                    <span>Add to Cart</span>
                  </Link>
                </div>

                <hr className="divider" />

                <div className="product-single-share">
                  <label className="sr-only">Share:</label>

                  <div className="addthis_inline_share_toolbox"></div>

                  <Link
                    to={`${process.env.PUBLIC_URL}/pages/wishlist`}
                    className={`paction add-wishlist ${isInWishlist === true ? "checked" : ""
                      }`}
                    title={isInWishlist ? "Go To Wishlist" : "Add To Wishlist"}
                    onClick={onWithWishClick}
                  >
                    <span>
                      {isInWishlist ? "Go to Wishlist" : "Add to Wishlist"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <button
            title="Close (Esc)"
            type="button"
            className="mfp-close"
            onClick={closeModal}
          >
            ×
          </button>
        </Modal>
      )}
    </>
  );
}

export default QuickModal;
