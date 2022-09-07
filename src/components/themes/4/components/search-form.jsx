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

function SearchForm(props) {
  const { sellerConfigs } = useSellerConfig();

  useEffect(() => {
    document.querySelector("body").addEventListener("click", onBodyClick);
    let headerSearch = document.querySelectorAll(".header-search");
    for (let i = 0; i < headerSearch.length; i++) {
      headerSearch[i]
        .querySelector(".header-search-wrapper")
        .addEventListener("click", function(e) {
          e.stopPropagation();
        });
    }

    window.addEventListener("resize", onWindowResize);

    return () => {
      document.querySelector("body").removeEventListener("click", onBodyClick);
      window.removeEventListener("resize", onWindowResize);
    };
  });

  function onSearchClick(e) {
    e.preventDefault();

    let headerSearch = document.querySelectorAll(".header-search");
    for (let j = 0; j < headerSearch.length; j++) {
      headerSearch[j].classList.toggle("show");
    }

    let headerSearchWrapper = document.querySelectorAll(
      ".header-search-wrapper"
    );
    for (let j = 0; j < headerSearchWrapper.length; j++) {
      headerSearchWrapper[j].classList.toggle("show");
    }

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
  }

  function onWindowResize() {
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
  }

  function onBodyClick(e) {
    if (document.querySelector(".header-search-wrapper")) {
      let headerSearch = document.querySelectorAll(".header-search");
      let headerSearchWrapper = document.querySelectorAll(
        ".header-search-wrapper"
      );
      for (let j = 0; j < headerSearchWrapper.length; j++) {
        if (headerSearchWrapper[j].classList.contains("show")) {
          headerSearchWrapper[j].classList.remove("show");
          document.querySelector("body").classList.remove("is-search-active");
        }
      }

      for (let j = 0; j < headerSearch.length; j++) {
        if (headerSearch[j].classList.contains("show")) {
          headerSearch[j].classList.remove("show");
        }
      }
    }
  }

  const {
    addClass,
    iconClass = "icon-magnifier",
    placeholder = "Search...",
    isCat = true,
    text,
    btnAClass,
    searchId,
  } = props;

  return (
    <div className={"header-search " + addClass}>
      <Link
        to="#"
        className="search-toggle"
        role="button"
        onClick={onSearchClick}
      >
        <i className={iconClass}
         style={{ color: sellerConfigs.Theme.ColorPalette["Gray-10"] }}
        ></i>
        {text}
      </Link>
      <form action="#" method="get">
        <div className="header-search-wrapper">
          <SearchInput
            type="search"
            className="form-control"
            name="q"
            id={searchId ? searchId : "q"}
            placeholder={placeholder}
            required
            bg={sellerConfigs.Theme.ColorPalette["Gray-60"]}
            color={sellerConfigs.Theme.ColorPalette["Gray-50"]}
          />
          {isCat ? (
            <div className="select-custom"
            style={{
              background: sellerConfigs.Theme.ColorPalette["Gray-60"],
              color: sellerConfigs.Theme.ColorPalette["Gray-50"],
              borderColor: sellerConfigs.Theme.ColorPalette["White"],
            }}
            >
              <select id={searchId ? "StickyCat" : "cat"} name="cat">
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
            className={iconClass + " btn " + btnAClass}
            type="submit"
            style={{
              background: sellerConfigs.Theme.ColorPalette["Gray-60"],
              color: sellerConfigs.Theme.ColorPalette["Gray-10"],
              borderColor: sellerConfigs.Theme.ColorPalette["White"],
            }}
          ></button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
