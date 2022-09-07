import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import Breadcrumb from "../../../common/breadcrumb";
import { clearCart } from "../../../../action";
import { HIDE_CART_MODAL } from '../../../../constants/action-types';
import withAuthCheck from '../../../hoc/withAuthCheck';
import { CartWishListContext } from "../../../../store/CartWishlistContext";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { createOrUpdateList } from "../../../../api";
import { getCartTotal } from "../../../../utils";
import ProductItem from "../common/product-item";

function ShoppingCart() {
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const { sellerConfigs } = useSellerConfig();
  const cartItems = cartWishList.cart ? cartWishList.cart : [];

  useEffect(() => {
    cartWishListDispach({ type: HIDE_CART_MODAL });
  }, []);

  const handleClearCart = async (e) => {
    e.preventDefault();
    const emptyCart = {
      List: "cart",
      SellerID: sellerConfigs.SellerID,
      ListItems: []
    }

    if (cartWishList.cart.length > 0) {
      cartWishListDispach(clearCart());
    }

    const [, error] = await createOrUpdateList(emptyCart);
    if (error === null) {
      toast.success("Successfully cleared cart")
      return
    }
    toast.error("Error");
  };

  return (
    <>
      <Helmet>
        <title>Porto React Ecommerce - Cart Page </title>
      </Helmet>
      <h1 className="d-none">Porto React Ecommerce - Cart Page</h1>
      <div className="main">
        <Breadcrumb current="Shopping Cart" />
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="align-left mt-3">
              <div className="cart-title ">
                <h2>My Cart on Porto Store</h2>
              </div>

              <div className="box-content">
                <table
                  className="table-cart"
                  data-pagination="no"
                  data-per-page="5"
                  data-page="1"
                  data-id=""
                  data-token=""
                >
                  <thead className="d-none">
                    <tr>
                      <th className="product-thumbnail"></th>

                      <th className="product-name">
                        <span className="nobr">Product</span>
                      </th>

                      <th className="product-price">
                        <span className="nobr">price</span>
                      </th>

                      <th className="product-stock-status">
                        <span className="nobr">Stock status</span>
                      </th>

                      <th className="product-add-to-cart">
                        <span className="nobr">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="wishlist-items-wrapper">
                    <tr className="border-0 py-0">
                      <td colSpan="6" className="px-3 py-2 text-center">
                        <i className="icon-bag-1 cart-empty"></i>
                      </td>
                    </tr>
                    <tr className="border-0 py-0">
                      <td
                        colSpan="6"
                        className="px-3 py-2 text-center cart-empty"
                      >
                        No products added to the cart
                      </td>
                    </tr>
                    <tr className="border-0 py-0">
                      <td colSpan="6" className="px-3 text-center">
                        <Link
                          className="btn btn-go-shop"
                          to={`${process.env.PUBLIC_URL}/categories/full-width`}
                        >
                          GO SHOP
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-table-container">
                  <table className="table table-cart">
                    <thead>
                      <tr>
                        <th className="product-col">Product</th>
                        <th className="price-col">Price</th>
                        <th className="qty-col">Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) =>
                        <ProductItem
                          key={"CartItem" + index}
                          product={item}
                          index={index}
                        />
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="clearfix">
                          <div className="float-left">
                            <Link
                              to={`${process.env.PUBLIC_URL}/categories/full-width`}
                              className="btn btn-outline-secondary"
                            >
                              Continue Shopping
                            </Link>
                          </div>

                          <div className="float-right">
                            <Link
                              to="#"
                              className="btn btn-outline-secondary btn-clear-cart"
                              onClick={handleClearCart}
                            >
                              Clear Shopping Cart
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="cart-summary">
                  <h3>Summary</h3>
                  <table className="table table-totals">
                    <tbody>
                      <tr>
                        <td>Subtotal</td>
                        <td>${getCartTotal(cartItems).toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td>Tax</td>
                        <td>$0.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Order Total</td>
                        <td>${getCartTotal(cartItems).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="checkout-methods">
                    <Link
                      to={`${process.env.PUBLIC_URL}/pages/checkout/shipping/two`}
                      className="btn btn-block btn-sm btn-primary"
                    >
                      Go to Checkout
                    </Link>
                  </div>
                </div>
                <div className="cart-discount">
                  <h4>Apply Discount Code</h4>
                  <form action="#">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Enter discount code"
                        required
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-sm btn-primary"
                          type="submit"
                        >
                          Apply Discount
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mb-6"></div>
      </div>
    </>
  );
}
export default withAuthCheck(ShoppingCart);
