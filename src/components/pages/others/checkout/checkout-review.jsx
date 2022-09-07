import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SlideToggle } from 'react-slide-toggle';
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import Breadcrumb from '../../../common/breadcrumb';
import CheckoutProgessBar from '../common/checkout-progress-bar';

import withAuthCheck from '../../../hoc/withAuthCheck';
import { instanceCOMAPI } from '../../../../axios/axios-instances';
import { CartWishListContext } from "../../../../store/CartWishlistContext";

import OrderPlacedNotice from '../common/order-placed-notice';
import ProductsDetails from '../common/product-details';


import { getISODateFormat } from '../../../../utils/helpers';
import UserSellerContext from '../../../../store/UserSellerContext';
import { getCartTotal } from '../../../../utils';
import { clearCart } from '../../../../action';
import { createOrUpdateList } from '../../../../api';

const CheckoutReview = (props) => {
    const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
    const { userSeller } = useContext(UserSellerContext);

    const [orderPlaced, setOrderplaced] = useState(false); 
    const [displayingComments, setDisplayingComments] = useState(
        cartWishList.order.Comments.length > 165 ?
        `${cartWishList.order.Comments.substring(0, 166)}...` : cartWishList.order.Comments
    );

    // if in this page/route we dont have a DeliveryMethod set take the
    // user back to step one, delivery methods and address if necessary
    if (!cartWishList.order.DeliveryMethod) {
        props.history.replace("/pages/checkout/shipping/two")
    }

    const toggleReadMore = (event) => {
        event.preventDefault();
        if (displayingComments.length > 169) {
            setDisplayingComments(`${cartWishList.order.Comments.substring(0, 166)}...`);
        } else {
            setDisplayingComments(cartWishList.order.Comments);
        }
    }

    const handlePreviousClicked = (event) => {
        event.preventDefault();
        props.history.goBack();
    }

    const handlePlaceOrder = async () => {
        const order = getOrderDetails();

        const ax = await instanceCOMAPI();
        try {
            await ax.post("order", order);
            setOrderplaced(true);

            // clear the order and dispatch.
            cartWishListDispach(clearCart());
            await createOrUpdateList({
                List: "cart",
                SellerID: userSeller.Seller.SellerID,
                ListItems: []
            });
            toast.success("Order successfully created");
        } catch (error) {
            toast.error("Error creating order")
        }
    }

    const getOrderDetails = () => {
        let { order } = cartWishList;
        const cartTotal = getCartTotal(cartWishList.cart);
        const cartTax = cartTotal * (14.0/100);

        delete order.Address.Sellected;

        order.AccountID =  userSeller.User.AccountID || "";
        order.PaymentTerms = "COD";
        order.SellerID = userSeller.Seller.SellerID;
        order.UserID = userSeller.User.UserID;
        order.OrderID = uuidv4();
        order.Status = "NeedsSellerApproval";
        order.CreateDate = getISODateFormat();
        order.RequiredByDate = getISODateFormat(order.RequiredByDate);
        order.TotalExcl = cartTotal;
        order.TotalTax = cartTax;
        order.Total = cartTotal + cartTax;

        order.Items = cartWishList.cart.map((cartItem, index) => {
            return {
                ItemID: index,
                ProductID: cartItem.ProductID,
                Description: cartItem.ProductInfo.Description,
                OrderQty: cartItem.Quantity,
                OrderPrice: cartItem.ProductInfo.Price * cartItem.Quantity,
                ConfirmedQty: 0,
                ConfirmedPrice: 0,
            };
        });
        return order;
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
                    <CheckoutProgessBar active={ orderPlaced ? 4 : 3 } />
                    {orderPlaced ? <OrderPlacedNotice/> :
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="checkout-info-box">
                                    <h3 className="step-title">Required By:</h3>
                                    <p>{(new Date(cartWishList.order.RequiredByDate)).toDateString()}</p>
                                </div>
                                <div className="checkout-info-box">
                                    <h3 className="step-title">Reference:</h3>
                                    <p>{cartWishList.order.Reference}</p>
                                </div>
                                <div className="checkout-info-box">
                                    <h3 className="step-title">Delivery Method:</h3>
                                    <p>Order to be: 
                                        <strong>
                                            {cartWishList.order.DeliveryMethod === "collect" ? " collected" : " delivered"}
                                        </strong>
                                    </p>
                                </div>
                                {cartWishList.order.DeliveryMethod === "delivery" &&  
                                    <div className="checkout-info-box">
                                        <h3 className="step-title">Delivered To:</h3>
                                        <address>
                                            {cartWishList.order.Address.Type} <br />
                                            {cartWishList.order.Address.Address1} <br />
                                            {cartWishList.order.Address.Address2} <br />
                                            {cartWishList.order.Address.Address3} <br />
                                            {cartWishList.order.Address.Address4} <br />
                                            {cartWishList.order.Address.Address5} <br />
                                        </address>
                                    </div>
                                }
                                <div className="checkout-info-box">
                                    <h3 className="step-title">Comments:</h3>
                                    <p style={{margin: 0, padding: 0}}>
                                        {displayingComments}
                                    </p>
                                    {cartWishList.order.Comments.length > 169 &&
                                        <Link to="#" className="float-left" onClick={toggleReadMore}>
                                            read {displayingComments.length > 169 ? "less": "more" }
                                        </Link>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-8 order-lg-first">
                                <div className="checkout-payment">
                                    <ProductsDetails/>
                                    <div className="clearfix" style={{marginTop: 20}}>
                                        <Link to="#" onClick={handlePreviousClicked} className="btn btn-secondary btn-sm">Back</Link>
                                        <Link to="#" onClick={handlePlaceOrder} className="btn btn-primary float-right btn-sm">Place Order</Link>
                                    </div>
                                </div>
                                <SlideToggle collapsed={ false }>
                                    {( { onToggle, setCollapsibleElement, toggleState } ) => (
                                        <div className="checkout-discount">
                                            <h4>
                                                <Link data-toggle="collapse" to="#checkout-discount-section" className={ toggleState.toLowerCase() } onClick={ onToggle }>Apply Discount Code</Link>
                                            </h4>
                                            <div className="collapse show" id="checkout-discount-section" ref={ setCollapsibleElement } style={ { overflow: 'hidden' } }>
                                                <form className="row" action="#">
                                                    <input type="text" className="form-control form-control-sm" placeholder="Enter discount code" required />
                                                    <button className="btn btn-sm btn-outline-secondary" type="submit">Apply Discount</button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </SlideToggle>
                            </div>
                        </div> 
                    }
                </div>
            </div>
        </>
    )
}

export default withAuthCheck(withRouter(CheckoutReview));