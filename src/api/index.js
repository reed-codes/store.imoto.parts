import { initialUserSellerState } from '../store/context-reducers/userSellerReducer';
import {
    instanceAWSS3,
    instanceCOMAPI
} from '../axios/axios-instances';

/**
 * TODO: 
 * @param {*} sellerURL 
 * @returns 
 */
// export const getsSellerConfigurationData = async (sellerURL='www.localhost') => {
export const getsSellerConfigurationData = async (sellerURL = 'www.localhost-2') => {
    try {
        const { data: sellerConfigurations } = await instanceAWSS3.get(
            `store-configs/${sellerURL}.json`
        );

        return { sellerConfigurations, error: null }
    } catch (error) {
        return { sellerConfigurations: null, error }
    }
}

/**
 * TODO: 
 * 
 * 
 * @param {*} sellerURL 
 * @returns 
 */
export const getDefaultCountriesFromAWSS3 = async (jsonFileName = 'countries') => {
    try {
        const { data: DefaultCountries } = await instanceAWSS3.get(
            `${jsonFileName}.json`
        );

        return { DefaultCountries, error: null }
    } catch (error) {
        return { DefaultCountries: null, error }
    }
}

/**
 * TODO: 
 * 
 * 
 * @param {*} sellerURL
 * 
 * @returns 
 */
export const getDefaultLoyaltyProgramsFromAWSS3 = async (jsonFileName = 'loyalty') => {
    try {
        const { data: DefaultCountryLoyaltyPrograms } = await instanceAWSS3.get(
            `${jsonFileName}.json`
        );

        return { DefaultCountryLoyaltyPrograms, error: null }
    } catch (error) {
        return { DefaultCountryLoyaltyPrograms: null, error }
    }
}

/**
 * TODO: 
 * 
 * @returns 
 */
export const getUserFromAPI = async () => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.get("user");

        // check if user profile exist if it does return the user details else
        // return the default user that has the 0 properties set in the reducer
        if (response.status === 200) {
            return { User: response.data, error: null };
        }

        return { User: initialUserSellerState.User, error: null };
    } catch (error) {
        return { User: null, error: error }
    }
}

/**
 * TODO:
 * 
 * @param {*} userID 
 * @param {*} sellerID 
 * 
 * @returns 
 */
export const getUserSellerFromAPI = async (userID, sellerID) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.get(`userseller/${userID}/${sellerID}`);

        // check if user-seller record exist if it does return the user-seller
        // entity else return the default userseller that has the 0 properties
        // set in the reducer
        if (response.status === 200) {
            return { UserSeller: response.data, error: null };
        }

        return { UserSeller: initialUserSellerState.UserSeller, error: null };
    } catch (error) {
        return { UserSeller: null, error: error }
    }
}

/**
 * TODO:
 * @param {*} sellerID 
 * 
 * returns all lists associated with this Seller ID.
 * @returns 
 */
export const getLists = async (sellerID) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.get(`list/${sellerID}`);

        if (response.status === 200) {
            return [response.data, null];
        }

        return [response.data, null];
    } catch (error) {
        return [null, error]
    }
}

/**
 * TODO:
 * 
 * @param {*} listData
 * 
 * creates or updates list.
 * @returns 
 */
export const createOrUpdateList = async (listData) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.post("list", listData);

        if (response.status === 200) {
            return [response.data, null];
        }

        return [response.data, null];
    } catch (error) {
        return [null, error]
    }
}

/**
 * 
 * @param {*} sellerID 
 * @param {*} listName 
 * 
 * gets the list specified by listname for the seller attached to the seller id
 * @returns 
 */
export const getListByListName = async (sellerID, listName) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.get(`list/${sellerID}/${listName}`);
        
        if (response.status === 200) {
            return [response.data, null];
        }

        return [response.data, null];
    } catch (error) {
        return [ null, error]
    }
}

/**
 * 
 * @param {*} SellerID 
 * @param {*} List 
 * @param {*} listItem 
 * 
 * adds item to a ( specified ) list using the List parameter for the SellerID
 * @returns 
 */
export const addListItemToList = async (SellerID, List, listItem) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.post(`list/${SellerID}/${List}`, listItem);

        if (response.status === 200) {
            return [`Successfully added to ${List}`, null];
        }
        return [response.message, null];
    } catch (error) {
        return [null, error]
    }
}

/**
 * 
 * @param {*} SellerID 
 * @param {*} List 
 * @param {*} listItem 
 * 
 * removes item from a ( specified ) list using the List parameter for the SellerID
 * @returns 
 */
export const deleteListItemByListName = async (SellerID, List, ProductID ,listItem) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.delete(`list/${SellerID}/${List}/${ProductID}`, listItem);

        if (response.status === 200) {
            return [`Successfully removed item from ${List}`, null];
        }
        return [ response.message, null ];
    } catch (error) {
        return [ null, error ]
    }
}

export const deleteList = async (sellerID, listName) => {
    try {
        const ax = await instanceCOMAPI();
        const response = await ax.delete(`list/${sellerID}/${listName}`);

        if (response.status === 200) {
            return [ `Successfully deleted ${listName}`, null ];
        }
        return [ response.message, null ];

    } catch (error) {
        return [ null, error ]
    }
}