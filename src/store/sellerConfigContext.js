import React, { createContext, useContext, useReducer, useEffect } from "react";

import {
  sellerConfigReducer,
  initialSellerConfigState,
} from "./context-reducers/sellerConfigReducer";

import {
  initSellerConfigs,
  initDefaultCountries,
  initDefaultLoyaltyPrograms,
  receiveProducts,
} from "../action";

import { getPricelist } from "../utils";
import { PricelistContext } from "./PricelistContext";

export const SellerConfigContext = createContext([]);

export const SellerConfigContextProvider = ({ children }) => {
  const [sellerConfigs, sellerConfigDispatch] = useReducer(
    sellerConfigReducer,
    initialSellerConfigState
  );
  const { pricelistDispach } = useContext(PricelistContext);

  useEffect(() => {
    initSellerConfigs(sellerConfigDispatch);
    initDefaultCountries(sellerConfigDispatch);
    initDefaultLoyaltyPrograms(sellerConfigDispatch);
  }, []);

  useEffect(() => {
    if (sellerConfigs.SellerID) {
      getPricelist(sellerConfigs.SellerID)
        .then((res) => {
          if (res.length === 2) {
            const [pricelist, categories] = res;
            const validProducts = pricelist.filter((product) => product.Tags);
            pricelistDispach(receiveProducts(validProducts, categories));
          }
        })
    }
  }, [sellerConfigs]);

  return (
    <SellerConfigContext.Provider
      value={{
        sellerConfigs,
        sellerConfigDispatch,
      }}
    >
      {children}
    </SellerConfigContext.Provider>
  );
};


export const useSellerConfig = () => {
  return useContext(SellerConfigContext)
}

export default SellerConfigContext;
