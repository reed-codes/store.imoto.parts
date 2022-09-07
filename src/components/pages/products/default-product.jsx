import React, { useEffect, useLayoutEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import imagesLoaded from "imagesloaded";

import Breadcrumb from "../../common/breadcrumb";
import HorizontalThumbnail from "./common/thumbnails/horizontal-thumbnail";
import SingleDetail from "./common/details/single-detail";
import SingleTab from "./common/tabs/single-tab";
import FeaturedProductsOne from "./common/product-groups/featured-products-one";
import { PricelistContext } from "../../../store/PricelistContext";

import { findProductById } from "../../../utils";

function DefaultProduct(props) {
  const { pricelistState } = useContext(PricelistContext);
  let productId = props.match.params.id ? props.match.params.id : 1;
  let products = pricelistState.pricelist;
  let product = findProductById(products, productId);

  if (!product) {
    window.location = process.env.PUBLIC_URL + "/pages/404";
  }

  useLayoutEffect(() => {
    document.querySelector(".skeleton-body") &&
      document.querySelector(".skeleton-body").classList.remove("loaded");
  }, [productId]);

  useEffect(() => {
    let imgLoad = imagesLoaded(".product-single-gallery");

    imgLoad.on("done", function() {
      document.querySelector(".skeleton-body") &&
        document.querySelector(".skeleton-body").classList.add("loaded");
    });
  }, [productId]);

  return (
    <>
      <Helmet>
        <title>Porto React Ecommerce - Product Default</title>
      </Helmet>

      <h1 className="d-none">Porto React Ecommerce - Product Page</h1>

      <div className="main">
        <Breadcrumb current="Default" path="products" />

        <div className="container">
          <div className="row">
            <div className="col-lg-12 product-page skeleton-body skel-shop-products">
              <div className="product-single-container product-single-default">
                <div className="row">
                  <HorizontalThumbnail
                    addClass="col-lg-5 col-md-6"
                    product={product}
                  />

                  <div className="col-lg-7 col-md-6">
                    <SingleDetail product={product} />
                  </div>
                </div>
              </div>

              <SingleTab product={product} />
            </div>
          </div>
        </div>

        <FeaturedProductsOne />
      </div>
    </>
  );
}

export default DefaultProduct;
