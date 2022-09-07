import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import Breadcrumb from "../../../common/breadcrumb";
import withAuthCheck from "../../../hoc/withAuthCheck";
import { addListItemToList, createOrUpdateList, deleteListItemByListName } from "../../../../api";
import {
  removeFromWishlist,
  showQuickView,
  clearWishlist,
  addToCart,
  addToWishList,
  removeFromCart,
} from "../../../../action";

import { PricelistContext } from "../../../../store/PricelistContext";
import { CartWishListContext } from "../../../../store/CartWishlistContext";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { toast } from "react-toastify";

function Wishlist() {
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const { pricelistDispach } = useContext(PricelistContext);
  const { sellerConfigs } = useSellerConfig();

  const handleRemoveFromWishlist = async (e, item) => {
    e.preventDefault();
    const listItem = {
      ProductID: item.ProductID,
      Quantity: item.Quantity,
    };
    const [, error] = await deleteListItemByListName(sellerConfigs.SellerID, "wishlist", listItem.ProductID, listItem)
    if (error) {
      toast.error("Error occured while deliting list item");
      return;
    }
    toast.success("List Item Deleted");
    cartWishListDispach(removeFromWishlist(item));
  };

  const handleClearWishlist = async (e) => {
    e.preventDefault();
    const emptyList = {
      List: "wishlist",
      SellerID: sellerConfigs.SellerID,
      ListItems: []
    }

    if (cartWishList.wishlist.length > 0) {
      cartWishListDispach(clearWishlist());
      const [, error] = await createOrUpdateList(emptyList);
      if (error) {
        toast.error("Error clearing wishlist");
        return
      }
      toast.success("Cleared wishlist")
    }
  };

  const handleMoveItemFromWishListToCart = async (e, item) => {
    cartWishListDispach(addToCart(item.ProductInfo));
    cartWishListDispach(removeFromWishlist(item));
    e.preventDefault();

    let listItem = {
      ProductID: item.ProductID,
      Quantity: 1,
      ProductInfo: item.ProductInfo,
    };

    cartWishList.cart.map((product) => {
      if (product.ProductID === item.ProductID) {
        listItem.Quantity = product.Quantity + 1
        return
      }
    });

    const [, addToCartError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);
    const [, removeFromWishlistError] = await deleteListItemByListName(sellerConfigs.SellerID, "wishlist", listItem.ProductID, listItem);

    if (addToCartError === null && removeFromWishlistError === null) {
      toast.success("Added item to cart");
    } else {
      cartWishListDispach(addToWishList(item.ProductInfo));
      cartWishListDispach(removeFromCart(item));
      toast.error("Error adding item to cart");
    }
  };

  return (
    <>
      <Helmet>
        <title>Porto React Ecommerce - Wishlist Page </title>
      </Helmet>
      <h1 className="d-none">Porto React Ecommerce - Wishlist Page</h1>
      <div className="main">
        <Breadcrumb current="Wishlist" parent="pages" />
        <div className="container">
          {cartWishList.wishlist.length === 0 ? (
            <div className="align-left mt-3">
              <div className="wishlist-title ">
                <h2>My wishlist on Porto Store</h2>
              </div>
              <div className="box-content">
                <table
                  className="table-wishlist"
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
                        <i className="far fa-heart wishlist-empty"></i>
                      </td>
                    </tr>
                    <tr className="border-0 py-0">
                      <td colSpan="6" className="px-3 py-2 wishlist-empty">
                        No products added to the wishlist
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
            <>
              <div className="wishlist-table-container">
                <table className="table table-order table-wishlist">
                  <thead>
                    <tr>
                      <th className="product-thumbnail"></th>
                      <th className="product-name">Product Name</th>
                      <th className="product-unit-price">Unit Price</th>
                      <th className="product-stock-status">Stock Status</th>
                      <th className="product-action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartWishList.wishlist.map((item, index) => (
                      <React.Fragment key={"wishlist-item" + index}>
                        <tr>
                          <td className="product-thumbnail">
                            <figure className="position-relative mr-auto ml-auto">
                              <Link
                                to={`${process.env.PUBLIC_URL}/products/default/${item.ProductID}`}
                              >
                                <img
                                  style={{ objectFit: "cover" }}
                                  src={item.ProductInfo.ImageURL[0]}
                                  alt="product"
                                />
                              </Link>
                              <Link
                                to="#"
                                onClick={(event) =>
                                  handleRemoveFromWishlist(event, item)
                                }
                                className="remove remove-from-wishlist"
                              >
                                <i className="icon-cancel"></i>
                              </Link>
                            </figure>
                          </td>
                          <td className="product-title">
                            <Link
                              to={`${process.env.PUBLIC_URL}/products/default/${item.ProductID}`}
                            >
                              {item.ProductInfo.Description}
                            </Link>
                          </td>
                          <td className="price-box">
                            <span className="product-price">
                              ${item.ProductInfo.Price.toFixed(2)}
                            </span>
                          </td>
                          <td className="product-stock-status">
                            <span className="stock-status">
                              {item.ProductInfo.Stock > 10
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </td>
                          <td className="product-action">
                            <button 
                              className={"btn btn-add-cart"}
                              onClick={(e) => handleMoveItemFromWishListToCart(e, item)}
                            >
                              <span>Add to Cart</span>
                            </button>
                            <Link
                              to="#"
                              className="btn btn-quickview"
                              title="Quick View"
                              onClick={(e) => {
                                e.preventDefault();
                                pricelistDispach(
                                  showQuickView(item.ProductInfo)
                                );
                              }}
                            >
                              <i className="fas fa-external-link-alt"></i>
                              <span>Quick View</span>
                            </Link>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                    <React.Fragment>
                      <tr>
                        <td className="product-thumbnail"/>
                        <td className="product-title"/>
                        <td className="price-box">
                          <span className="product-price"/>
                        </td>
                        <td className="product-stock-status">
                          <span className="stock-status"/>
                        </td>
                        <td className="product-action">
                          <div className={"float-right"}>
                            <Link
                              to="#"
                              className="btn btn-outline-secondary btn-clear-cart"
                              onClick={handleClearWishlist}
                            >
                              Clear Wishlist
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default withAuthCheck(Wishlist);
