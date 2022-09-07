import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

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

function ThemeTwo(props) {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [cognitoUserName, setCognitoUserName] = useState("");
  const [isMenu, setIsMenu] = useState(true);
  const phoneImage = "assets/images/demo/phone.png";
  const { badgePos = 2 } = props;

  useEffect(() => {
    if (window.location.pathname === process.env.PUBLIC_URL + "/") {
      setIsMenu(false);
    }
  }, [window.location.pathname]);

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

  return (
    <header className="header">
      <div
        className="header-top text-uppercase"
        style={{
          background: adjustColorBrightness(
            sellerConfigs.Theme.ColorPalette["Primary"],
            -25
          ),
        }}
      >
        <div className="container">
          <div className="header-left">
            <div className="header-dropdown mr-auto mr-sm-3 mr-md-0">
              <AnchorButton
                hoverTextColor={adjustColorBrightness(
                  sellerConfigs.Theme.ColorPalette["Gray-60"],
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

            <div className="header-dropdown ml-4">
              <AnchorButton
                hoverTextColor={adjustColorBrightness(
                  sellerConfigs.Theme.ColorPalette["Gray-60"],
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

          <div
            className="header-right header-dropdowns ml-0 ml-sm-auto"
            style={{
              color: sellerConfigs.Theme.ColorPalette["Gray-60"],
            }}
          >
            <p className="top-message mb-0 mr-lg-5 pr-3 d-none d-sm-block">
              Welcome To Porto!
            </p>
            <div className="header-dropdown dropdown-expanded mr-3">
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
          </div>
        </div>
      </div>

      <div className="header-middle">
        <div className="container">
          <div className="header-left col-lg-2 w-auto pl-0">
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

          <div className="header-right w-lg-max ml-0">
            <SearchForm
              addClass="header-icon header-search-inline header-search-category w-lg-max pl-0"
              iconClass="icon-search-3"
            />

            <div className="header-contact d-none d-lg-flex pl-4 ml-3 mr-xl-5 pr-4">
              <img
                alt="phone"
                src={`${process.env.PUBLIC_URL}/` + phoneImage}
                width="30"
                height="30"
                className="pb-1"
              />
              <h6
                style={{
                  color: sellerConfigs.Theme.ColorPalette["Gray-30"],
                }}
              >
                Call us now
                <span
                  to="#"
                  className="font1"
                  style={{
                    color: sellerConfigs.Theme.ColorPalette["Quinary"],
                    cursor: "default",
                  }}
                >
                  +123 5678 890
                </span>
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

      {isMenu ? (
        <div className="header-bottom sticky-header d-lg-block">
          <div className="container">
            <MainMenu active={0} badgePos={badgePos} />
          </div>
        </div>
      ) : (
        ""
      )}
    </header>
  );
}

export default ThemeTwo;
