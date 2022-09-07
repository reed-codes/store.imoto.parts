import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Breadcrumb from './breadcrumb';

const NotSignedinNotice = ({ openSigninModal })  => {

    return (
        <>
            <Helmet>
                <title>Porto React Ecommerce - Signin Page </title>
            </Helmet>
            
            <h1 className="d-none">Porto React Ecommerce - Signin Page</h1>

            <div className="main">
                <Breadcrumb current="Signin" />
                <div className="container">
                    <div className="align-left mt-3">
                        <div className="cart-title ">
                            <h2>Sign in to continue</h2>
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
                                            <i className="icon-user-2 cart-empty"></i>
                                        </td>
                                    </tr>
                                    <tr className="border-0 py-0">
                                        <td
                                            colSpan="6"
                                            className="px-3 py-2 text-center cart-empty"
                                        >
                                            Sign in to continue
                                        </td>
                                    </tr>
                                    <tr className="border-0 py-0">
                                        <td colSpan="6" className="px-3 text-center">
                                            <Link
                                                className="btn btn-go-shop"
                                                to="#"
                                                onClick={ openSigninModal  }
                                            >
                                                Sign In
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
}

export default NotSignedinNotice;