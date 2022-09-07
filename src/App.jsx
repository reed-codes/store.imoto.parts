import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ScrollContext } from "react-router-scroll-4";

import { PricelistContextProvider } from "./store/PricelistContext";

import { UserSellerContextProvider } from "./store/UserSellerContext";

import { SellerConfigContextProvider } from "./store/sellerConfigContext";
import { NotificationAndDatabaseContextProvider } from "./store/NotificationAndDatabaseContext";
import { CartWishListContextProvider } from "./store/CartWishlistContext";

import { definePolyfills, scrollTop } from "./utils";
import Routes from "./routes";

export default function App() {
  definePolyfills();
  scrollTop();
  
  return (
    <PricelistContextProvider>
      <SellerConfigContextProvider>
        <CartWishListContextProvider>
          <UserSellerContextProvider>
            <NotificationAndDatabaseContextProvider>
              <BrowserRouter basename={"/"}>
                <ScrollContext>
                  <Routes />
                </ScrollContext>
              </BrowserRouter>
            </NotificationAndDatabaseContextProvider>
          </UserSellerContextProvider>
        </CartWishListContextProvider>
      </SellerConfigContextProvider>
    </PricelistContextProvider>
  );
}
