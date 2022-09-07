import React, { useState, useEffect , useContext } from "react";
import { CartWishListContext } from "../../../store/CartWishlistContext";

import { Link } from "react-router-dom";
import { useSellerConfig } from "../../../store/sellerConfigContext";
import { Auth } from "aws-amplify";

import CartMenu from "./components/cart-menu";
import MainMenu from "./components/main-menu";
import SearchForm from "./components/search-form";
import { isIEBrowser , getQtyTotal, adjustColorBrightness} from "../../../utils";

import { setOpenAuthenticationModal } from "../../../action";

import styled from "styled-components";

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

function ThemeThree(props) {
  const IS_HOME_SCREEN = window.location.pathname === "/";

  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();

  const wishlistItems = cartWishList.wishlist ? cartWishList.wishlist : [];

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
    <header className={`header ${IS_HOME_SCREEN ? "header-transparent" : ""} `}>
      <div className="header-middle sticky-header">
        <div className="container">
          <div className="header-left">
            <Link to={`${process.env.PUBLIC_URL}/`} className="logo">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/demo/logo.png`}
                alt="Porto Logo"
              />
            </Link>
            <MainMenu active={props.active} addClass="font2" />
          </div>

          <div className="header-right">
            <button
              className="mobile-menu-toggler"
              type="button"
              onClick={handleClick}
            >
              <i className="icon-menu"></i>
            </button>

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

            <AnchorIconButton
              href={`${process.env.PUBLIC_URL}/pages/wishlist`}
              className="header-icon"
              title="Wishlist"
              hoverColor={sellerConfigs.Theme.ColorPalette["Primary"]}
              color={sellerConfigs.Theme.ColorPalette["Gray-10"]}
            >
              <i className="icon-wishlist-2"></i>

              <span
                className="cart-count badge-circle"
                style={{
                  background: sellerConfigs.Theme.ColorPalette["Quaternary"],
                  color: sellerConfigs.Theme.ColorPalette["White"],
                }}
              >
                {getQtyTotal(wishlistItems)}
              </span>


            </AnchorIconButton>


            <SearchForm
              addClass="header-search-popup header-search-category d-none d-sm-block"
              btnAClass="bg-dark"
            />

            <CartMenu btnClass="btn-dark" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ThemeThree;
