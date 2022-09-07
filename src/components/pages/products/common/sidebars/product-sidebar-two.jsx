import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SlideToggle } from "react-slide-toggle";
import StickyBox from "react-sticky-box";

import WidgetBanner from "../../../../features/banner/widget-banner";
import FeaturedProductsTwo from "../product-groups/featured-products-two";

import { stickyContentHandle, setStickyValues } from "../../../../../utils";
import { filterCategories } from "../../../../../action";
import _filter from "../../../../../mock-data/filter.json";

import { PricelistContext } from "../../../../../store/PricelistContext";

function ProductSidebarTwo(props) {
  const { addClass } = props;
  const { pricelistState, pricelistDispach } = useContext(PricelistContext);

  useEffect(() => {
    setStickyValues(120);
    window.addEventListener("scroll", stickyContentHandle, { passive: true });

    return () => {
      window.removeEventListener("scroll", stickyContentHandle);
    };
  });

  return (
    <aside className={`sidebar-product col-lg-3 mobile-sidebar ${addClass}`}>
      <StickyBox className="sticky-sidebar">
        <div className="sidebar-wrapper">
          <SlideToggle>
            {({ onToggle, setCollapsibleElement, toggleState }) => (
              <div className="widget widget-collapse">
                <h3 className="widget-title">
                  <Link
                    data-toggle="collapse"
                    to="#"
                    onClick={onToggle}
                    className={toggleState.toLowerCase()}
                  >
                    categories
                  </Link>
                </h3>

                <div
                  className="collapse show"
                  ref={setCollapsibleElement}
                  style={{ overflow: "hidden" }}
                >
                  <div className="widget-body">
                    <ul className="cat-list">
                      {_filter.categories.map((item, index) => (
                        <li
                          key={"filter" + index}
                          className={pricelistState.filter.category === item ? "active" : ""}
                        >
                          <Link
                            to={`${process.env.PUBLIC_URL}/categories/full-width`}
                            onClick={(e) => {
                              pricelistDispach( filterCategories(item) );
                            }}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </SlideToggle>

          <WidgetBanner src="assets/images/demo/banners/banner-sidebar.jpg" />

          <FeaturedProductsTwo />
        </div>
      </StickyBox>
    </aside>
  );
}

export default ProductSidebarTwo;
