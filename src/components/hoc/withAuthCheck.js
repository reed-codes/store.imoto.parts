import React, { useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";

import { instanceCOMAPI } from "../../axios/axios-instances";
import Authentication from "./../features/modal/authentication/authentication";
import UserSellerRequestedNotice from "../common/user-seller-requested-notice";
import RequestUserSellerRecord from "../common/user-seller-request";
import { useSellerConfig } from "../../store/sellerConfigContext";
import Loader from "../common/loader";
import { setEnableEditing, initUserSeller } from "../../action";
import UserSellerContext  from "../../store/UserSellerContext";

const withAuthCheck = (WrappedComponent) => {
  return (props) => {
    const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
    const { userSeller, userSellerDispatch } = useContext(UserSellerContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const authCheck = async () => {
        try {
          const user = await Auth.currentAuthenticatedUser();
          const ax = await instanceCOMAPI();
          // check if the there is the user seller record
          const userSellerResponse = await ax.get(
            `/userseller/${user.username}/${sellerConfigs.SellerID}`
          );

          if (userSellerResponse && userSellerResponse.status === 200) {
            const sellerResponse = await ax.get(`/seller/${sellerConfigs.SellerID}`);

            userSellerDispatch(initUserSeller({
              userApproved: userSellerResponse.data.UserSeller.Status === "Approved",
              userSellerExists: true,
              User: userSellerResponse.data.User,
              Seller: sellerResponse.data,
              UserSeller: userSellerResponse.data.UserSeller
            }));
          } else {
            userSellerDispatch(initUserSeller({
              userApproved: false,
              userSellerExists: false,
            }));
          }
        } catch (err) {
          setLoading(false);
          console.error(err.message);
          toast.error(err.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
          });
        }
      };

      if (!userSeller.userSellerExists || !userSeller.userApproved) {
        authCheck();
      }
    }, []);

    useEffect(() => {
      const { UserSeller } = userSeller;
      if (UserSeller && (UserSeller.Type === "Employee" || UserSeller.Type === "Owner")) {
        sellerConfigDispatch(setEnableEditing(true));
      } else {
        sellerConfigDispatch(setEnableEditing(false));
      }
    }, [userSeller.userApproved]);

    if (loading && (!userSeller.userSellerExists || !userSeller.userApproved)) {
      return <Loader />;
    } else if ((!userSeller.userSellerExists || Boolean(localStorage.getItem("REDIRECT"))) && props.location.pathname === "/") {
      return (
        <Authentication
          addClass="header-icon"
          open={false}
          component={WrappedComponent}
        />
      );
    } else if (!userSeller.userSellerExists || Boolean(localStorage.getItem("REDIRECT"))) {
      return (
        <Authentication
          addClass="header-icon"
          open={true}
        />
      );
    } else if (!userSeller.userSellerExists) {
      return <RequestUserSellerRecord />;
    } else if (userSeller.userApproved) {
      return <WrappedComponent {...props} />;
    } else if (!userSeller.userApproved) {
      return <UserSellerRequestedNotice />;
    } else {
      return <></>;
    }
  };
};

export default withAuthCheck;