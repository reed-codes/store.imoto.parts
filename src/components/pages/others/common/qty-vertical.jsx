import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";

import { setQty } from "../../../../action";
import { addListItemToList } from "../../../../api";

import { CartWishListContext } from "../../../../store/CartWishlistContext";
import { useSellerConfig } from "../../../../store/sellerConfigContext";

function QtyVertical(props) {
  const { product, handleInputChange, setItem, setBtnVisible } = props
  const { cartWishList, cartWishListDispach } = useContext(CartWishListContext);
  const { sellerConfigs } = useSellerConfig();
  const [ disableQtyEdit, setDisableQtyEdit ] = useState(false);

  useEffect(() => {
    document.querySelector(`#${props.id} input`) &&
      (document.querySelector(`#${props.id} input`).value = props.product.Quantity);
  });

  let listItem = {
    ProductID: product.ProductID,
    Quantity: 1,
    ProductInfo: product.ProductInfo
  };

  const handleCountUp = async () => {
    setDisableQtyEdit(true)
    if (!disableQtyEdit) {
      try {
        cartWishList.cart.map((item) => {
          if (product.ProductID === item.ProductID) {
            listItem.Quantity = parseInt(product.Quantity ? product.Quantity : 0) + 1
          }
        })

        cartWishListDispach(setQty(props.product, listItem.Quantity));
        setItem((product) => ({
          ...product,
          Quantity: parseInt(product.Quantity ? product.Quantity : 0) + 1
        }))

        const [, incrementQtyError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);
        if (incrementQtyError === null) {
          toast.success(`Successfully updated quantity to ${listItem.Quantity}`)
          return
        } else {
          toast.error(`Unable to update quantity`)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setDisableQtyEdit(false)
        setBtnVisible(false)
      }
    } else {
      toast.error("Cannot set quantity to zero (0).")
    }
  };

  const handleCountDown = async () => {
    if (props.product.Quantity > 1) {
      setDisableQtyEdit(true)
      if (!disableQtyEdit) {
        cartWishList.cart.map((item) => {
          if (product.ProductID === item.ProductID) {
            listItem.Quantity = product.Quantity - 1
          }
        })

        setItem((product) => ({
          ...product,
          Quantity: listItem.Quantity
        }))

        cartWishListDispach(setQty(props.product, listItem.Quantity));

        const [, decrementQtyError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);
        if (decrementQtyError === null) {
          toast.success(`Successfully updated quantity to ${listItem.Quantity}`)
        } else {
          toast.error(`Unable to update quantity`)
        }

        setDisableQtyEdit(false)
        setBtnVisible(false)
      }
    } else {
      toast.error("Cannot set quantity to zero (0).")
    }
  };

  return (
    <div
      className="input-group  bootstrap-touchspin bootstrap-touchspin-injected"
      id={props.id}
    >
      <input
        className="vertical-quantity form-control"
        type="text"
        onChange={(e) => handleInputChange(e)}
        disabled={disableQtyEdit}
        defaultValue={product.Quantity}
      />
      <span className="input-group-btn-vertical">
        <button
          disabled={disableQtyEdit}
          className="btn btn-outline bootstrap-touchspin-up icon-up-dir"
          onClick={handleCountUp}
          type="button"
        />
        <button
          disabled={disableQtyEdit}
          className="btn btn-outline bootstrap-touchspin-down icon-down-dir"
          onClick={handleCountDown}
          type="button"
        />
      </span>
    </div>
  );
}

export default QtyVertical;
