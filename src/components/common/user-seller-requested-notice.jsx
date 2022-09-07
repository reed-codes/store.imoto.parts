import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from './breadcrumb';

const UserSellerRequestedNotice = () => (
    <>
        <Helmet>
            <title>Porto React Ecommerce - Not Approved</title>
        </Helmet>
        
        <h1 className="d-none">Porto React Ecommerce - Buyer Not Approved By Seller</h1>

        <div className="main">
            <Breadcrumb current="Access request Sent" />
            <div className="container">
                <div className="align-left mt-3">
                    <div className="cart-title ">
                        <h2>Access Request Sent</h2>
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
                                        <i className="fas fa-exclamation-circle cart-empty"></i>
                                    </td>
                                </tr>
                                <tr className="border-0 py-0">
                                    <td
                                        colSpan="6"
                                        className="px-3 py-2 text-center cart-empty"
                                    >
                                        You have requested access, but we are awaiting the seller to approve.
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

export default UserSellerRequestedNotice;