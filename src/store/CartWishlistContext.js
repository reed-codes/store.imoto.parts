import React, { createContext, useReducer, useEffect } from "react";

import {
  initialCartWishlistState,
  cartWishlistReducer,
} from "./context-reducers/cartWishlistReducer";
import { initCartWishList } from "../action";
import { getListByListName } from "../api";
import { useSellerConfig } from "./sellerConfigContext";
import { toast } from "react-toastify";

export const CartWishListContext = createContext({
  cart: [],
  wishlist: [],
});

export const CartWishListContextProvider = ({ children }) => {
  const [cartWishList, cartWishListDispach] = useReducer(
    cartWishlistReducer,
    initialCartWishlistState
  );
  const { sellerConfigs } = useSellerConfig();

  useEffect(() => {
    const initLists = async () => {
      let cartRequest = [], wishlistRequest = [];
      try {
          cartRequest = await getListByListName(sellerConfigs.SellerID, "cart");
          wishlistRequest = await getListByListName(sellerConfigs.SellerID, "wishlist");
      } catch (error) {
        toast.error("Error getting the user's lists"); 
        return;
      }

      const cartData = cartRequest[1] === null ? cartRequest[0]["ListItems"] : []
      const wishlistData = wishlistRequest[1] === null ? wishlistRequest[0]["ListItems"] : []
      cartWishListDispach(initCartWishList({ cart: cartData, wishlist: wishlistData }));
    }

    if (sellerConfigs.SellerID) {
      initLists();
    }
  }, [sellerConfigs.SellerID]);

  return (
    <CartWishListContext.Provider
      value={{
        cartWishList,
        cartWishListDispach,
      }}
    >
      {children}
    </CartWishListContext.Provider>
  );
};
