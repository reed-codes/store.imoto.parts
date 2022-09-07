import React from "react";
import ColumnOne from "./components/footer/column-one";
import ColumnTwo from "./components/footer/column-two";
import ColumnThree from "./components/footer/column-three";
import ColumnFour from "./components/footer/column-four";
import CopyRightGrid from "./components/footer/copy-right-grid";
import { useSellerConfig } from "../../store/sellerConfigContext.js";
import EditBoxStrip from "../home/sections/components/tool-box/edit-box-strip";
import {
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../../utils";
import { toast } from "react-toastify";
import { updateComponent } from "../../action";
import AvailablePaymentMethods from "./components/footer/available-payment-methods";

function Footer() {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const columns = sellerConfigs.UIConfig.Footer.columns;
  const copyrightText = sellerConfigs.UIConfig.Footer.copyrightText;

  const updateColumn = (col, colPosition) => {
    const cols = [...sellerConfigs.UIConfig.Footer.columns];
    cols[colPosition] = col;
    const updatedFooter = {
      ...sellerConfigs.UIConfig.Footer,
      columns: cols,
    };

    const payload = getObjectDeepCopy(updatedFooter);

    sellerConfigDispatch(
      updateComponent({
        data: payload,
        component: "Footer",
      })
    );
    saveUpdatedFooter(payload);
  };

  const updateCopyRightText = (txt) => {
    const updatedFooter = {
      ...sellerConfigs.UIConfig.Footer,
      copyrightText: txt,
    };

    const payload = getObjectDeepCopy(updatedFooter);

    sellerConfigDispatch(
      updateComponent({
        data: payload,
        component: "Footer",
      })
    );
    saveUpdatedFooter(payload);
  };

  const saveUpdatedFooter = async (updatedFooter) => {
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

    updatedSellerConfig = {
      ...updatedSellerConfig,
      UIConfig: {
        ...updatedSellerConfig.UIConfig,
        Footer: updatedFooter,
      },
    };

    const blob = getSellerConfigJsonBlob(updatedSellerConfig);

    const [UPDATE_SUCCESSFUL, _] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      toast.success("Update successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <footer
      className={`footer ${
        sellerConfigs.UserInfo.enableEditing ? "edit-box primary-edit-box" : ""
      } `}
      style={{
        border: `1px transparent solid`,
        width: "100%",
        marginBottom: 0,
        marginTop: 0,
        background: sellerConfigs.Theme.ColorPalette["Gray-10"],
      }}
    >
      <EditBoxStrip />

      <Columns columns={columns} updateColumn={updateColumn} />

      <div className="container">
        <div
          className="footer-bottom d-flex justify-content-between align-items-center flex-wrap"
          style={{
            borderTop: `1px solid ${sellerConfigs.Theme.ColorPalette["Gray-40"]}`,
          }}
        >
          <CopyRightGrid
            copyrightText={copyrightText}
            updateCopyRightText={updateCopyRightText}
          />
          <AvailablePaymentMethods />
        </div>
      </div>
    </footer>
  );
}

const Columns = (props) => {
  const { sellerConfigs } = useSellerConfig();
  return (
    <div
      className="footer-middle"
      style={{
        color: sellerConfigs.Theme.ColorPalette["Gray-40"],
      }}
    >
      <div className="container">
        <div className="row">
          <ColumnOne updateColumn={props.updateColumn} />
          <ColumnTwo updateColumn={props.updateColumn} />
          <ColumnThree updateColumn={props.updateColumn} />
          <ColumnFour updateColumn={props.updateColumn} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Footer);
