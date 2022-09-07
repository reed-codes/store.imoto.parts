import React, { useContext } from "react";
import { Link } from "react-router-dom";

import PriceSummary from "./price-summary";
import { CartWishListContext } from "../../../../store/CartWishlistContext";

const ProductsDetails = () => {
    const { cartWishList } = useContext(CartWishListContext);

    return (
        <>
            <table className="table table-order table-wishlist">
                <thead>
                    <tr>
                        <th className="product-thumbnail"></th>
                        <th className="product-name">Product Name</th>
                        <th className="product-stock-status">Qty</th>
                        <th style={{textAlign:"right", paddingRight: 0}}>Price/Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {cartWishList.cart.map((item, index) => (
                        <React.Fragment key={"wishlist-item" + index}>
                            <tr>
                                <td className="product-thumbnail">
                                    <figure className="position-relative mr-auto ml-auto">
                                    <Link to={`${process.env.PUBLIC_URL}/products/default/${item.ProductID}`}>
                                        <img
                                        style={{ marginLeft: 0, objectFit: "cover" }}
                                        src={item.ProductInfo.ImageURL[0]}
                                        alt="product"
                                        />
                                    </Link>
                                    </figure>
                                </td>
                                <td className="product-title">
                                    <Link to={`${process.env.PUBLIC_URL}/products/default/${item.ProductID}`}>
                                        {item.ProductInfo.Description}
                                    </Link>
                                </td>
                                <td className="product-stock-status">
                                    <span className="stock-status">
                                    {item.Quantity}
                                    </span>
                                </td>
                                <td className="price-box" style={{textAlign:"right", paddingRight: 0}}>
                                    <span >
                                        ${item.ProductInfo.Price.toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className="row">
                <div className="col-6"/>
                <div className="col-6">
                    <PriceSummary/>
                </div>
            </div>
        </>
    )
}

export default ProductsDetails;