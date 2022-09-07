export const logger = (msg, type) => {
    if (process.env.REACT_APP_DEBUG) {
        switch (type) {
            case 'error':
                console.error(msg);
                break;
            case 'log':
                console.log(msg);
                break
            default:
                throw new Error(`[LOGGER] message type '${type}' not implemented`);
        }
    }
}

/**
 * Function used to get the user's date time in the ISO Date format. the function
 * takes in the inputDate which is set to an empty string by default. If given
 * you need an ISODate format of a particular date then send in the input string
 * else call the function with out any params.
 * 
 * @param {String} inputDate 
 * @returns {Date} 
 */
export const getISODateFormat = (inputDate="") => {
    const date = (inputDate === "") ? new Date() : new Date(inputDate);
    return date.toISOString();
}

export const getSellerDeliveryMethods = (sellerOptions) => {
    let deliveryMethods = sellerOptions.filter((option) =>
        option.Key === "deliveryMethods"
    );

    deliveryMethods = deliveryMethods[0].Value.split(",");
    // pack the delivery methods to an object for the ease of accessing
    if (deliveryMethods.length === 2) {
        return {
            [deliveryMethods[0]]: deliveryMethods[0],
            [deliveryMethods[1]]: deliveryMethods[1],
        }
    } else if (deliveryMethods.length === 1) {
        return {
            [deliveryMethods[0]]: deliveryMethods[0],
            [deliveryMethods[0] === "Collect" ? "Delivery" : "Collect"]: "" 
        }   
    }
}