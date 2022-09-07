import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { addToCart, addToWishList, showQuickView } from "../../../../../action";
import { findIndex } from "../../../../../utils";

import { WishlistContext } from "../../../../../store/WishlistContext";
import { PricelistContext } from "../../../../../store/PricelistContext";
import { CartListContext } from "../../../../../store/CartListContext";

function Product(props) {
  const { wishlist, wishlistDispach } = useContext(WishlistContext);
  const { pricelistDispach } = useContext(PricelistContext);
  const { cartDispach } = useContext(CartListContext);
  let isInWishlist = props.product
    ? findIndex(wishlist.list, props.product.ProductID)
      ? true
      : false
    : false;

  let { link = "default", noAction = false, product } = props;

  const onWishlistClick = (e) => {
    isInWishlist = props.product
      ? findIndex(wishlist.list, props.product.ProductID)
        ? true
        : false
      : false;

    if (!isInWishlist) {
      e.preventDefault();
      wishlistDispach(addToWishList(product));
    }
  };

  return (
    <div
      className={"product-default"}
      style={{
        position: "relative",
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
          className="tool-box-option"
          onClick={() => props.handleDelete(props.product.SliderID)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className="bi bi-trash-fill"
            viewBox="0 0 16 16"
            fill="#0088cb"
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
          <Link
            to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}
          >
            {" "}
            {product.Description}{" "}
          </Link>
        </h3>

        <div className="product-action">
          {noAction === true ? (
            ""
          ) : (
            <Link
              to={`${process.env.PUBLIC_URL}/pages/wishlist`}
              className={`btn-icon-wish ${isInWishlist ? "checked" : ""}`}
              onClick={onWishlistClick}
            >
              <i className="icon-heart"></i>
            </Link>
          )}
          <button
            className="btn-icon btn-add-cart"
            onClick={() => addToCart(product, 1, cartDispach)}
          >
            ADD TO CART
          </button>
          {noAction === true ? (
            ""
          ) : (
            <Link
              to="#"
              className="btn-quickview"
              title="Quick View"
              onClick={(e) => {
                e.preventDefault();
                pricelistDispach(showQuickView(product));
              }}
            >
              <i className="fas fa-external-link-alt"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
