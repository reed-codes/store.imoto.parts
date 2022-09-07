import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { matchPath } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.min.css";

import Theme from "./themes";
import Footer from "./common/footer";
import TopNotice from "./common/top-notice";
import MobileMenu from "./common/mobile-menu";
import AddToCartModal from "./features/modal/add-to-cart-modal";
import QuickModal from "./features/modal/quick-modal";
import ThemingWidget from "./theming-widget";
import { Auth } from "aws-amplify";

import { init } from "../utils";

import { innerOverlayPaths } from "../mock-data/data";

import "react-image-lightbox/style.css";
import { useSellerConfig } from "../store/sellerConfigContext";

import NotifWorker from "../workers/notification-worker";
import NotificationAndDatabaseContext from "../store/NotificationAndDatabaseContext";
import { setNotifications, setNotificationWorker } from "../action";

function Layout(props) {
  const { sellerConfigs } = useSellerConfig();
  const { workersState, workersStateDispatch } = useContext(
    NotificationAndDatabaseContext
  );
  const [prevPath, setPrevPath] = useState("");

  let thisWorker = workersState.notificationWorker,
    matchedCount = 0;
  const currentTheme = Number(sellerConfigs.Theme.Template);

  //--------------------------------------------------------------------------------------------------------------------------------------------------------
  /*
   * This useEffect runs on page start and setups up the NOTIFICATION web worker service.
   * it will also setup the onmessage to receive messages from the webworker and dispatch them
   * to the notificationReducer
   */
  useEffect(() => {
    const initNotificationWorker = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();

        thisWorker.postMessage({
          msg: "start",
          url: `${process.env.REACT_APP_CHAT_BASE_URL_PROD}?userid=${authenticatedUser.username}`,
          token: authenticatedUser.signInUserSession.idToken.jwtToken,
        });
      } catch (error) {
        toast.error("User Not signed in");
      }
    };

    // setup new worker iff it doesnt exist in the global state and then
    // set up  messages listeners.
    if (!workersState.notificationWorker) {
      thisWorker = new Worker(NotifWorker);
      initNotificationWorker();
      // when worker sends a message, send it to context notificationreducer
      thisWorker.onmessage = (e) => {
        // we have notifications, so send to notification context and all listeners will pick it up
        if (e && e.data && e.data.status === 200 && e.data.notifications) {
          workersStateDispatch(setNotifications(e.data.notifications));
        } else if (e && e.data && e.data.msg === "isOnline") {
          // If worker wants to know if we are online, then post message back
          thisWorker.postMessage({
            msg: "onlineStatus",
            online: navigator.onLine,
          });
        } else {
          toast.error("Error getting user's messages");
          console.error("[3] onMessage Error");
        }
      };

      // dispatch the webworker to global state so we can reuse the same
      // webworker on the different components/ pages that need to listen
      // to the web worker messages
      workersStateDispatch(setNotificationWorker(thisWorker));
    }
  }, []);
  //--------------------------------------------------------------------------------------------------------------------------------------------------------

  const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <i
      className="icon-cancel"
      onClick={closeToast}
      style={{ display: "flex", alignItems: "center" }}
    ></i>
  );

  useLayoutEffect(() => {
    let overlayFlag = true;

    for (let i = 0; i < innerOverlayPaths.length; i++) {
      if (
        prevPath.indexOf(innerOverlayPaths[i]) > 0 &&
        props.location.pathname.indexOf(innerOverlayPaths[i]) > 0
      ) {
        overlayFlag = false;
      }

      if (prevPath === props.location.pathname) {
        overlayFlag = false;
      }
    }

    if (overlayFlag) {
      document.querySelector("body").classList.remove("loaded");
      document.querySelector("#root").classList.remove("loaded");
    }
  }, [window.location.pathname]);

  useEffect(() => {
    setPrevPath(props.location.pathname);
    setTimeout(() => {
      document.querySelector("body").classList.add("loaded");
      document.querySelector("#root").classList.add("loaded");
    }, 200);
  }, [window.location.pathname]);

  useEffect(() => {
    init();
    // show 404 page
    while (
      matchedCount < props.children.length &&
      !matchPath(window.location.pathname, {
        path: props.children[matchedCount].props.path,
        exact: true,
      })
    ) {
      matchedCount++;
    }

    if (props.children && !props.children.length) {
      if (
        matchPath(window.location.pathname, {
          path: props.children.props.path,
          exact: true,
        })
      ) {
        matchedCount = 1;
      }
    }

    if (
      matchedCount >= props.children.length ||
      (props.children && !props.children.length && matchedCount === 0)
    ) {
      window.location = process.env.PUBLIC_URL + "/pages/404";
    }
  });

  useEffect(() => {
    if (window.location.pathname === process.env.PUBLIC_URL + "/") {
      document.querySelector("html").style.overflowX = "hidden";
    } else {
      document.querySelector("html").style.overflowX = "visible";
    }
  });

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href={`${process.env.PUBLIC_URL}/theme-catalogue/${currentTheme}/css/style.min.css`}
        />
        <link
          rel="stylesheet"
          href={`${process.env.PUBLIC_URL}/theme-catalogue/${currentTheme}/css/style.min.css`}
        />
      </Helmet>

      <div
        className="porto"
        style={{
          background: sellerConfigs.Theme.ColorPalette["Body"],
          color: sellerConfigs.Theme.ColorPalette["Gray-20"],
        }}
      >
        <div className="page-wrapper">
          <TopNotice />
          <Theme />
          {props.children}
          <Footer />
        </div>

        {sellerConfigs.UserInfo.enableEditing && <ThemingWidget />}
        
        <MobileMenu />
        <AddToCartModal />
        <QuickModal />
        <ToastContainer autoClose={2000} closeButton={<CloseButton />} />
      </div>
    </>
  );
}

export default Layout;
