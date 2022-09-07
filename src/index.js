import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Amplify, Auth, Hub } from "aws-amplify";

import "react-super-treeview/dist/style.css";
import "react-app-polyfill/ie11";

// configure the amplify instance.
Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USERPOOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USERPOOL_WEB_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_USERPOOL_DOMAIN,
      scope: ["phone", "email", "profile", "openid"],
      redirectSignIn: `${window.location.origin}/`,
      redirectSignOut: `${window.location.origin}/`,
      responseType: "token",
    },
  },
});

Auth.configure();

export function Root() {
  const redirectPayload = {
    hash: window.location.hash,
    timestamp: new Date().getTime(),
  };

  try {
    const storedRedirectPayloadJSON = localStorage.getItem("redirect-payload");
    const storedRedirectPayload = JSON.parse(storedRedirectPayloadJSON);
    const milliSecondsSinceLastURLUpdate =
      new Date().getTime() - storedRedirectPayload.timestamp;

    //has it been more than 5 seconds since the url was updated
    //if so we can assume it is not a url update done by cognito and thus allow the update in localstorage
    if (milliSecondsSinceLastURLUpdate > 3000) {
      localStorage.setItem("redirect-payload", JSON.stringify(redirectPayload));
    }
  } catch {
    localStorage.setItem("redirect-payload", JSON.stringify(redirectPayload));
  }

  Hub.listen("auth", ({ payload: { event, data } }) => {
    switch (event) {
      case "signIn":
        console.log("signed in - ", data);
        break;

      case "customOAuthState":
        const authState = JSON.parse(data);
        const authRedirectPayload = JSON.parse(
          localStorage.getItem("redirect-payload")
        );
        const sellerWebsiteURL = `${authState.sourceURL}/${authRedirectPayload.hash}`;
        console.log("sellerWebsiteURL", sellerWebsiteURL);

        // if (authRedirectPayload.hash.includes("access_token")) {
        //   window.location.reload(sellerWebsiteURL);
        // }
        break;
    }
  });

  return <App />;
}

ReactDOM.render(<Root />, document.getElementById("root"));
