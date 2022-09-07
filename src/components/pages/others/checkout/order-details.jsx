import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from "react-toastify";

import Breadcrumb from '../../../common/breadcrumb';
import CheckoutProgessBar from '../common/checkout-progress-bar';
import OrderSummary from '../common/order-summary';

import withAuthCheck from '../../../hoc/withAuthCheck';
import { CartWishListContext } from '../../../../store/CartWishlistContext';

import { setOrderDetails } from '../../../../action';

const OrderDetails = (props) => {
    const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);

    const [localOrderDetails, setLocalOrderDetails] = useState({...cartWishList.order});

    const handleNextClicked = (event) => {
        event.preventDefault();
        if (!(localOrderDetails.Comments || localOrderDetails.RequiredByDate || localOrderDetails.Reference)) {
            toast.error("Order details can not be empty");
            return;
        }

        cartWishListDispach(setOrderDetails(localOrderDetails));
        props.history.push("/pages/order-review");
    }

    const handleBackClicked = (event) => {
        event.preventDefault();
        props.history.goBack();
    }

    const handleOrderDetailsChange = (event) => {
        event.preventDefault();
        setLocalOrderDetails({
            ...localOrderDetails,
            [event.target.name] : event.target.value
        });
    }

    return (
        <>
            <Helmet>
                <title>Porto React Ecommerce - Checkout Page </title>
            </Helmet>
            <h1 className="d-none">Porto React Ecommerce - Checkout Page</h1>
            <div className="main">
                <Breadcrumb current="Checkout" parent="pages" />
                <div className="container">
                    <CheckoutProgessBar active={ 2 } />
                    <div className="row">
                        <div className="col-lg-4">
                            <OrderSummary />
                        </div>
                        <div className="col-lg-8 order-lg-first">
                            <div className="checkout-payment">
                                <h2 className="step-title">Order Details:</h2>
                                <div className="form-group-custom-control">
                                    <label>Required By Date <span className="required">*</span></label>
                                    <input name="RequiredByDate" value={localOrderDetails.RequiredByDate} type="date" onChange={(e) => handleOrderDetailsChange(e)} className="form-input form-wide mb-2" required/>

                                    <label>Reference<span className="required">*</span></label>
                                    <input name="Reference" type="text" value={localOrderDetails.Reference} className="form-input form-wide mb-2" onChange={(e) => handleOrderDetailsChange(e)} required/>

                                    <label>Comments<span className="required">*</span></label>
                                    <textarea name="Comments" rows={3} type="text" value={localOrderDetails.Comments} className="form-input form-wide mb-2" onChange={(e) => handleOrderDetailsChange(e)} required/>
                                </div>
                                <div className="clearfix">
                                    <Link to="#" onClick={handleBackClicked} className="btn btn-secondary btn-sm">Back</Link>
                                    <Link to="#" onClick={handleNextClicked} className="btn btn-primary float-right btn-sm">Next</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withAuthCheck(withRouter(OrderDetails));