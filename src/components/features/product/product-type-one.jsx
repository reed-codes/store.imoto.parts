import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { addToCart, addToWishList, showQuickView } from "../../../action";
import { findCartIndex } from "../../../utils";

import { WishlistContext } from "../../../store/WishlistContext";
import { PricelistContext } from "../../../store/PricelistContext";
import { CartListContext } from "../../../store/CartListContext";

function ProductTypeOne(props) {
  const { wishlist, wishlistDispach } = useContext(WishlistContext);
  const { pricelistDispach } = useContext(PricelistContext);
  const { cartDispach } = useContext(CartListContext);
  const { addClass, product } = props;
  let isInWishlist = false;
  if(props.product){
    if(findCartIndex(cartWishList.wishlist, props.product.ProductID)){
      isInWishlist = true
    }else{
      isInWishlist = false
    }
  }else{
    isInWishlist = false
  }
  if (!product) return <div></div>;

  const onWishlistClick = (e) => {
    e.preventDefault();
    if (!isInWishlist) {
      wishlistDispach(addToWishList(props.product));
    }
  };

  return (
    <div className={`product-default ${addClass}`}>
      <figure>
        <Link to={`${process.env.PUBLIC_URL}/products/default/${product.ProductID}`}>
          <span>
            <img
              src={product.ImageURL[0] }
              className="first-image"
              alt="product"
            />
          </span>
          {product.ImageURL[0] ? (
            <span className="product-image-hover">
              <img
                src={product.ImageURL[0] }
                className="last-image"
                alt="product"
              />
            </span>
          ) : (
            ""
          )}
        </Link>
        <div className="btn-icon-group">
          <button
            className="btn-icon btn-add-cart"
            onClick={() => addToCart( product, 1, cartDispach )}
          >
            <i className="icon-bag"></i>
          </button>
          <Link
            to={`${process.env.PUBLIC_URL}/pages/wishlist`}
            className={`btn-icon btn-icon-wish ${
              isInWishlist ? "checked" : ""
            }`}
            onClick={onWishlistClick}
          >
            <i className="icon-heart"></i>
          </Link>
        </div>
        <Link
          to="#"
          className="btn-quickview"
          title="Quick View"
          onClick={(e) => {
            e.preventDefault();
            pricelistDispach( showQuickView(product) );
          }}
        >
          Quick View
        </Link>
      </figure>
      <div className="product-details">
        <h2 className="product-title">
          <Link to={`${process.env.PUBLIC_URL}/products/default/${product.ProductID}`}>
            {product.Description}
          </Link>
        </h2>
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
      </div>
    </div>
  );
}

export default ProductTypeOne;
