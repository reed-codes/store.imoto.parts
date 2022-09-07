import React, {useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFromCart } from "../../../../action";
import styled from "styled-components";

import {
  adjustColorBrightness,
  getCartTotal,
} from "../../../../utils";
import { deleteListItemByListName } from "../../../../api";
import { CartWishListContext } from "../../../../store/CartWishlistContext";
import { useSellerConfig } from "../../../../store/sellerConfigContext";

const AnchorButton = styled.button`
  background: ${(props) => props.bg} !important;
  border-color: ${(props) => props.borderColor} !important;
  cursor: pointer;
  color: ${(props) => props.color} !important;
  &:hover {
    filter: brightness(90%);
    color: ${(props) => props.color} !important;
  }
  &:active {
    filter: brightness(70%);
    color: ${(props) => props.color} !important;
  }`;

const AnchorIconButton = styled.a`
  cursor: pointer;
  color: ${(props) => props.color} !important;
  &:hover {
    color: ${(props) => props.hoverColor} !important;
  }
`;

function CartMenu(props) {
  const { sellerConfigs } = useSellerConfig();
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const [cartItems, setCartItems] = useState(cartWishList.cart ? cartWishList.cart : [])

  const { btnClass = "btn-primary" } = props;

  useEffect(() => {
    setCartItems(cartWishList.cart)
  }, [cartWishList.cart])

  const handleRemoveFromCart = async (event, product) => {
    const listItem = {
      ProductID: product.ProductID,
      Quantity: 1,
      ProductInfo: product,
    };
    event.preventDefault();
    cartWishListDispach(removeFromCart(product));
    const [ ,deleteCartItemResponse] = await deleteListItemByListName(sellerConfigs.SellerID, "cart", product.ProductID, listItem);
    if (deleteCartItemResponse === null) {
      toast.success("Successfully Removed from Cart")
    }
  };

  return (
    <div className="dropdown cart-dropdown">
      <AnchorIconButton
        onClick={() =>
          props.history.push(`${process.env.PUBLIC_URL}/pages/cart`)
        }
        className="dropdown-toggle dropdown-arrow"
        hoverColor={sellerConfigs.Theme.ColorPalette["Primary"]}
        color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
      >
        {
          cartItems.length === 0 ? (
            <>
              <i className="icon-shopping-cart"></i>
            </>
          ) : (
            <>
              <i className="icon-shopping-cart"></i>
              <span
                className="cart-count badge-circle"
                style={{
                  background: sellerConfigs.Theme.ColorPalette["Quaternary"],
                  color: sellerConfigs.Theme.ColorPalette["White"],
                }}
              >
                {cartItems.length}
              </span>
            </>
          )
        }
      </AnchorIconButton>
      <div
        className="dropdown-menu"
        style={{
          background: adjustColorBrightness(
            sellerConfigs.Theme.ColorPalette["Body"],
            -10
          ),
        }}
      >
        <div
          className="dropdownmenu-wrapper"
          style={{
            background: "transparent",
          }}
        >
          <div
            className="dropdown-cart-header"
            style={{
              borderColor: sellerConfigs.Theme.ColorPalette["Gray-60"],
            }}
          >
            <span
              style={{
                color: sellerConfigs.Theme.ColorPalette["Gray-30"],
              }}
            >
              {cartItems.length} Items
            </span>
            <Link
              to={`${process.env.PUBLIC_URL}/pages/cart`}
              className="float-right"
              style={{
                color: sellerConfigs.Theme.ColorPalette["Gray-20"],
              }}
            >
              View Cart
            </Link>
          </div>
          <div className="dropdown-cart-products">
            {cartItems.map((item, index) => (
              <div className="product" key={"product" + index}>
                <div className="product-details">
                  <h2 className="product-title">
                    <Link to={`${process.env.PUBLIC_URL}/product-detail`}>
                      {item.ProductInfo.Description}
                    </Link>
                  </h2>
                  <span className="cart-product-info">
                    <span className="cart-product-qty">
                      {item.Quantity} &times; {" "}
                    </span>
                    $
                    {item.ProductInfo.salePrice
                      ? item.ProductInfo.salePrice.toFixed(2)
                      : item.ProductInfo.Price.toFixed(2)}
                  </span>
                </div>
                <figure className="product-image-container">
                  <Link
                    to={`${process.env.PUBLIC_URL}/products/default/${item.ProductInfo.ProductID}`}
                    className="product-image"
                  >
                    <img
                      style={{ objectFit: "cover", height: "100%" }}
                      src={item.ProductInfo.ImageURL[0]}
                      alt="product"
                    />
                  </Link>
                  <Link
                    to="#"
                    className="btn-remove icon-cancel"
                    title="Remove Product"
                    onClick={(e) => handleRemoveFromCart(e, item)}
                  ></Link>
                </figure>
              </div>
            ))}
          </div>
          <div
            className="dropdown-cart-total"
            style={{
              color: sellerConfigs.Theme.ColorPalette["Gray-30"],
            }}
          >
            <span>Total</span>
            <span className="cart-total-price float-right">
              ${getCartTotal(cartItems).toFixed(2)}
            </span>
          </div>
          <div className="dropdown-cart-action">
            <AnchorButton
              href={`${process.env.PUBLIC_URL}/pages/checkout/shipping/two`}
              onClick={() =>
                props.history.push(
                  `${process.env.PUBLIC_URL}/pages/checkout/shipping/two`
                )
              }
              className={"btn btn-block " + btnClass}
              color={sellerConfigs.Theme.ColorPalette["White"]}
              bg={sellerConfigs.Theme.ColorPalette["Secondary"]}
              borderColor={adjustColorBrightness(
                sellerConfigs.Theme.ColorPalette["Secondary"],
                25
              )}
            >
              Checkout
            </AnchorButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartMenu;