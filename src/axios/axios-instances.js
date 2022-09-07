import axios from "axios";
import { Auth } from "aws-amplify";

/** ***************************************************************************/
// intercept the requests made to AWSS3 using this interceptor instance to, set
// the baseURL and the parameter timestamp to avoid caching the json object.
export const instanceAWSS3 = axios.create({
    baseURL: process.env.REACT_APP_S3_CONFIG_URL,
    timeout: 10000,
    responseType: "json",
    headers: {
        Pragma: "no-cache"
    }
});

/** *****************************************************************************
 * intercept the requests made to comapi this axios instance will add the
 * 'Authorization' header with the 'IDTOKEN' obtained from cognito for this
 * authenticated user. It will also set the baseURL for this instance.
 */
export const instanceCOMAPI = async () => {
    try {
        const token = await getTokenCOMAPI();
        return axios.create({
            baseURL: process.env.REACT_APP_API_ENDPOINTS_PROD,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * This function will get a token from cognito via the amplify library.
 * To be used for COMAPI calls.
 * 
 * 
 * @returns {String} the requested token for a call to COMAPI. 
 */
const getTokenCOMAPI = async () => {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken
}

/** *****************************************************************************
 * use this interceptor to intercept the GET requests to cognito to obtain
 * the user info during the signup process.
 */
export const instanceCOGNITO = async () => {
    try {
        const token = await getTokenCOGNITO();
        return axios.create({
            baseURL: process.env.REACT_APP_COGNITO_USER_INFO,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * use this to GET get the access token to make a request to cognito to 
 * obtain the user info during the signup process of a fedarated account.
 * 
 * @returns {String} the requested access token for a call to cognito.
 */
const getTokenCOGNITO = async () => {
    const user = await Auth.currentSession()
    return user.accessToken.jwtToken;
}
