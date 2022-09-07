import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  pricelistReducer,
  initialPricelistState,
} from "./context-reducers/pricelistReducer";

export const PricelistContext = createContext({});

export const PricelistContextProvider = ({ children }) => {
  const [pricelistState, pricelistDispach] = useReducer(
    pricelistReducer,
    initialPricelistState
  );

  return (
    <PricelistContext.Provider
      value={{
        pricelistState,
        pricelistDispach,
      }}
    >
      {children}
    </PricelistContext.Provider>
  );
};

export const usePricelist = () => {
  return useContext(PricelistContext);
};
