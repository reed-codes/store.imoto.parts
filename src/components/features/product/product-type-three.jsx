import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { findCartIndex } from "../../../utils";
import { addToCart, addToWishList, showCartModal, showQuickView } from "../../../action";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { addListItemToList } from "../../../api";

import { PricelistContext } from "../../../store/PricelistContext";
import { CartWishListContext } from "../../../store/CartWishlistContext";
import { toast } from "react-toastify";

function ProductTypeThree(props) {
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const { sellerConfigs } = useSellerConfig();
  const { pricelistDispach } = useContext(PricelistContext);

  let isInWishlist = props.product ? findCartIndex(cartWishList.wishlist, props.product.ProductID) ? true : false : false;

  let { addClass, product } = props;

  let listItem = {
    ProductID: product.ProductID,
    Quantity: 0,
  };

  // specify the listname that you going to add item to.
  let listName = "cart";

  const handleAddToCart = async () => {
    // specify the listname that you going to add item to.
    listName = "cart";

    cartWishList.cart.map((item, index) => {
      if (product.ProductID === item.ProductID) {
        listItem.Quantity = item.Quantity + 1
      }
    })

    // reducer
    cartWishListDispach(addToCart(product, 1));
    cartWishListDispach(showCartModal(product));

    // api call
    const apiCallResponse = await addListItemToList(sellerConfigs.SellerID, listName, listItem);


  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    if (findCartIndex(cartWishList.wishlist, props.product.ProductID)) {
      // update the boolean value to fill the wishlist icon with the color
      isInWishlist = true;
    } else {
      // update the boolean value to fill the wishlist icon with the color
      isInWishlist = false;
      cartWishListDispach(addToWishList(product));
      listName = "wishlist";
      //  make api call here
      const apiCallResponse = await addListItemToList(sellerConfigs.SellerID, listName, listItem);
      apiCallResponse[1] === null ? toast.success("Added product to wishlist.") : toast.done("Error adding product to wishlist.")
    }
  };

  return (
    <div className={`product-default ${addClass}`}>
      <figure className="col-md-3 col-sm-4 p-0">
        <Link to={`${process.env.PUBLIC_URL}/products/default/${product.ProductID}`}>
          <img
            src={product.ImageURL[0]}
            className="first-image"
            alt="product"
          />

          {product.ImageURL[1] ? (
            <img
              src={product.ImageURL[0]}
              className="last-image"
              alt="product"
            />
          ) : (
            ""
          )}
        </Link>
      </figure>

      <div className="product-details col-md-9 col-sm-8">
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
        <p className="product-description">{product.LongDescription}</p>
        <div className="product-action">
          <button
            className="btn-icon btn-add-cart"
            onClick={() => handleAddToCart()}
          >
            <i className="icon-bag"></i>ADD TO CART
          </button>

          <Link
            to={`${process.env.PUBLIC_URL}/pages/wishlist`}
            className={`btn-icon-wish ${isInWishlist ? "checked" : ""}`}
            onClick={handleAddToWishlist}
          >
            <i className="icon-heart"></i>
          </Link>

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
        </div>
      </div>
    </div>
  );
}

export default ProductTypeThree;
