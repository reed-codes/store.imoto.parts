import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { addToCart, addToWishList, showQuickView } from "../../../action";
import { findIndex } from "../../../utils";

import { WishlistContext } from "../../../store/WishlistContext";
import { PricelistContext } from "../../../store/PricelistContext";
import { CartListContext } from "../../../store/CartListContext";

function ProductTypeFive(props) {
  const { wishlist, wishlistDispach } = useContext(WishlistContext);
  const { pricelistDispach } = useContext(PricelistContext);
  const { cartDispach } = useContext(CartListContext);
  let isInWishlist = props.product
    ? findIndex(wishlist.list, props.product.ProductID)
      ? true
      : false
    : false;

  let { addClass, link = "default", noAction = false, product } = props;

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
    <div className={"product-default " + addClass}>
      <figure>
        <Link to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}>
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
          <Link to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}>
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
            onClick={() =>  addToCart( product, 1, cartDispach )}
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

export default ProductTypeFive;
