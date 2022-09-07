import React from "react";
import { Link } from "react-router-dom";

import CartMenu from "./components/cart-menu";
import MainMenu from "./components/main-menu";
import SearchToggle from "./components/search-toggle";
import { isIEBrowser } from "../../../utils";

// import "./assets/css/style.min.css";
// import "./assets/css/porto-new-font.css";
import "../global-css/styles.css";

function ThemeSix(props) {
  const handleClick = (e) => {
    e.preventDefault();
    document.querySelector("body").classList.toggle("mmenu-active");
    e.currentTarget.classList.toggle("active");
    if (
      isIEBrowser() &&
      document.querySelector("body").classList.contains("mmenu-active")
    ) {
      document.querySelector(
        ".mmenu-active .mobile-menu-container"
      ).style.transform = "translateX(0)";
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-left d-none d-sm-block">
            <h6 className="telephone mb-0">Call Us (123) 456 7890</h6>
          </div>

          <div className="header-right w-sm-100">
            <div className="header-dropdown dropdown-expanded mr-auto mr-sm-3">
              <Link to="#">Links</Link>
              <div className="header-menu">
                <ul>
                  <li>
                    <Link
                      to={`${process.env.PUBLIC_URL}/pages/dashboard/account`}
                    >
                      Track Order{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/pages/about`}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${process.env.PUBLIC_URL}/categories/full-width`}
                    >
                      Our Stores
                    </Link>
                  </li>
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/pages/blog`}>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/pages/contact`}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="#">Help &amp; FAQs</Link>
                  </li>
                </ul>
              </div>
            </div>

            <span className="separator"></span>

            <div className="social-icons">
              <Link
                to="#"
                className="social-icon social-instagram icon-instagram"
                target="_blank"
              ></Link>
              <Link
                to="#"
                className="social-icon social-twitter icon-twitter ml-2"
                target="_blank"
              ></Link>
              <Link
                to="#"
                className="social-icon social-facebook icon-facebook ml-2"
                target="_blank"
              ></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="header-mobile-merge">
        <div className="header-middle header-align-center">
          <div className="container">
            <div className="header-left d-none d-lg-block">
              <div className="header-dropdowns font2">
                <div className="header-dropdown switcher">
                  <Link to="#">USD</Link>
                  <div className="header-menu">
                    <ul>
                      <li>
                        <Link to="#">EUR</Link>
                      </li>
                      <li>
                        <Link to="#">USD</Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="header-dropdown switcher">
                  <Link to="#">ENG</Link>
                  <div className="header-menu">
                    <ul>
                      <li>
                        <Link to="#">ENG</Link>
                      </li>
                      <li>
                        <Link to="#">SPA</Link>
                      </li>
                      <li>
                        <Link to="#">FRE</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="header-center">
              <button
                className="mobile-menu-toggler mr-3"
                type="button"
                onClick={handleClick}
              >
                <i className="icon-menu"></i>
              </button>

              <Link to={`${process.env.PUBLIC_URL}/`} className="logo">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/demo/logo.png`}
                  alt="Porto Logo"
                />
              </Link>
            </div>

            <div className="header-right">
              <SearchToggle
                addClass="header-search-inline header-icon"
                icon="icon-search-3"
              />
            </div>
          </div>
        </div>

        <div className="header-bottom sticky-header">
          <div className="container">
            <div className="header-left">
              <MainMenu active={props.active} />
            </div>

            <div className="header-right">
              <Link
                to={`${process.env.PUBLIC_URL}/pages/wishlist`}
                className="header-icon"
              >
                <i className="icon-wishlist-2"></i>
                  3
              </Link>

              <CartMenu btnAClass="btn-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ThemeSix
