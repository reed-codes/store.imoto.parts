import React, { createContext, useReducer, useEffect } from "react";
import {
  wishlistReducer,
  initialWishlistState,
} from "./context-reducers/wishlistReducer";

export const WishlistContext = createContext([]);

export const WishlistContextProvider = ({ children }) => {
  const [wishlist, wishlistDispach] = useReducer(
    wishlistReducer,
    initialWishlistState
  );

  useEffect(()=>{
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist])

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistDispach,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
