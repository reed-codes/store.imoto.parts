import { 
    SET_USER,
    SET_SELLER,
    SET_USER_SELLER,
    INIT_USER_SELLER,
    RESET_USER_SELLER,
    RESET_USER,
    UPDATE_USER_ADDRESS,
    UPDATE_USER_LOYALTY_PROGRAMS,
    UPDATE_USER_OPTIONS,
    ADD_USER_ADDRESS,
 } from '../../constants/action-types';

export const initialUserSellerState = {
    userApproved: false,
    userSellerExists: false,
    User: {
        UserID: "",
        Name: "",
        IsLockedOut: false,
        LastActiveDate: "",
        Email: "",
        Country: "",
        Version: "",
        Deleted: true,
        Options: [ { Key: "", Value: "" } ],
        LoyaltyPrograms: [ { Key: "", Value: "" } ],
        Address: [
            {
                Type: "",
                Address1: "",
                Address2: "",
                Address3: "",
                Address4: "",
                Address5: "",
                Coordinate: { lon: 0, lat: 0 }
            }
        ],
    },
    UserSeller: {
        Type: "",
        Status: "",
        UserID: "",
        Version: "",
        SellerID: "",
        Roles: [ "" ],
        Accounts: [ "" ],
        Options: [ { Key: "", Value: "" } ],
    },
    Seller: {
        Name: "",
        Email: "",
        Owner: "",
        Country: "",
        SellerID: "",
        Options: [{ Key: "", Value: "", Description: ""}],
        Pricelists: [{ Key: "", Value: "", Description: ""}]
    }
};

export const userSellerReducer = (state=initialUserSellerState, action) => {
    switch (action.type) {
        case INIT_USER_SELLER:
            return {
                ...state,
                userApproved: action.payload.userApproved,
                userSellerExists: action.payload.userSellerExists,
                User: action.payload.User,
                Seller: action.payload.Seller,
                UserSeller: action.payload.UserSeller,
            };
        case SET_USER:
            return {
                ...state,
                User: action.payload
            };

        case SET_USER_SELLER:
            return {
                ...state,
                UserSeller: action.payload,

            };

        case SET_SELLER:
            return {
                ...state,
                Seller: action.payload
            };

        case RESET_USER_SELLER:
            return {
                ...state,
                User: initialUserSellerState.UserSeller
            };

        case RESET_USER:
            return {
                ...state,
                UserSeller: initialUserSellerState.User
            };
        
        case UPDATE_USER_LOYALTY_PROGRAMS:
            return {
                ...state,
                User: {
                    ...state.User,
                    LoyaltyPrograms: [ ...action.payload ]
                }
            };

        case UPDATE_USER_OPTIONS:
            return {
                ...state,
                User: {
                    ...state.User,
                    Options: [ ...action.payload ]
                }
            };
        
        case ADD_USER_ADDRESS:
        case UPDATE_USER_ADDRESS:
            return {
                ...state,
                User: {
                    ...state.User,
                    Address: action.payload
                }
            };

        default: throw new Error(`[UserReducer] action.type: '${action.type}' not implemented`);
    }
}