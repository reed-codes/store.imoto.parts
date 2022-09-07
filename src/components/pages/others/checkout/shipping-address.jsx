import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { withRouter } from "react-router";
import { toast } from 'react-toastify';

import Breadcrumb from '../../../common/breadcrumb';
import CheckoutProgessBar from '../common/checkout-progress-bar';
import ShippingForm from '../common/shipping-form';
import OrderSummary from '../common/order-summary';

import withAuthCheck from '../../../hoc/withAuthCheck';
import { instanceCOMAPI } from '../../../../axios/axios-instances';
import UserSellerContext from '../../../../store/UserSellerContext';
import { CartWishListContext } from '../../../../store/CartWishlistContext';
import {
  setDeliveryAddress,
  setDeliveryMethod,
  updateUserAddress,
  addUserAddress
} from '../../../../action';
import { getSellerDeliveryMethods } from '../../../../utils/helpers';

const EMPTY_ADDRESS = {
  Type: "",
  Address1:"" ,
  Address2: "",
  Address3: "",
  Address4: "",
  Address5: ""
}

const ShippingAddress = (props) => {
  const { userSeller, userSellerDispatch } = useContext(UserSellerContext);
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);

  const sellerDeliveryMethods = getSellerDeliveryMethods(userSeller.Seller.Options);

  const [ open, setOpen ] = useState( false );
  const [ address, setAddress ] = useState(EMPTY_ADDRESS);
  const [ editingAddress, setEditingAddress ] = useState(-1);
  const [ activeshippingAddress, setActiveShippingAddress ] = useState(cartWishList.order.Address.Selected);
  const [ collect, setCollect ] = useState(cartWishList.order.DeliveryMethod === "collect");
   
  const toggleCollect = () => {
    setCollect(() => !collect);
  }
  
  const handleOpenModal = (event) => {
    event.preventDefault();
    setOpen( true );
  }

  const handleCloseModal = (event) => {
    event.preventDefault();
    setEditingAddress(-1);
    setOpen( false );
  }

  const handleOpenEditModal = (event, index) => {
    event.preventDefault()
    setEditingAddress(index)
    setAddress(userSeller.User.Address[index])
    setOpen( true );
  }

  const handleSaveAddressClicked = async () => {   
    const userCopy = {...userSeller.User};
    if (editingAddress !== -1) {
      userCopy.Address[editingAddress] = { ...address };
      setEditingAddress(-1);
      userSellerDispatch(updateUserAddress(userCopy.Address));
    } else {
      userCopy.Address.push(address);
      userSellerDispatch(addUserAddress(userCopy.Address));
    }

    const ax = await instanceCOMAPI();
    try {
      await ax.post("user", userCopy);
      toast.success("Address successfully updated")
    } catch (error) {
      toast.error("Error updating address")
    }

    setAddress({...EMPTY_ADDRESS});
    setOpen(false);
  }

  const handleChangeAddress = (event) => {
    event.preventDefault();
    setAddress({
        ...address,
        [event.target.name] : event.target.value
    });
  }

  const handleNextClicked = (event) => {
    event.preventDefault();
    // Check if the delivery method is not "Collect" and if the user has addresses
    // if thats the case the dispatch the selected address and index of the selected
    // address
    if (!collect && userSeller.User.Address.length > 0) {
      let shippingAddress = userSeller.User.Address[activeshippingAddress];
      shippingAddress.Selected = activeshippingAddress;

      cartWishListDispach(setDeliveryAddress(shippingAddress));
    }
    // Check the 'collect' FLAG if true then DeliveryMethod is collect otherwise delivery
    cartWishListDispach(setDeliveryMethod(collect ? "collect" : "delivery"));

    props.history.push("/pages/order-details");
  }

  return (
    <>
      <Helmet><title>Delivery Page</title></Helmet>
      <h1 className="d-none">Delivery Page</h1>
      <div className="main">
        <Breadcrumb current="Checkout" parent="pages" />
        <div className="container">
          <CheckoutProgessBar />
          <div className="row">
            <div className="col-lg-8">
              <ul className="checkout-steps">
                <li>
                  <h2 className="step-title">Delivery Address</h2>
                  {sellerDeliveryMethods.Collect &&
                    <div className="checkout-payment">
                      <div className="form-group-custom-control">
                          <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="change-bill-address" checked={collect} onChange={toggleCollect}  />
                              <label className="custom-control-label" htmlFor="change-bill-address">Collect the order</label>
                          </div>
                      </div>
                    </div>
                  }
                  <div className="shipping-step-addresses">
                    {sellerDeliveryMethods.Delivery && !collect && userSeller.User.Address.length !== 0 && userSeller.User.Address.map((address, index) =>
                      <div className={`shipping-address-box ${index === activeshippingAddress && "active"}`} key={index}>
                        <address>
                          { address.Type} <br />
                          { address.Address1} <br />
                          { address.Address2} <br />
                          { address.Address3} <br />
                          { address.Address4} <br />
                          { address.Address5} <br />
                        </address>
                        <div className="address-box-action clearfix">
                          <Link
                            to="#"
                            onClick={(e) => handleOpenEditModal(e, index)}
                            className="btn btn-sm btn-link"
                          >
                            Edit
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-sm btn-outline-secondary float-right"
                            onClick={() => setActiveShippingAddress(index)}
                          >
                            Deliver Here
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="checkout-steps-action" style={{marginTop : 20}}>
                      {sellerDeliveryMethods.Delivery && !collect &&
                        <Link
                          to="#"
                          className="btn btn-sm btn-secondary"
                          onClick={ handleOpenModal }
                        >
                          ADD ADDRESS
                        </Link>
                      }
                      <Link
                        to="#"
                        className="btn btn-primary btn-sm float-right"
                        onClick={handleNextClicked}
                      >
                        NEXT
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-4">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
      <ShippingForm
        open={open}
        handleCloseModal={handleCloseModal}
        handleSaveAddressClicked={handleSaveAddressClicked}
        address={address}
        handleChangeAddress={handleChangeAddress}
      />
    </>
  )
}

export default withAuthCheck(withRouter(ShippingAddress));