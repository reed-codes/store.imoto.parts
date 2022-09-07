import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const OrderPlacedNotice = ()  => (
    <>
        <Helmet>
            <title>Porto React Ecommerce - Request User Seller Record</title>
        </Helmet>
        
        <h1 className="d-none">Porto React Ecommerce - Request User Seller Record</h1>

        <div className="main">
            <div className="container">
                <div className="align-left mt-3">
                    <div className="cart-title ">
                        <h2>Order Successfully placed</h2>
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
                            <tbody className="wishlist-items-wrapper">
                                <tr className="border-0 py-0">
                                    <td
                                        colSpan="6"
                                        className="px-3 py-2 text-center"
                                    >
                                        <i className="fas fa-check-circle cart-empty text-success"></i>
                                    </td>
                                </tr>
                                <tr className="border-0 py-0">
                                    <td
                                        colSpan="6"
                                        className="px-3 py-2 text-center cart-empty"
                                    >
                                        Your order has been successfully placed. You may continue shopping track the order(s) you have placed.
                                    </td>
                                </tr>
                                <tr className="border-0 py-0" style={{marginTop: 20, marginBottom: 20}}>
                                    <td colSpan="6" className="px-3 text-center  mt-3">
                                        <Link className="btn btn-go-shop" to="#" onClick={ () => alert("heelloo")} style={{margin: 10}}>
                                            Track Order
                                        </Link>
                                        
                                        <Link className="btn btn-go-shop" to={`${process.env.PUBLIC_URL}/`} style={{margin: 10}} >
                                            Continue Shopping
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="mb-6"></div>
        </div>
    </>
)

export default OrderPlacedNotice;