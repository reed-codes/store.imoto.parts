import React, { useContext } from "react";
import { filterCategories } from "../../action";
import { PricelistContext } from "../../store/PricelistContext";

export default function Breadcrumb(props) {
  const { addClass } = props;
  const { pricelistState, pricelistDispach } = useContext(PricelistContext);
  const categoryBreadcrumbList = pricelistState.filter.categories.slice(1);

  const categoriesMarkup = categoryBreadcrumbList.map((cat) => {
    return (
      <li
        className="breadcrumb-item"
        aria-current="page"
        style={{ cursor: "pointer" }}
        key = {cat}
        onClick={() => {
          if (
            !(categoryBreadcrumbList[categoryBreadcrumbList.length - 1] === cat)
          )
            pricelistDispach(filterCategories(cat));
        }}
      >
        <a
          href={cat}
          style={{ height: "100%", width: "100%" }}
          onClick={(e) => e.preventDefault()}
        >
          {cat}
        </a>
      </li>
    );
  });

  return (
    <nav aria-label="breadcrumb" className={`breadcrumb-nav ${addClass}`}>
      <div className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            {" "}
            <i className="icon-home"></i>{" "}
          </li>
          <li
            className="breadcrumb-item active"
            style={{ cursor: "default" }}
            aria-current="page"
          >
            {pricelistState.currentCategory}
          </li>
          {categoriesMarkup.map((node) => node)}
        </ol>
      </div>
    </nav>
  );
}
