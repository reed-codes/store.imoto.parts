import React, { useEffect, useState, useContext, useReducer } from 'react';
import { Auth } from "aws-amplify";

import SellerConfigContext from "../../../../store/sellerConfigContext.js";
import UserSellerContext from "../../../../store/UserSellerContext"

import Alert from '../../../common/alert.jsx';

// Here are all the ACTIONS used in the reducer
const ACTIONS = {
    HANDLE_INPUT_TEXT : "handleInputText",
    ADD_LOYALTY_PROGRAM : "addLoyaltyProgram",
    REMOVE_LOYALTY_PROGRAM : "removeLoyalyProgram",
}

const USERENTITY = {
    Name: "Joe Bloggs",
    Email: "joe@bloggs.com",
    Country: "ZA",
    LoyaltyPrograms: [
      {
        Key: "Extra",
        Value: "3321"
      }
    ]
  }

const formReducer = (state, action) => {
    if (action.type === ACTIONS.HANDLE_INPUT_TEXT) {
        return {
            ...state,
            [ action.field ]: action.payload,
        };
    }
}

const Account = () => {
    const { user } = useContext(UserSellerContext);
    const { sellerConfigs } = useContext(SellerConfigContext);
    const [ userDetails, dispatch ] = useReducer(formReducer, USERENTITY);
    const [ showLoyaltyPrograms, setShowLoyaltyPrograms ] = useState(false);
    const [ loyaltyPrograms, setLoyaltyPrograms ]  = useState([]);
    const [ isEmail, setIsEmail ] = useState(false);

    const [userLoyaltyPrograms, setUserLoyaltyprograms] = useState(userDetails.LoyaltyPrograms);
    const [alert, setAlert] = useState({
        openPassword: true,
        openUpdate: true,
        message: "",
        type: ""
    });

    const [ password, setPassword ] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        const setUserType = async () => {
            try {
                const { username } = await Auth.currentAuthenticatedUser();
                setIsEmail(!(username.includes("google") || username.includes("facebook")))
            } catch (error) {
                setAlert({
                    openUpdate: true,
                    type:'danger',
                    message:"Failed getting the cognito user"
                });
            }
        }

        setUserType();
    }, []);

    // this use effect should reun whenever the user country changes
    // it will update the state variable for the loyalty programs that a user
    // should see based on their selected country.
    useEffect(() => {
        if (sellerConfigs && sellerConfigs.DefaultCountryLoyaltyPrograms) {
            setLoyaltyPrograms(
                sellerConfigs.DefaultCountryLoyaltyPrograms[userDetails.Country]
            );
        }
    }, [userDetails.Country]);

    const handleCloseAlertClicked = () => {
        setAlert({
            openPassword: false,
            openUpdate: false,
            message: '',
            type: ''
        });
    }

    // handleTextChange handles the input changes and updates state
    const handleTextChange = (event) => {
        dispatch({
            type : ACTIONS.HANDLE_INPUT_TEXT,
            field : event.target.name,
            payload : event.target.value,
        });
    };

    // handlePasswordInputChange will update the userDetails state and populate it with new details if changed
    const handlePasswordInputChange = (event) => {
        event.preventDefault();
        setPassword({
            ...password,
            [event.target.name]: event.target.value,
        });
    };

    // handleUpdatepasswordClicked will update a new password on amplify
    const handleUpdatepasswordClicked = async () => {

        let message = "";
        if (password.confirmNewPassword || password.newPassword || password.confirmNewPassword) {
            if (password.newPassword === password.confirmNewPassword) {
                Auth.currentAuthenticatedUser()
                    .then((user) => {
                        return Auth.changePassword(
                            user,
                            password.oldPassword,
                            password.newPassword
                        );
                    })
                    .then((data) => alert(data))
                    .catch((error) => 
                        message = "Failed to change password."
                    );
            } else {
                message = "Passwords do not match."
            }
        } else {
           message = "Current, New or Confirm New Password can not be empty.";
        }

        setAlert({
            openPassword: true,
            type: "danger",
            message: message
        });
    };

    // handleUpdateUser will update user data in DynamoDB via COMAPI
    const handleUpdateUserClicked = async () => {
        try {
            setAlert({
                openUpdate: true,
                type: 'success',
                message: 'User details updated successfully.'
            });
        } catch (error) {
            setAlert({
                openUpdate: true,
                type: 'danger',
                message: 'Failed updating the user details.'
            });
        }
    };

    /**
     * Function used to add or remove a loyalty program based on the value
     * of checked the index will determin the position of the loyalty program
     * to be removed or added.
     * 
     * @param {String}  checked  the value hold the checked status.
     * @param {Integer} index    the position of the item checked.
     */
    const handleCheckLoyaltyPrograme = (checked, index) => {
        let tempLoyaltyPrograms = [ ...userLoyaltyPrograms ];

        if (checked && tempLoyaltyPrograms.Key !== loyaltyPrograms[index].Option) {
            tempLoyaltyPrograms.push({
                Key: loyaltyPrograms[index].Option,
                Value: "",
            });
        } else {
            tempLoyaltyPrograms.splice(index, 1);
        }

        setUserLoyaltyprograms(tempLoyaltyPrograms)
    }

    const handleLoyaltyProgramValueChange = (value, index) => {
        let tempLoyaltyPrograms = [ ...userLoyaltyPrograms ];

        if (tempLoyaltyPrograms[index]) {
            tempLoyaltyPrograms[index].Value = value;
        }

        setUserLoyaltyprograms(tempLoyaltyPrograms);
    }

    return (
        <>
            <h2>Edit Account Information</h2>
            <form>
                <Alert
                    open={alert.openUpdate}
                    close={handleCloseAlertClicked}
                    type={alert.type}
                    message={alert.message}
                />
                <div className="form-group required-field">
                    <label htmlFor="acc-email">Name</label>
                    <input type="text" className="form-control" value={userDetails.Name} name={"Name"} onChange={(event) => handleTextChange(event)} required />
                </div>
                <div className="form-group required-field">
                    <label htmlFor="acc-email">Email</label>
                    <input type="email" className="form-control" value={userDetails.Email} name={"Email"} onChange={(event) => handleTextChange(event)} required />
                </div>
                <div className="form-group required-field">
                    <label htmlFor="acc-email">Phone Number</label>
                    <input type="number" className="form-control" value={userDetails.PhoneNumber} name={"PhoneNumber"} onChange={(event) => handleTextChange(event)} required />
                </div>
                <div className="form-group required-field">
                    <label htmlFor="acc-mname">Country</label>
                    <div className="select-custom">
                        <select onChange={(event) => handleTextChange(event)} value={userDetails.Country} name={"Country"} className="form-control form-control" >
                            { sellerConfigs && sellerConfigs.DefaultCountryCodes && sellerConfigs.DefaultCountryCodes.map((countryCode) => (
                                <option key={countryCode} value={countryCode}>
                                    {sellerConfigs.DefaultCountries[countryCode].Name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="custom-control custom-checkbox">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        value="1"
                        id="change-pass-checkbox"
                        onChange={() => setShowLoyaltyPrograms(!showLoyaltyPrograms)}
                    />
                    <label
                        className="custom-control-label"
                        htmlFor="change-pass-checkbox"
                    >
                        Show Loyalty Programs in: "{userDetails.Country}"
                    </label>
                </div>
                { showLoyaltyPrograms && loyaltyPrograms.map((loyaltyProgram, index) => 
                    <LoyaltyProgram
                        key={index}
                        loyaltyProgram={loyaltyProgram}
                        handleLoyaltyProgramValueChange={handleLoyaltyProgramValueChange}
                        index={index}
                        userLoyaltyPrograms={userLoyaltyPrograms}
                        handleCheckLoyaltyPrograme={handleCheckLoyaltyPrograme}
                    /> 
                )}
                <div className="form-footer">
                    <div className="form-footer-right">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdateUserClicked}
                        >
                            Update User Details
                        </button>
                    </div>
                </div>
            </form>
            {/* This is the Change password form and will be shown if a user is signed up with email */}
            {isEmail && (
                <form>
                    <Alert
                        open={alert.openPassword}
                        close={handleCloseAlertClicked}
                        type={alert.type}
                        message={alert.message}
                    />
                    <div>
                        <h3 className="mb-2">Change Password</h3>
                        <div id="account-chage-pass" className={"show"}>
                            <div className="form-group required-field">
                                <label htmlFor="acc-password">Current Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    className="form-control"
                                    onChange={(event) => handlePasswordInputChange(event)}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group required-field">
                                        <label htmlFor="acc-pass2">New Password</label>
                                        <input
                                            type="password"
                                            name={"newPassword"}
                                            className="form-control"
                                            onChange={(event) => handlePasswordInputChange(event)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group required-field">
                                        <label htmlFor="acc-pass3">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name={"confirmNewPassword"}
                                            onChange={(event) => handlePasswordInputChange(event)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-footer">
                        <div className="form-footer-right">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onChange={(event) => handleUpdatepasswordClicked(event)}
                            >
                                Change Password
                            </button>
                        </div>
              
                    </div>
                </form>
            )}
        </>
    );
};

export default  Account;

const LoyaltyProgram = props => {
    const {
        loyaltyProgram,
        handleLoyaltyProgramValueChange,
        index,
        userLoyaltyPrograms,
        handleCheckLoyaltyPrograme
    } = props;

    const [ checked, setChecked ] = useState(false);
    const [ value, setValue] = useState("");

    useEffect(() => {
        for (let i = 0; i < userLoyaltyPrograms.length; i++) {
            if (userLoyaltyPrograms[i].Key === loyaltyProgram.Option) {
                setChecked(true);
                setValue(userLoyaltyPrograms[i].Value);
            } 
        }
    }, []);

    useEffect(() => {
        handleCheckLoyaltyPrograme(checked, index);
    }, [checked]);

    useEffect(() => {
        handleLoyaltyProgramValueChange(value, index ? index : 0);
    }, [value]);

    return (
        <div className="row form-group">
            <div className="col-md-4">
                <div
                    style={{ marginTop: 25, padding: 12 }}
                    className="custom-control custom-checkbox"
                >
                    <input
                        type="checkbox"
                        checked={checked}
                        className="custom-checkbox"
                        onChange={() => setChecked(() => !checked)}
                    />
                    <label style={{ marginLeft: 10 }}>
                        {`I am an "${loyaltyProgram.Option}" loyalty member :`}
                    </label>
                </div>
            </div>
            {checked &&
                <div className="col-ms-3">
                    <label>Loyalty Code</label>
                    <input
                        type="text"
                        value={value}
                        className="form-control form-control-sm"
                        onChange={(event) => setValue(event.target.value)}
                    />
                </div>
            }
        </div>
    );
};