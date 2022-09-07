import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

import CartMenu from "./components/cart-menu";
import MainMenu from "./components/main-menu";
import SearchForm from "./components/search-form";
import { adjustColorBrightness, isIEBrowser } from "../../../utils";

import { setOpenAuthenticationModal } from "../../../action";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import styled from "styled-components";
import "../global-css/styles.css";

const AnchorButton = styled.a`
  cursor: pointer;
  color: ${(props) => props.hoverTextColor} !important;
  &:hover {
    filter: brightness(95%);
    color: ${(props) => props.hoverTextColor} !important;
  }
  &:active {
    filter: brightness(80%);
    color: ${(props) => props.hoverTextColor} !important;
  }
`;

const AnchorIconButton = styled.a`
  cursor: pointer;
  color: ${(props) => props.color} !important;
  &:hover {
    color: ${(props) => props.hoverColor} !important;
  }
`;

function ThemeFour() {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [cognitoUserName, setCognitoUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCognitoUserName(user.signInUserSession.idToken.payload.email);
      } catch (err) {
        console.error("err", err.message);
      }
    };

    checkAuth();
  }, []);

  function handleClick(e) {
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
  }

  /**
   * handleSignoutClicked, function used to signout a user and clear the
   * currently existing session. If the user was signed in using basic
   * authentication then the user will be redirected to the home page
   * else this action is catered for by cognito.
   */
  const handleSignoutClicked = async () => {
    sessionStorage.clear();
    localStorage.clear();
    try {
      await Auth.signOut();
      // dont clear local storage for the persistance of the userseller status.
      // this will help us not to make a call to COMAPI for the user seller.
      window.location.reload();
    } catch (err) {
      console.log("error signing out: ", err.message);
    }
  };

  const handleSigninClicked = () => {
    sellerConfigDispatch(setOpenAuthenticationModal(true));
  };

  return (
    <header
      className="header"
      style={{
        border: "none",
      }}
    >
      <div
        className="header-top"
        style={{
          borderColor: sellerConfigs.Theme.ColorPalette["Gray-60"],
        }}
      >
        <div className="container">
          <div className="header-left header-dropdowns">
            <div className="header-dropdown ">
              <AnchorButton
                hoverTextColor={adjustColorBrightness(
                  sellerConfigs.Theme.ColorPalette["Gray-20"],
                  25
                )}
                className="pl-0"
                href="#"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/flags/en.png`}
                  alt="England flag"
                />
                ENG
              </AnchorButton>

              <div className="header-menu">
                <ul
                  style={{
                    background: adjustColorBrightness(
                      sellerConfigs.Theme.ColorPalette["Body"],
                      -10
                    ),
                  }}
                >
                  <li>
                    <AnchorButton
                      hoverTextColor={adjustColorBrightness(
                        sellerConfigs.Theme.ColorPalette["Gray-30"],
                        25
                      )}
                      href="#"
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/flags/en.png`}
                        alt="England flag"
                      />
                      ENG
                    </AnchorButton>
                  </li>
                  <li>
                    <AnchorButton
                      hoverTextColor={adjustColorBrightness(
                        sellerConfigs.Theme.ColorPalette["Gray-30"],
                        25
                      )}
                      href="#"
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/flags/fr.png`}
                        alt="France flag"
                      />
                      FRA
                    </AnchorButton>
                  </li>
                </ul>
              </div>
            </div>

            <div className="header-dropdown">
              <AnchorButton
                hoverTextColor={adjustColorBrightness(
                  sellerConfigs.Theme.ColorPalette["Gray-20"],
                  25
                )}
                href="#"
              >
                USD
              </AnchorButton>
              <div className="header-menu">
                <ul
                  style={{
                    background: adjustColorBrightness(
                      sellerConfigs.Theme.ColorPalette["Body"],
                      -10
                    ),
                  }}
                >
                  <li>
                    <AnchorButton
                      hoverTextColor={adjustColorBrightness(
                        sellerConfigs.Theme.ColorPalette["Gray-30"],
                        25
                      )}
                      href="#"
                    >
                      EUR
                    </AnchorButton>
                  </li>
                  <li>
                    <AnchorButton
                      hoverTextColor={adjustColorBrightness(
                        sellerConfigs.Theme.ColorPalette["Gray-30"],
                        25
                      )}
                      href="#"
                    >
                      USD
                    </AnchorButton>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="header-right">
            <p className="top-message text-uppercase d-none d-sm-block mr-4">
              Free returns. Standard shipping orders $99+
            </p>

            <span className="separator"></span>

            <div className="header-dropdown dropdown-expanded mx-2 px-1">
              <Link to="#">Links</Link>
              <div className="header-menu">
                <ul>
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
                  <li className="menu-item">
                    <Link
                      className="login"
                      to={`${process.env.PUBLIC_URL}/pages/login`}
                    >
                      Log In
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <span className="separator"></span>
          </div>
        </div>
      </div>
      <div className="header-middle">
        <div className="container">
          <div className="header-left w-lg-max ml-auto ml-lg-0">
            <SearchForm
              addClass="header-icon header-search-inline header-search-category"
              iconClass="icon-search-3"
            />
          </div>

          <div className="header-center order-first order-lg-0 ml-0 ml-lg-auto">
            <button
              className="mobile-menu-toggler"
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

          <div className="header-right w-lg-max ml-0 ml-lg-auto">
            <div className="header-contact d-none d-lg-flex align-items-center ml-auto pr-xl-4 mr-4">
              <i className="icon-phone-2"></i>
              <h6 className="pt-1 line-height-1 pr-2">
                Call us now
                <Link to="#" className="d-block text-dark pt-1 font1">
                  +123 5678 890
                </Link>
              </h6>
            </div>

            <AnchorIconButton
              href={`${process.env.PUBLIC_URL}/pages/wishlist`}
              className="header-icon"
              title="Wishlist"
              hoverColor={sellerConfigs.Theme.ColorPalette["Primary"]}
              color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
            >
              <i className="icon-wishlist-2"></i>
            </AnchorIconButton>

            <CartMenu btnClass="btn-dark" />

            {cognitoUserName ? (
              <ul className="menu">
                <li>
                  <AnchorIconButton
                    href={"#"}
                    style={{ marginLeft: 10 }}
                    className="dropdown-toggle dropdown-arrow "
                    hoverColor={sellerConfigs.Theme.ColorPalette["Primary"]}
                    color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
                  >
                    <i className="icon-user-2"></i>
                  </AnchorIconButton>
                  <ul
                    style={{
                      width: "100%",
                      borderColor: sellerConfigs.Theme.ColorPalette["Primary"],
                      background: adjustColorBrightness(
                        sellerConfigs.Theme.ColorPalette["Body"],
                        -10
                      ),
                    }}
                  >
                    <li>
                      <AnchorButton
                        hoverTextColor={adjustColorBrightness(
                          sellerConfigs.Theme.ColorPalette["Gray-30"],
                          25
                        )}
                        href="#"
                      >
                        {cognitoUserName}
                      </AnchorButton>
                    </li>
                    <li>
                      <AnchorButton
                        hoverTextColor={adjustColorBrightness(
                          sellerConfigs.Theme.ColorPalette["Gray-30"],
                          25
                        )}
                        href={`${process.env.PUBLIC_URL}/pages/dashboard/board`}
                      >
                        <i style={{ marginRight: 20 }} className="fa fa-user" />
                        My Account
                      </AnchorButton>
                    </li>
                    <li>
                      <AnchorButton
                        hoverTextColor={adjustColorBrightness(
                          sellerConfigs.Theme.ColorPalette["Gray-30"],
                          25
                        )}
                        href={"#"}
                        onClick={handleSignoutClicked}
                      >
                        <i
                          style={{ marginRight: 20 }}
                          className="fas fa-sign-out-alt"
                        />
                        Signout
                      </AnchorButton>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              <AnchorIconButton
                title="Login"
                style={{ marginLeft: 10 }}
                className={"login-link header-icon"}
                href="#"
                onClick={handleSigninClicked}
                hoverColor={sellerConfigs.Theme.ColorPalette["Primary"]}
                color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
              >
                <i className="icon-user-2"></i>
              </AnchorIconButton>
            )}
          </div>
        </div>
      </div>
      <div
        className="header-bottom sticky-header"
        style={{
          background: sellerConfigs.Theme.ColorPalette["Body"],
          border:'none'
        }}
      >
        <div className="container">
          <Link to={`${process.env.PUBLIC_URL}/`} className="logo logo-right">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/demo/logo.png`}
              alt="Porto-Logo"
            />
          </Link>
          <MainMenu
            active={0}
            btnAClass="p-0"
            addClass="d-lg-flex w-lg-max justify-content-center"
            subClass="sf-js-enabled"
          />
          <SearchForm
            searchId="stickySearch"
            addClass="header-icon header-search header-search-category ml-auto logo"
            iconClass="icon-search-3"
          />
          <Link
            to={`${process.env.PUBLIC_URL}/pages/wishlist`}
            className="header-icon pl-1 logo"
          >
            <i className="icon-wishlist-2"></i>
          </Link>

          <CartMenu addClass="logo" btnClass="btn-dark" />


        </div>
      </div>
    </header>
  );
}

export default ThemeFour;
