import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { instanceCOMAPI } from '../../axios/axios-instances';
import {Auth} from '@aws-amplify/auth';

import Breadcrumb from './breadcrumb';
import Alert from './alert';

import SellerConfigContext  from '../../store/sellerConfigContext';

const RequestUserSellerRecord = ()  => {
    const { sellerConfigs } = useContext(SellerConfigContext);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: ""
    });
    const [accountNumber, setAccountNumber] = useState(null);
    /**
     * handleRequestUserSellerClicked, this function will be used to make a
     * request for a user seller record to the current seller.
     */
    const handleRequestUserSellerClicked = async () => {
        let message = "";
        let type = "";

        try {
            const userSellerRecord = await getUserSellerRequestBody();
            const ax = await instanceCOMAPI();
            await ax.post("userseller", userSellerRecord);

            type = "success";
            message = "User Seller record has been sent.";
            // force a rerender by reloading screen
            // window.location.reload(false);
            localStorage.setItem("USERSELLER_EXIST", true)
        } catch (error) {
            type = "danger";
            message = error.message;
        }
        
        // display an alert for the user.
        setAlert({
            open: true,
            type: type,
            message: message    
        });
    }

    /**
     * getUserSellerRequestBody, function used to obtain the user seller request
     * entity that will be posted to DynamoDB via COMAPI.
     * 
     * @returns {Object}    userSellerRequestBody   the body that will be posted
     */
    const getUserSellerRequestBody = async () => {
        let userID = "";

        // get the user id given that the user is authenticated.
        try {
            const user = await Auth.currentAuthenticatedUser()    
            userID = user.username
        } catch (error) {
            console.error("Current User Not Authenticated:");
        }

        return {
            UserID: userID,
            SellerID: sellerConfigs.SellerID,
            Status: "Requested",
            Accounts: [
                accountNumber || null
            ],
            Type: "Customer",
        };
    }
    
    /**
     * handleCloseAlertClicked, handler function used to reset the user alert
     * component. The component props will be set to they zero values, and it
     * is triggered on close button click.
     */
     const handleCloseAlertClicked = () => {
        setAlert({
            open: false,
            message: '',
            type: ''
        });
    }

    return (
        <>
            <Helmet>
                <title>Porto React Ecommerce - Request User Seller Record</title>
            </Helmet>
            
            <h1 className="d-none">Porto React Ecommerce - Request User Seller Record</h1>

            <div className="main">
                <Breadcrumb current="Request User Seller Record" />
                <div className="container">
                    <div className="align-left mt-3">
                        <div className="cart-title ">
                            <h2>Request User Seller Record</h2>
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
                                            <i className="fas fa-user-friends cart-empty"></i>
                                        </td>
                                    </tr>
                                    <tr className="border-0 py-0">
                                        <td
                                            colSpan="6"
                                            className="px-3 py-2 text-center cart-empty"
                                        >
                                            To gain access you need to request for a user seller record. The request will need to be approved before you gain access.
                                        </td>
                                    </tr>
                                    <tr className='col-md-12'>
                                        <td className='d-flex justify-content-center flex-column align-items-center mt-3'>
                                            <label className='d-block' >
                                                Enter Account Number
                                            </label>
                                            <input
                                                name='accountNumber'
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                                type='number'
                                                className='form-input mb-2'
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-0 py-0">
                                        <td colSpan="6" className="px-3 text-center">
                                            <Link
                                                className="btn btn-go-shop"
                                                to="#"
                                                onClick={ handleRequestUserSellerClicked  }
                                            >
                                                Request Access
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
            <Alert
                open={alert.open}
                close={handleCloseAlertClicked}
                type={alert.type}
                message={alert.message}
            />
        </>
    )
}

export default RequestUserSellerRecord;