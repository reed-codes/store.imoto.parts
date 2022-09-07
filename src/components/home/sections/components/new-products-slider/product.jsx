import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { addListItemToList } from "../../../../../api";
import { addToCart, addToWishList, showCartModal, showQuickView } from "../../../../../action";
import { adjustColorBrightness, findCartIndex } from "../../../../../utils";

import { PricelistContext } from "../../../../../store/PricelistContext";
import { CartWishListContext } from "../../../../../store/CartWishlistContext";

import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import styled from "styled-components";
import { toast } from "react-toastify";

const ProductAnchor = styled.a`
  cursor: pointer;
  color: ${(props) => props.color} !important;
  &:hover {
    color: ${(props) => props.color} !important;
  }
`;

const AddToCartButton = styled.button`
  background: ${(props) => props.backgroundColor} !important;
  border-color: ${(props) =>
    adjustColorBrightness(props.backgroundColor, -25)} !important;
  color: ${(props) => props.textColor} !important;
  &:hover {
    color: ${(props) => props.hoverTextColor} !important;
    filter: brightness(90%);
    border-color: ${(props) =>
    adjustColorBrightness(props.backgroundColor, -25)} !important;
  }
`;

const AnchorIconButton = styled.a`
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.backgroundColor} !important;
  cursor: pointer;
  color: ${(props) => props.color} !important;
  &:hover {
    color: ${(props) => props.hoverColor} !important;
  }
`;

const Product = (props) => {
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const { pricelistDispach } = useContext(PricelistContext);
  const { sellerConfigs } = useSellerConfig();

  let isInWishlist = false;
  if (props.product) {
    if (findCartIndex(cartWishList.wishlist, props.product.ProductID)) {
      isInWishlist = true
    } else {
      isInWishlist = false
    }
  } else {
    isInWishlist = false
  }

  let { link = "default", noAction = false, product } = props;

  const handleAddToCart = async () => {
    let listItem = {
      ProductID: product.ProductID,
      Quantity: 1,
    };
    // specify the listname that you going to add item to.
    cartWishList.cart.filter((item, index) => {
      if (product.ProductID === item.ProductID) {
        listItem.Quantity = item.Quantity + 1
      }
    })

    // reducer
    cartWishListDispach(addToCart(product, 1));
    cartWishListDispach(showCartModal(product));

    // api call
    const [, addToCartError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);

    if (addToCartError !== null) {
      toast.error(addToCartError)
    }
  };

  const handleAddToWishlist = async (e) => {
    let listItem = {
      ProductID: product.ProductID,
      Quantity: 1,
    };

    e.preventDefault()
    if (findCartIndex(cartWishList.wishlist, props.product.ProductID)) {
      // update the boolean value to fill the wishlist icon with the color
      isInWishlist = true;
    } else {
      // update the boolean value to fill the wishlist icon with the color
      isInWishlist = false;
      cartWishListDispach(addToWishList(product));
      //  make api call here
      const [, addToWishlistError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);

      if (addToWishlistError !== null) {
        toast.success("Added product to wishlist.")
      } else {
        toast.done("Error adding product to wishlist.")
      }
    }
  };

  return (
    <div
      className={"product-default"}
      style={{
        position: "relative",
        padding: "3px",
        background: sellerConfigs.Theme.ColorPalette["White"],
      }}
    >
      <div
        style={{
          background: "#fff",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
          borderBottomLeftRadius: 13,
          borderBottomRightRadius: 13,
          display: "flex",
          overflow: "hidden",
          border: "1px solid rgba(0, 136, 203, 0.35)",
        }}
        className={"appear-on-hover-item-action-container"}
      >
        <div
          style={{
            width: 42,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px rgba(0,0,0,.05) solid",
            overflow: "hidden !important",
          }}
          className="tool-box-option"
          onClick={() => props.handleEdit(product)}
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
            width: 42,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden !important",
          }}
          className="tool-box-option tool-box-delete-button"
          onClick={() => props.handleDelete(props.product)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className="bi bi-trash-fill"
            viewBox="0 0 16 16"
            fill="#dc3545"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
          </svg>
        </div>
      </div>

      <figure>
        <Link
          to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}
        >
          <div className="lazy-overlay bg-3"></div>

          <LazyLoadImage
            alt="product"
            src={product.ImageURL[0]}
            threshold={500}
            effect="black and white"
          />
          {product.ImageURL.length >= 2 ? (
            <LazyLoadImage
              alt="product"
              src={product.ImageURL[0]}
              threshold={500}
              effect="black and white"
              wrapperClassName="product-image-hover"
            />
          ) : (
            ""
          )}
        </Link>
      </figure>

      <div className="product-details">
        <div className="ratings-container">
          <div className="product-ratings">
            <span
              className="ratings"
              style={{ width: 20 * product.Ranking + "%" }}
            ></span>
            <span className="tooltiptext tooltip-top">
              {product.Ranking.toFixed(2)}
            </span>
          </div>
        </div>

        <h3 className="product-title">
          <ProductAnchor
            to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}
            color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
          >
            {" "}
            {product.Description}{" "}
          </ProductAnchor>
        </h3>

        <div className="product-action"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {noAction === true ? (
            ""
          ) : (
            <AnchorIconButton
              href={`${process.env.PUBLIC_URL}/pages/wishlist`}
              className={`btn-icon-wish ${isInWishlist ? "checked" : ""}`}
              onClick={(e) => { handleAddToWishlist(e) }}
              hoverColor={adjustColorBrightness(
                sellerConfigs.Theme.ColorPalette["Gray-30"],
                -25
              )}
              backgroundColor={sellerConfigs.Theme.ColorPalette["Gray-60"]}
              color={sellerConfigs.Theme.ColorPalette["Gray-30"]}
            >
              <i className="icon-heart"></i>
            </AnchorIconButton>
          )}
          <AddToCartButton
            className="btn-icon btn-add-cart"
            onClick={handleAddToCart}
            backgroundColor={sellerConfigs.Theme.ColorPalette["Secondary"]}
            textColor={sellerConfigs.Theme.ColorPalette["White"]}
            hoverTextColor={sellerConfigs.Theme.ColorPalette["White"]}
          >
            ADD TO CART
          </AddToCartButton>
          {noAction === true ? (
            ""
          ) : (
            <AnchorIconButton
              href="#"
              className="btn-quickview"
              title="Quick View"
              onClick={(e) => {
                e.preventDefault();
                pricelistDispach(showQuickView(product));
              }}
              hoverColor={adjustColorBrightness(
                sellerConfigs.Theme.ColorPalette["Gray-30"],
                -25
              )}
              backgroundColor={sellerConfigs.Theme.ColorPalette["Gray-60"]}
              color={sellerConfigs.Theme.ColorPalette["Gray-30"]}
            >
              <i className="fas fa-external-link-alt"></i>
            </AnchorIconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
