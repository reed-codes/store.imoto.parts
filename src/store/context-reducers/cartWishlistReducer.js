import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SHOW_CART_MODAL,
  HIDE_CART_MODAL,
  CLEAR_CART,
  INCREMENT_QTY,
  REFRESH_STORE,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST,
  MOVE_ITEM_FROM_CART_TO_WISHLIST,
  MOVE_ITEM_FROM_WISHLIST_TO_CART,
  INIT_CART_WISHLIST,
  DECREMENT_QTY,
  SET_ORDER,
  SET_ORDER_DETAILS,
  SET_DELIVERY_ADDRESS,
  SET_DELIVERY_METHOD,
  SET_QTY,

} from "../../constants/action-types";
import { findCartIndex } from "../../utils/index";

export let initialCartWishlistState = {
  cart: [],
  wishlist: [],
  order: {
    OrderID: "",
    SellerID: "",
    UserID: "",
    AccountID: "",
    CreateDate: "",
    RequiredByDate: "",
    PaymentMethod: "PAYPAL",
    PaymentTerms: "PayBefore",
    DeliveryMethod: "",
    PostedToERP: false,
    Type: "ORDER",
    Status: "Ordered",
    Reference: "",
    Comments: "",
    Total: 0.0,
    TotalExcl: 0.0,
    TotalTax: 0.0,
    Address: {
      Selected: 0,
      Type: "",
      Address1: "",
      Address2: "",
      Address3: "",
      Address4: "",
      Address5: "",
      Coordinate: { lon: 0, lat: 0 }
    },
    Items: [],
    UserFields: [],
    Tags: [],
  }
}


export const cartWishlistReducer = (state, action) => {
  switch (action.type) {
    case INIT_CART_WISHLIST:
      return {
        ...state,
        cart: action.lists.cart,
        wishlist: action.lists.wishlist,
      };

    case ADD_TO_WISHLIST:
      if (!findCartIndex(state.wishlist, action.product.ProductID)) {
        return {
          ...state,
          wishlist: [
            ...state.wishlist,
            {
              ProductID: action.product.ProductID,
              Quantity: 1,
              ProductInfo: action.product,
            },
          ],
        };
      }
      return state;

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter((product) => {
          return product.ProductID !== action.product.ProductID;
        }),
      };

    case REFRESH_STORE:
      return initialCartWishlistState;

    case ADD_TO_CART:
      if (findCartIndex(state.cart, action.product.ProductID)) {
        const cart = state.cart.reduce((acc, product) => {
          if (product.ProductID === action.product.ProductID) {
            acc.push({
              ...product,
              Quantity: product.Quantity + action.qty,
            });
          } else {
            acc.push(product);
          }
          return acc;
        }, []);
        return { ...state, cart };
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            ProductID: action.product.ProductID,
            Quantity: action.qty,
            ProductInfo: action.product,
          },
        ],
      };

    case REMOVE_FROM_CART:
      const temp = state.cart.filter((item) => item.ProductID !== action.product.ProductID)

      return {
        ...state,
        cart: temp
      };

    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case CLEAR_WISHLIST:
      return {
        ...state,
        wishlist: [],
      };

    case INCREMENT_QTY:
      const cartQ = state.cart.reduce((acc, product) => {
        if (product.ProductID === action.product.ProductID) {
          acc.push({
            ...product,
            Quantity: product.Quantity + 1,
          });
        } else {
          acc.push(product);
        }
        return acc;
      }, []);

      return { ...state, cart: cartQ };

    case DECREMENT_QTY:
      const cart = state.cart.reduce((acc, product) => {
        if (product.ProductID === action.product.ProductID) {
          acc.push({
            ...product,
            Quantity: product.Quantity - 1,
          });
        } else {
          acc.push(product);
        }
        return acc;
      }, []);

      return { ...state, cart };

    case SET_QTY:
      const updatedCart = state.cart.reduce((acc, product) => {
        if (product.ProductID === action.product.ProductID) {
          acc.push({
            ...product,
            Quantity: action.qty,
          });
        } else {
          acc.push(product);
        }
        return acc;
      }, []);

      return { ...state, cart: updatedCart };

    case MOVE_ITEM_FROM_CART_TO_WISHLIST:
      if (findCartIndex(state.wishlist, action.product.ProductID)) {
        return {
          ...state,
          cart: state.cart.filter(
            (item) => item.ProductID !== action.product.ProductID
          ),
          wishlist: [
            ...state.wishlist,
          ],
        };
      }
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.ProductID !== action.product.ProductID
        ),
        wishlist: [
          ...state.wishlist,
          {
            ProductID: action.product.ProductID,
            Quantity: 1,
            ProductInfo: action.product,
          },
        ],
      };

    case MOVE_ITEM_FROM_WISHLIST_TO_CART:
      if (findCartIndex(state.cart, action.product.ProductID)) {
        const cart = state.cart.reduce((acc, product) => {
          if (product.ProductID === action.product.ProductID) {
            acc.push({
              ...product,
              Quantity: product.Quantity + action.product.Quantity,
            });
          } else {
            acc.push(product);
          }
          return acc;
        }, []);
        return {
          ...state,
          cart,
          wishlist: state.wishlist.filter(
            (item) => item.ProductID !== action.product.ProductID
          ),
        };
      }

      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) => item.ProductID !== action.product.ProductID
        ),
        cart: [
          ...state.cart,
          {
            ProductID: action.product.ProductID,
            Quantity: 1,
            ProductInfo: action.product.ProductInfo,
          },
        ],
      };

    case SHOW_CART_MODAL:
      return {
        ...state,
        showModal: true,
        modalProduct:
          action.product.ProductInfo === undefined
            ? action.product
            : action.product.ProductInfo,
      };

    case HIDE_CART_MODAL:
      return {
        ...state,
        showModal: false,
      };

    case SET_DELIVERY_METHOD:
      return {
        ...state,
        order: {
          ...state.order,
          DeliveryMethod: action.payload
        }
      }
    case SET_DELIVERY_ADDRESS:
      return {
        ...state,
        order: {
          ...state.order,
          Address: { ...action.payload }
        }
      }

    case SET_ORDER:
      return {
        ...state,
        order: { ...action.payload }
      }

    case SET_ORDER_DETAILS:
      return {
        ...state,
        order: {
          ...state.order,
          RequiredByDate: action.payload.RequiredByDate,
          Comments: action.payload.Comments,
          Reference: action.payload.Reference
        }
      }

    default:
      return state;
  }
};
