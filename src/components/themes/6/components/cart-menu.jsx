import React from "react";
import { Link } from "react-router-dom";
import { getCartTotal, getQtyTotal } from "../../../../utils";

function CartMenu(props) {
  const cartItems = [];

  return (
    <div className="dropdown cart-dropdown">
      <Link
        to={`${process.env.PUBLIC_URL}/pages/cart`}
        className="dropdown-toggle"
      >
        <i className="icon-bag-2"></i>
        <span className="cart-count">{` ${getQtyTotal(cartItems)}`}</span>
      </Link>
      <div className="dropdown-menu">
        <div className="dropdownmenu-wrapper">
          <div className="dropdown-cart-header">
            <span>{cartItems.length} Items</span>
            <Link
              to={`${process.env.PUBLIC_URL}/pages/cart`}
              className="float-right"
            >
              View Cart
            </Link>
          </div>

          <div className="dropdown-cart-products">
            {cartItems.map((item, index) => (
              <div className="product" key={"cart-item" + index}>
                <div className="product-details">
                  <h2 className="product-title">
                    <Link to={`${process.env.PUBLIC_URL}/product-detail`}>
                      {item.name}
                    </Link>
                  </h2>
                  <span className="cart-product-info">
                    <span className="cart-product-qty">{item.qty}</span>x $
                    {item.salePrice
                      ? item.salePrice.toFixed(2)
                      : item.price.toFixed(2)}
                  </span>
                </div>
                <figure className="product-image-container">
                  <Link
                    to={`${process.env.PUBLIC_URL}/products/default/${item.id}`}
                    className="product-image"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/${item.pictures[0]}`}
                      alt="product"
                    />
                  </Link>
                  <Link
                    to="#"
                    className={`btn-remove icon-cancel`}
                    title="Remove Product"
                    onClick={(e) => {
                      e.preventDefault();
                      props.removeFromCart(item);
                    }}
                  >
                    <i className="icon-retweet"></i>
                  </Link>
                </figure>
              </div>
            ))}
          </div>
          <div className="dropdown-cart-total">
            <span>Total</span>
            <span className="cart-total-price float-right">
              ${getCartTotal(cartItems).toFixed(2)}
            </span>
          </div>
          <div className="dropdown-cart-action">
            <Link
              to={`${process.env.PUBLIC_URL}/pages/checkout/shipping/one`}
              className={"btn btn-block " + props.btnAClass}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartMenu
