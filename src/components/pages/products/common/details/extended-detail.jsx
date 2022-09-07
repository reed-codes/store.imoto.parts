import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Qty from "../../../../features/qty";
import ProductNav from "./common/product-nav";

import { quickAddToCart, addToWishList } from "../../../../../action";
import { findIndex, getPrice } from "../../../../../utils";

import { WishlistContext } from "../../../../../store/WishlistContext";
import { CartListContext } from "../../../../../store/CartListContext";

function ExtendedDetail(props) {
  const { wishlist, wishlistDispach } = useContext(WishlistContext);
  const { cartDispach } = useContext(CartListContext);
  const { product } = props;
  let isInWishlist = product
    ? findIndex(wishlist.list, product.ProductID)
      ? true
      : false
    : false;
  let maxPrice,
    minPrice = 0;

  const selectGroup = (e) => {
    e.preventDefault();
    e.currentTarget.parentElement.parentElement.querySelector(".active") &&
      e.currentTarget.parentElement.parentElement
        .querySelector(".active")
        .classList.remove("active");
    e.currentTarget.parentElement &&
      e.currentTarget.parentElement.classList.add("active");
  };

  const addToCart = (e) => {
    e.preventDefault();
    let val = parseInt(
      e.currentTarget.parentElement
        .querySelector(".horizontal-quantity")
        .getAttribute("value")
    );
    quickAddToCart(product, val, cartDispach);
  };

  const onWishlistClick = (e) => {
    if (!isInWishlist) {
      e.preventDefault();
      wishlistDispach(addToWishList(product));
    }
  };

  return (
    <>
      <div className="skel-pro skel-extended-detail"></div>
      <div className="product-single-details">
        <div className="product-single-header">
          <div className="row position-relative">
            <ProductNav
              product={product}
              link={props.link}
              addClass="mb-0 ml-3 extended-nav"
            />
            <div className="col-md-6">
              <h1 className="product-title mb-1">{product.name}</h1>
            </div>

            <div className="col-md-6 product-single-share extended-share justify-content-lg-end">
              <div className="social-icons mb-1">
                <Link
                  to="#"
                  className="social-icon social-facebook icon-facebook"
                  target="_blank"
                  title="Facebook"
                ></Link>
                <Link
                  to="#"
                  className="social-icon social-twitter icon-twitter"
                  target="_blank"
                  title="Twitter"
                ></Link>
                <Link
                  to="#"
                  className="social-icon social-linkedin fab fa-linkedin-in"
                  target="_blank"
                  title="Linkedin"
                ></Link>
                <Link
                  to="#"
                  className="social-icon social-gplus fab fa-google-plus-g"
                  target="_blank"
                  title="Google +"
                ></Link>
                <Link
                  to="#"
                  className="social-icon social-mail icon-mail-alt"
                  target="_blank"
                  title="Mail"
                ></Link>
              </div>
            </div>
          </div>
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
            >{`( ${product.reviews} Reviews )`}</Link>
          </div>

          <hr className="short-divider" />

          <div className="row mb-1">
            <div className="col-xl-6 d-flex align-items-center mb-1">
                <div className="price-box pb-4 pb-xl-0 mb-0">
                  <span className="product-price">
                    ${product.Price.toFixed(2)}
                  </span>
                </div>
            </div>
            <div className="col-xl-6 d-flex flex-column align-items-xl-end mb-1">
              <div className="widget-area">
                <div className="widget widget-info">
                  <ul>
                    <li className="mt-0">
                      <i className="icon-shipping"></i>
                      <h4>
                        FREE
                        <br />
                        SHIPPING
                      </h4>
                    </li>
                    <li className="mt-0">
                      <i className="icon-us-dollar"></i>
                      <h4>
                        100% MONEY
                        <br />
                        BACK GUARANTEE
                      </h4>
                    </li>
                    <li className="mt-0">
                      <i className="icon-online-support"></i>
                      <h4>
                        ONLINE
                        <br />
                        SUPPORT 24/7
                      </h4>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-desc">
          <p>
            {product.LongDescription}{" "}
            <Link to="#" className="view-more">
              (View More)
            </Link>
          </p>
        </div>

        <div className="product-filters-container d-flex flex-wrap align-items-center justify-content-xl-end mb-2 pt-5">
        
          <div className="product-action mb-2 d-flex align-items-center flex-wrap">
            <div className="single-qty-wrapper mr-md-4">
              <label className="mb-1">QTY:</label>
              <Qty stock={product.Stock} />
            </div>

            <Link
              to="#"
              className="btn btn-dark add-cart icon-shopping-cart mr-3"
              title="Add to Cart"
              onClick={addToCart}
            >
              Add to Cart
            </Link>

            <Link
              to={`${process.env.PUBLIC_URL}/pages/wishlist`}
              className={`add-wishlist ${isInWishlist ? "checked" : ""}`}
              title={isInWishlist ? "Go to Wishlist" : "Add to Wishlist"}
              onClick={onWishlistClick}
            >
              {isInWishlist ? "Go to Wishlist" : "Add to Wishlist"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExtendedDetail;
