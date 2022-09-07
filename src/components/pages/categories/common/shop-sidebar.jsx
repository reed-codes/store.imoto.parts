import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import StickyBox from "react-sticky-box";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import {
  filterPrice,
  filterBrand,
  cleanFilter,
  filterTag,
  initCurrentCategory,
} from "../../../../action";
import _filter from "../../../../mock-data/filter.json";
import {
  isIEBrowser,
  isEdgeBrowser,
  isFirefoxBrowser,
  stickyContentHandle,
  setStickyValues,
} from "../../../../utils";
import { PricelistContext } from "../../../../store/PricelistContext";
import SubCategories from "./sub-categories-tree/sub-categories-tree-options";

function ShopSidebar() {
  const { pricelistState, pricelistDispach } = useContext(PricelistContext);
  const [showClean, setShowClean] = useState(false);
  const [val, setVal] = useState(pricelistState.filter.price);

  useEffect(() => {
    if (
      pricelistState.filter.tags.length ||
      pricelistState.filter.brands.length ||
      pricelistState.filter.price.min > pricelistState.original.price.min ||
      pricelistState.filter.price.max < pricelistState.original.price.max
    ) {
      setShowClean(true);
    } else {
      setShowClean(false);
    }
  }, [pricelistState.filteredPricelist, pricelistState.filter.price]);

  useEffect(() => {
    setVal(pricelistState.filter.price);
  }, [pricelistState.filteredPricelist]);

  useEffect(() => {
    setStickyValues(120);
    window.addEventListener("scroll", stickyContentHandle, { passive: true });
    window.onresize = stickyContentHandle;

    return () => {
      window.removeEventListener("scroll", stickyContentHandle);
    };
  });

  const getBrand = (e, item) => {
    e.preventDefault();
    pricelistDispach(filterBrand(item));
    toTop();
  };

  const getTag = (e, item) => {
    e.preventDefault();
    pricelistDispach(filterTag(item));
    toTop();
  };

  const getPrice = (e) => {
    e.preventDefault();
    pricelistDispach(filterPrice(val));
  };

  const cleanFilters = (e) => {
    e.preventDefault();
    setVal(pricelistState.original.price);
    pricelistDispach(cleanFilter());
    toTop();
  };

  const toTop = () => {
    let off_top = document.querySelector(".toolbox").getBoundingClientRect().top;
    if (off_top < -200) {
      if (isIEBrowser() || isEdgeBrowser() || isFirefoxBrowser()) {
        let pos = window.pageYOffset;
        let timer = setInterval(() => {
          if (pos <= off_top + window.pageYOffset - 45) {
            clearInterval(timer);
          }

          window.scrollBy(0, -40);
          pos -= 40;
        }, 1);
      } else {
        window.scrollTo({
          top: off_top + window.pageYOffset - 45,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    toTop();
  }, [pricelistState.currentCategory]);

  return (
    <StickyBox className="sidebar-wrapper sticky-sidebar" offsetTop={80}>
      <div className="widget price-widget">
        <h3 className="widget-title">
          <a
            data-toggle="collapse"
            href="#widget-body-1"
            role="button"
            aria-expanded="true"
            aria-controls="widget-body-1"
          >
            Sub categories
          </a>
        </h3>

        <div
          className="collapse show"
          id="widget-body-1"
          style={{
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          <SubCategories />
        </div>
      </div>

      {showClean ? (
        <div className="widget widget-clean">
          <button className="btn btn-primary btn-md" onClick={cleanFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        ""
      )}

      <div className="widget price-widget">
        <h3 className="widget-title">
          <a
            data-toggle="collapse"
            href="#widget-body-2"
            role="button"
            aria-expanded="true"
            aria-controls="widget-body-2"
          >
            Price
          </a>
        </h3>

        <div className="collapse show" id="widget-body-2">
          <div className="widget-body">
            <form action="#">
              <div className="price-slider-wrapper">
                <InputRange
                  minValue={pricelistState.original.price.min}
                  maxValue={pricelistState.original.price.max}
                  step={10}
                  value={val}
                  onChange={(value) => setVal(value)}
                />
              </div>

              <div className="filter-price-action d-flex align-items-center justify-content-between flex-wrap">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={getPrice}
                >
                  Filter
                </button>

                <div className="filter-price-text">
                  Price:
                  <span id="filter-price-range">
                    { "$" +   val.min.toFixed(2) + " - $" + val.max.toFixed(2)}{" "}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="widget"
        style={{
          maxHeight: "250px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <h3
          className="widget-title"
          style={{
            position: "sticky",
            left: 0,
            top: -20,
            background: "#fff",
            padding: "10px 0",
          }}
        >
          <a
            data-toggle="collapse"
            href="#widget-body-3"
            role="button"
            aria-expanded="true"
            aria-controls="widget-body-3"
          >
            Brand
          </a>
        </h3>

        <div className="collapse show" id="widget-body-3">
          <div className="widget-body">
            <ul className="cat-list">
              {pricelistState.original.brands.sort().map((item, index) => (
                <li
                  key={"brand" + index}
                  className={ pricelistState.filter.brands.sort().indexOf(item) >= 0 ? "active" : "" }
                >
                  <Link to="#" onClick={(e) => getBrand(e, item)}>
                    {" "}{item}{" "}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="widget"
        style={{
          maxHeight: "250px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <h3
          className="widget-title"
          style={{
            position: "sticky",
            left: 0,
            top: -20,
            background: "#fff",
            padding: "10px 0",
          }}
        >
          <a
            data-toggle="collapse"
            href="#widget-body-4"
            role="button"
            aria-expanded="true"
            aria-controls="widget-body-4"
          >
            Tags
          </a>
        </h3>

        <div className="collapse show" id="widget-body-4">
          <div className="widget-body">
            <ul className="cat-list">
              {" "}
              {pricelistState.original.tags.sort().map((item, index) => (
                <li
                  key={"tag" + index}
                  className={ pricelistState.filter.tags.sort().indexOf(item) >= 0 ? "active" : ""}
                >
                  <Link to="#" onClick={(e) => getTag(e, item)}>
                    {" "}{item}{" "}
                  </Link>
                </li>
              ))}{" "}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="widget"
        style={{
          maxHeight: "250px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <h3
          className="widget-title"
          style={{
            position: "sticky",
            left: 0,
            top: -20,
            background: "#fff",
            padding: "10px 0",
          }}
        >
          <a
            data-toggle="collapse"
            href="#widget-body-5"
            role="button"
            aria-expanded="true"
            aria-controls="widget-body-5"
          >
            Other Categories
          </a>
        </h3>

        <div className="collapse show" id="widget-body-5">
          <div className="widget-body">
            <ul className="cat-list">
              {pricelistState.filter.otherCategories.map((item, index) => (
                <li
                  key={"other-cat-" + index}
                  id={item.CategoryID}
                  onClick={(e) => pricelistDispach(initCurrentCategory(e.currentTarget.id)) }
                  style={{ cursor: "pointer" }}
                >
                  {" "}{item.CategoryID}{" "}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StickyBox>
  );
}

export default ShopSidebar;
