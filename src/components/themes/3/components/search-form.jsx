import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import styled from "styled-components";

const SearchInput = styled.input`
  color: ${(props) => props.color} !important;
  background: ${(props) => props.bg} !important;
  &::placeholder {
    color: ${(props) => props.color} !important;
  }
`;

const AnchorIconButton = styled.a`
  cursor: pointer;
  color: ${(props) => props.color} !important;
  &:hover {
    color: ${(props) => props.hoverColor} !important;
  }
`;

function SearchForm(props) {
  const { sellerConfigs } = useSellerConfig();
  useEffect(() => {
    document.querySelector("body").addEventListener("click", onBodyClick);
    document
      .querySelector(".header-search .header-search-wrapper")
      .addEventListener("click", function(e) {
        e.stopPropagation();
      });
    window.addEventListener("resize", onWindowResize);

    return () => {
      document.querySelector("body").removeEventListener("click", onBodyClick);
      window.removeEventListener("resize", onWindowResize);
    };
  });

  const onSearchClick = (e) => {
    e.preventDefault();

    if (document.querySelector(".header-search"))
      document.querySelector(".header-search").classList.toggle("show");

    if (document.querySelector(".header-search-wrapper"))
      document.querySelector(".header-search-wrapper").classList.toggle("show");

    if (window.innerWidth < 576) {
      document.querySelector(".header-search-wrapper").style.left =
        15 - document.querySelector(".header-search").offsetLeft + "px";
      document.querySelector(".header-search-wrapper").style.right =
        15 +
        document.querySelector(".header-search").offsetLeft +
        document.querySelector(".header-search").clientWidth -
        window.innerWidth +
        "px";
    }
  };

  const onWindowResize = () => {
    let searchWrapper = document.querySelector(".header-search-wrapper");
    let headerSearch = document.querySelector(".header-search");

    if (window.innerWidth < 576) {
      searchWrapper.style.left = 15 - headerSearch.offsetLeft + "px";
      searchWrapper.style.right =
        15 +
        headerSearch.offsetLeft +
        headerSearch.clientWidth -
        window.innerWidth +
        "px";
    }
  };

  const onBodyClick = (e) => {
    if (document.querySelector(".header-search-wrapper")) {
      if (
        document
          .querySelector(".header-search-wrapper")
          .classList.contains("show")
      ) {
        document
          .querySelector(".header-search-wrapper")
          .classList.remove("show");
        document.querySelector("body").classList.remove("is-search-active");
      }

      if (document.querySelector(".header-search").classList.contains("show")) {
        document.querySelector(".header-search").classList.remove("show");
      }
    }
  };

  const {
    addClass,
    iconClass = "icon-magnifier",
    placeholder = "Search...",
    isCat = true,
    text,
  } = props;

  return (
    <div className={"header-search " + addClass}>
      <AnchorIconButton
        href="#"
        className="search-toggle"
        role="button"
        onClick={onSearchClick}
        hoverColor={sellerConfigs.Theme.ColorPalette["Primary"]}
        color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
      >
        <i className={iconClass}></i>
        {text}
      </AnchorIconButton>

      <form action="#" method="get">
        <div className="header-search-wrapper">
          <SearchInput
            type="search"
            className="form-control"
            name="q"
            id="q"
            placeholder={placeholder}
            required
            bg={sellerConfigs.Theme.ColorPalette["Gray-60"]}
            color={sellerConfigs.Theme.ColorPalette["Gray-50"]}
          />
          {isCat ? (
            <div className="select-custom">
              <select
                id="cat"
                name="cat"
                style={{
                  background: sellerConfigs.Theme.ColorPalette["Gray-60"],
                  color: sellerConfigs.Theme.ColorPalette["Gray-50"],
                  borderColor: sellerConfigs.Theme.ColorPalette["White"],
                }}
              >
                <option value="">All Categories</option>
                <option value="4">Fashion</option>
                <option value="12">- Women</option>
                <option value="13">- Men</option>
                <option value="66">- Jewellery</option>
                <option value="67">- Kids Fashion</option>
                <option value="5">Electronics</option>
                <option value="21">- Smart TVs</option>
                <option value="22">- Cameras</option>
                <option value="63">- Games</option>
                <option value="7">Home &amp; Garden</option>
                <option value="11">Motors</option>
                <option value="31">- Cars and Trucks</option>
                <option value="32">- Motorcycles &amp; Powersports</option>
                <option value="33">- Parts &amp; Accessories</option>
                <option value="34">- Boats</option>
                <option value="57">- Auto Tools &amp; Supplies</option>
              </select>
            </div>
          ) : (
            ""
          )}
          <button
            className={iconClass + " btn "}
            type="submit"
            style={{
              background: `${sellerConfigs.Theme.ColorPalette["Gray-10"]}`,
              color: `${sellerConfigs.Theme.ColorPalette["Gray-60"]}`,
            }}
          ></button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
