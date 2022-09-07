import React, { useState, useContext, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";

import { initStickyOffset } from "../utils";
import { SellerConfigContext } from "../store/sellerConfigContext";
import { instanceCOMAPI } from "./../axios/axios-instances";

import ProductsPages from './products-route'
import CategoriesPages from './categories-route'
import OthersPages from './others-route'
import HomePage from './home-route'

// let ProductsPages = React.lazy(() => import("./products-route"));
// let CategoriesPages = React.lazy(() => import("./categories-route"));
// let OthersPages = React.lazy(() => import("./others-route"));
// let HomePage = React.lazy(() => import("./home-route"));

function Routes(props) {
  const { sellerConfigs } = useContext(SellerConfigContext);
  const [loading, setLoading] = useState(false);

  initStickyOffset();

  useEffect(() => {
    const requestedPath = localStorage.getItem("REQUESTED-PATH");

    const getUser = async () => {
      try {
        const ax = await instanceCOMAPI();
        const res = await ax.get(`user`);

        if (res.status === 200) {
          // USER HAS A PROFILE.
          setLoading(false);
          localStorage.removeItem("REDIRECT");
          props.history.replace(requestedPath);
        } else if (res.status === 204) {
          // USER DOES NOT HAVE A PROFILE.
          props.history.replace("pages/dashboard/account");
        }
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    if (requestedPath) {
      localStorage.removeItem("REQUESTED-PATH");
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <React.Suspense fallback={<></>}>
      {!loading && sellerConfigs.SellerID && (
        <Switch>
          <Route
            path={`${process.env.PUBLIC_URL}/products`}
            component={ProductsPages}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/categories`}
            component={CategoriesPages}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/pages`}
            component={OthersPages}
          />
          <Route 
            path={`${process.env.PUBLIC_URL}/`} 
            component={HomePage} />
        </Switch>
      )}
    </React.Suspense>
  );
}

export default withRouter(Routes);
