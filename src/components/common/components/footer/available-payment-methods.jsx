import React, { useState } from "react";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import AddPaymentOptionModal from "./components/payment-options/add-payment-option-modal";
import EditPaymentOptionsModal from "./components/payment-options/edit-payment-options-modal";
import WidgetOptions from "./components/widget-options";
import { v4 as uuidv4 } from "uuid";

const AvailablePaymentMethods = () => {
  const { sellerConfigs } = useSellerConfig();
  const [openPaymentOptionsEditor, setOpenPaymentOptionsEditorModal] = useState(false);
  const [openNewPaymentOptionAdderModal, setOpenNewPaymentOptionAdderModal] = useState(false);

  const paymentMethods = sellerConfigs.UIConfig.Footer.paymentMethods;

  const COMPONENT_IS_EMPTY = !Boolean(paymentMethods.length)

  const handleOpenPaymentOptionsEditor = () => {
    if (sellerConfigs.UIConfig.Footer.paymentMethods.length) {
      setOpenPaymentOptionsEditorModal(true);
      setOpenNewPaymentOptionAdderModal(false);
    } else {
      setOpenNewPaymentOptionAdderModal(true);
      setOpenPaymentOptionsEditorModal(false);
    }
  };

  const handleClosePaymentOptionsEditorModal = () => setOpenPaymentOptionsEditorModal(false);

  const handleOpenPaymentOptionAdder = () => {
    setOpenPaymentOptionsEditorModal(false);
    setOpenNewPaymentOptionAdderModal(true);
  };

  const handleCloseNewPaymentOptionAdderModal = () => setOpenNewPaymentOptionAdderModal(false);

  if(COMPONENT_IS_EMPTY) return <></>

  return (
    <>
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 4,
          position: "relative",
        }}
        className="footer-payments py-3"
      >
        {paymentMethods.map((option, i) => {
          return (
            <img
              src={option.img}
              alt={"payment-method-" + i}
              key={uuidv4()}
              style={{
                height: "100%",
                background: "#000",
              }}
            />
          );
        })}

        <div
          style={{
            padding: 2,
            position: "absolute",
            left: -90,
            top: -10,
          }}
        >
          <WidgetOptions openEditOption={handleOpenPaymentOptionsEditor} />
        </div>
      </div>

      {openPaymentOptionsEditor && (
        <EditPaymentOptionsModal
          close={handleClosePaymentOptionsEditorModal}
          addNewItem={handleOpenPaymentOptionAdder}
        />
      )}

      {openNewPaymentOptionAdderModal && <AddPaymentOptionModal close={handleCloseNewPaymentOptionAdderModal} />}
    </>
  );
};

export default AvailablePaymentMethods;
