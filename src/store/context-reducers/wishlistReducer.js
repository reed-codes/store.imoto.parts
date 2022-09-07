import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, REFRESH_STORE } from  '../../constants/action-types'
import { findIndex } from '../../utils/index';

let localStorageWishlistJSON = ( localStorage.getItem('wishlist') );
let localStorageObject = localStorageWishlistJSON ? JSON.parse( localStorageWishlistJSON ) : null;
let wishlistStateDefaultState = { list: [] };

export let initialWishlistState = localStorageObject ? localStorageObject : wishlistStateDefaultState ;

export const wishlistReducer = ( state = { list: [] }, action ) => {
    switch ( action.type ) {

        case ADD_TO_WISHLIST:
            if ( !findIndex( state.list, action.product.ProductID ) ) {
                return {
                    ...state,
                    list: [ ...state.list, action.product ]
                };
            }
            return state;

        case REMOVE_FROM_WISHLIST:
            return {
                list: state.list.filter( product => product.ProductID !== action.product.ProductID )
            };

        case REFRESH_STORE:
            return initialWishlistState;

        default:
            return state;
    }
}

