import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { Base64 } from "js-base64";

import { instanceCOMAPI } from "../../../axios/axios-instances";
import Alert from "./../../common/alert";
import Map from "./../../common/map";

import SellerConfigContext from "../../../store/sellerConfigContext";

const AddressModal = ({ open, closeModal, customStyles }) => {
    const { sellerConfigs } = useContext(SellerConfigContext);

    const storedUser = JSON.parse(
        Base64.decode(localStorage.getItem("SIGNUP-USER"))
    );

    const modalStyles = {
         ...customStyles,
         content: {
              ...customStyles.content,
              maxWidth: 870
         }
    }

    const [userAddress, setUserAddress] = useState({
        "address1": "",
        "address2": "",
        "address3": "",
        "address4": "",
        "address5": "",
        "addressType": "Office",
        "lat": 0,
        "lng": 0
    });

    const [alert, setAlert] = useState({
        open: false,
        type: "",
        message: ""
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setUserAddress({
                    ...userAddress,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            });
        }
    }, []);

    const handleAddressUpdate = event => {
        event.preventDefault();
        setUserAddress({
            ...userAddress,
            [event.target.name] : event.target.value
        });
    }


    const handleCloseAlertClicked = () => {
        setAlert({
            open: false,
            message: "",
            type: ""
        });
    }

    const handleLocateUserClicked = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setUserAddress({
                    ...userAddress,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            });
        }
    }

    const handleSaveAddressClicked = async () => {
        const userEntity = getUserEntity(storedUser);
        const userSellerEntity = getUserSellerEntity(storedUser);

        try {
            // save the user entity to dynamodb via comapi
            // Auth.currentSession().then((data) => {
            const ax = await instanceCOMAPI();
            await ax.post(`user`, userEntity)
            await ax.post(`userseller`,userSellerEntity)
            closeModal();
            // reload the page that the user is attemping to see after signing
            // in this will help in displaying the actual component instead on
            // the of the component that gets displayed when the user is not
            // signed in when attempting to go to a private route or a route
            // that expects the user to be signed in.
            window.location.reload(false);
        } catch(err) {
           setAlert({
                open: true,
                message: err.message,
                type: "danger"
            });
        }
 
    }

    /**
     * 
     * @param {*} userEntity 
     * 
     * @returns 
     */
    const getUserEntity = userEntity => {
        return {
            UserID: userEntity.userID,
            Name: userEntity.name,
            Email: userEntity.email,
            Country: userEntity.country,
            PhoneNumber: userEntity.phone,
            Accounts: [ userEntity.accountNumber ],
            Address:[ {
                    Type: userAddress.addressType,
                    Address1: userAddress.address1,
                    Address2: userAddress.address2,
                    Address3: userAddress.address3,
                    Address4: userAddress.address4,
                    Address5: userAddress.address5,
                    Coordinate: {
                        lon: userAddress.lng,
                        lat: userAddress.lat,
                    },
                }
            ],
            LoyaltyPrograms: [
              {
                Key: "Extra",
                Value: "",
              },
            ],
            Deleted: false,
            IsLockedOut: false,
            LastActiveDate: "2020-06-02T10:04:11.134Z"
        };
    }

    /**
     * getUserSellerRequestBody, function used to obtain the user seller request
     * entity that will be posted to DynamoDB via COMAPI.
     * 
     * @returns {Object}    userSellerRequestBody   the body that will be posted
     */
    const getUserSellerEntity = userEntity => {    
        // ask shuan about obtaining the sellerid 
        return {
            UserID: userEntity.userID,
            SellerID: sellerConfigs.SellerID,
            Status: "Requested",
            Accounts: [ userEntity.accountNumber ],
            Type: "Customer",
        };
    }

    return (
        <Modal
            isOpen={ open }
            onRequestClose={ closeModal }
            contentLabel="login Modal"
            className="login-popup"
            id="login-popup-form"
            overlayClassName="cart-modal-overlay"
            style={ modalStyles }
        >
            <div className="modal-wrapper"/>
                <div className="container">
                  <div className="row">
                      <div className = "col-md-6">
                         <h2 className="title mb-2">Address</h2>
                      </div>
                  </div>
                <div className="row">
                    <div className="col-md-6">
                        <Map
                            zoom={15}
                            height={"620px"}
                            draggable={true}
                            center={{
                                lat: userAddress.lat,
                                lng: userAddress.lng
                            }}
                            markerPosition={{
                                lat: userAddress.lat,
                                lng: userAddress.lng
                            }}
                            address={userAddress.streetAddress}
                            containerStyle = {{
                                height:"490px",
                                width:"100%",
                                padding: "8px"
                            }}
                        />
                        <button
                            type="button"
                            onClick = {handleLocateUserClicked}
                            className="btn btn-primary btn-md mt-1"
                        >
                            Locate Me
                        </button>
                    </div>
                    <hr className="col-md-12 mt-2 mb-2 mr-3 ml-3 d-block d-md-none"/>
                    <div className="col-md-6">
                        <form>
                            <div className="form-group form-group-sm">
                                <label>Address Type<span className="required">*</span></label>
                                <div className="select-custom">
                                    <select name="addressType" className="form-control form-control-sm">
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Industrial">Industrial</option>
                                    </select>
                                </div>
                            </div>

                            <label>Street Address <span className="required">*</span></label>
                            <input name="address1" onChange={(e) => handleAddressUpdate(e)} type="address" className="form-input form-wide mb-2" required/>

                            <label>Address Line 2 <span className="required">*</span></label>
                            <input name="address2" onChange={(e) => handleAddressUpdate(e)} type="text" className="form-input form-wide mb-2" required/>

                            <label>City/Town<span className="required">*</span></label>
                            <input name="address3" onChange={(e) => handleAddressUpdate(e)} type="text" className="form-input form-wide mb-2" required/>

                            <label>Province/State<span className="required">*</span></label>
                            <input name="address4" onChange={(e) => handleAddressUpdate(e)} type="text" className="form-input form-wide mb-2" required/>

                            <label>Zip Code<span className="required">*</span></label>
                            <input name="address5" onChange={(e) => handleAddressUpdate(e)} type="zip" className="form-input form-wide mb-2" required/>
                            <div
                                className="form-footer" 
                                style={{
                                    display:"flex",
                                    justifyContent:"space-between"
                                }}
                            >
                                <button
                                    className="btn btn-primary btn-md"
                                    type="button"
                                    onClick = {handleSaveAddressClicked}
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <button
                title="Close (Esc)"
                type="button"
                className="mfp-close"
                onClick={ closeModal }
            >
                ×
            </button>
            <Alert
                open={alert.open}
                close={handleCloseAlertClicked}
                type={alert.type}
                message={alert.message}
            />
        </Modal>
    );
}

export default AddressModal;