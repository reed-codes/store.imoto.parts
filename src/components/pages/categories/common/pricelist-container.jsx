import React, { useContext } from "react";
import ProductTypeThree from "../../../features/product/product-type-three";
import ProductTypeTwo from "../../../features/product/product-type-two";
import { PricelistContext } from "../../../../store/PricelistContext";
import Loader from "../../../common/loader";
import { shopFilterProducts } from "../../../../utils";

function GridProduct(props) {
  const { cols = 3 } = props;
  const { pricelistState } = useContext(PricelistContext);
  let subClass = getClass(cols);
  let viewMode = pricelistState.viewOptions.viewMode;
  let products = shopFilterProducts(
    pricelistState.pricelist,
    pricelistState.filter,
    pricelistState.viewOptions.sortBy,
    pricelistState.original.categories
  );

  function getClass(cols) {
    let subClass = "";
    if (cols === 4) {
      subClass = "col-xl-3";
    } else if (cols === 5) {
      subClass = "col-xl-5col";
    } else if (cols === 6) {
      subClass = "col-xl-2 col-lg-3";
    } else if (cols === 7) {
      subClass = "col-xl-7col col-lg-3";
    } else if (cols === 8) {
      subClass = "col-xl-8col col-lg-3";
    }
    return subClass;
  }

  const productsMarkUpList =
    viewMode === "GRID"
      ? products.map((product, index) => (
          <div className={`col-6 col-md-4 ${subClass}`} key={"grid" + index}>
            <div className="skel-pro skel-pro-grid"></div>
            <ProductTypeTwo
              addClass="inner-quickview inner-icon"
              product={product}
              noAction={cols > 4 ? true : false}
            />
          </div>
        ))
      : products.map((product, index) => (
          <React.Fragment key={"list" + index}>
            <div className="skel-pro skel-pro-list"></div>

            <ProductTypeThree
              addClass="col-6 col-sm-12 left-details product-list mb-4"
              product={product}
            />
          </React.Fragment>
        ));

  return (
    <div className={`product-group row row-sm position-relative  ${viewMode === "LIST" && "product-intro list-style"} `} >
      {products.length === 0 && !props.isLoading && (
        <h4 className="mt-3 ml-4 text-dark" style={{ fontWeight: 400 }}>
          <i className="fas fa-info-circle text-primary mr-2"></i>No products
          were found matching your selection.
        </h4>
      )}

      {props.isLoading ? <LoadingPlaceholder /> : productsMarkUpList}
    </div>
  );
}

const LoadingPlaceholder = () => {
  return (
    <div
      style={{
        width: "100%",
        height: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader />
    </div>
  );
};

export default GridProduct;
