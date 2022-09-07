import React, { createContext, useReducer, useEffect } from "react";
import {
  cartReducer,
  initialCartState,
} from "./context-reducers/cartReducer";

import {
  HIDE_QUICKVIEW,
  HIDE_CART_MODAL
} from "../constants/action-types";

export const CartListContext = createContext({});

export const CartListContextProvider = ({ children }) => {
  const [cartList, cartDispach] = useReducer(
    cartReducer,
    initialCartState
  );

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cartList));
  }, [cartList]);

  useEffect(() => {
    cartDispach({ type: HIDE_CART_MODAL } ) ;
    cartDispach({ type: HIDE_QUICKVIEW } ) ;
  }, []);

  return (
    <CartListContext.Provider
      value={{
        cartList,
        cartDispach,
      }}
    >
      {children}
    </CartListContext.Provider>
  );
};

