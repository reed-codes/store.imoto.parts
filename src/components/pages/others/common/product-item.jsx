
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import QtyVertical from "../common/qty-vertical";

import {
  setQty,
  removeFromCart,
  addToWishList,
  addToCart,
  removeFromWishlist
} from "../../../../action";
import {
  addListItemToList,
  deleteListItemByListName
} from "../../../../api";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import { CartWishListContext } from "../../../../store/CartWishlistContext";


const ProductItem = (props) => {
  const { index, product } = props
  const { sellerConfigs } = useSellerConfig()
  const { cartWishListDispach } = useContext(CartWishListContext);

  const [item, setItem] = useState({ ...product })
  const [btnVisible, setBtnVisible] = useState(false)

  const handleRemoveItemFromCart = async (event, product) => {
    event.preventDefault();
    const listItem = {
      ProductID: product.ProductID,
      Quantity: 1,
    };

    const [, removeFromCartError] = await deleteListItemByListName(sellerConfigs.SellerID, "cart", listItem.ProductID, listItem)
    if (removeFromCartError === null) {
      cartWishListDispach(removeFromCart(product));
      toast.success("Item successfully removed from cart")
    }
  };

  const handleMoveItemFromWishListToCart = async (item) => {
    cartWishListDispach(addToWishList(item.ProductInfo));
    cartWishListDispach(removeFromCart(item));
    const listItem = {
      ProductID: item.ProductID,
      Quantity: 1,
      ProductInfo: item.ProductInfo,
    };
    // set Item Qty to 1.
    setItem({ ...item, Quantity: 1 });

    const [, addToWishlistError] = await addListItemToList(sellerConfigs.SellerID, "wishlist", listItem)

    const [, removeFromCartError] = await deleteListItemByListName(sellerConfigs.SellerID, "cart", listItem.ProductID, listItem)

    if (addToWishlistError === null && removeFromCartError === null) {
      toast.success("Successfully moved item from cart to wishlist.")
    } else {
      cartWishListDispach(addToCart(product.ProductInfo));
      cartWishListDispach(removeFromWishlist(product));
      toast.error("Failed to move item from cart to wishlist.")
    }
  };

  const handleInputChange = (e) => {
    e.persist()

    if (e.target.value === '' || parseInt(e.target.value) === props.product.Quantity) {
      setItem({
        ...item,
        Quantity: e.target.value
      })
      setBtnVisible(false)
      return;
    }

    const qty = parseInt(e.target.value)
    if (qty > 0) {
      if (typeof (qty) === 'number' && isFinite(qty)) {
        setItem({
          ...item,
          Quantity: qty
        });

        if (props.product.Quantity !== qty) {
          setBtnVisible(true);
        } else {
          setBtnVisible(false);
        }
      }
    }
  }

  const handleCancelQtyChange = async () => {
    setItem({
      ...item,
      Quantity: props.product.Quantity
    });
    setBtnVisible(false);
  }

  const handleSubmitQtyChange = async () => {
    const listItem = {
      ProductID: product.ProductID,
      Quantity: item.Quantity,
      ProductInfo: product.ProductInfo,
    };

    cartWishListDispach(setQty(product, item.Quantity));

    const [, qtyChangeError] = await addListItemToList(sellerConfigs.SellerID, "cart", listItem);
    if (qtyChangeError === null) {
      toast.success("Successfully updated product quantity");
      setBtnVisible(false);
      return;
    }

    toast.error(`Failed to update item quantity`);
  }

  return (
    <>
      <tr className="product-row">
        <td className="product-col">
          <figure className="product-image-container">
            <Link
              to={`${process.env.PUBLIC_URL}/product/default/${product.ProductID}`}
              className="product-image"
            >
              <img
                src={`${product.ProductInfo.ImageURL[0]}`}
                style={{ objectFit: 'cover', height: '100%' }}
                alt="product"
              />
            </Link>

            <Link
              to="#"
              className="btn-remove icon-cancel"
              title="Remove Product"
              onClick={(e) => handleRemoveItemFromCart(e, product)}
            ></Link>
          </figure>
          <h2 className="product-title">
            <Link
              to={`${process.env.PUBLIC_URL}/product/default/${product.ProductInfo.ProductID}`}
            >
              {product.ProductInfo.Description}
            </Link>
          </h2>
        </td>
        <td>
          $
          {product.ProductInfo.salePrice
            ? product.ProductInfo.salePrice.toFixed(2)
            : product.ProductInfo.Price.toFixed(2)}
        </td>
        <td>
          <div style={{ height: "25px", background: '', width: '72px', margin: '0 auto' }}></div>
          <div>
            <QtyVertical handleInputChange={handleInputChange}
              setItem={setItem}
              setBtnVisible={setBtnVisible}
              product={item}
              id={`qty-vertical-${index}`}
            />
          </div>
          <div className="d-flex justify-content-between" style={{ margin: '2px auto', width: '68px', height: '25px' }}>
            <button onClick={handleCancelQtyChange} title="Cancel Quantity Update" className="btn btn-danger justify-content-center align-items-center " style={{ display: btnVisible ? "flex" : 'none', width: '48.5%', padding: '0 1px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                className="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
            <button onClick={handleSubmitQtyChange} title="Confirm Quantity Update" className="btn btn-success justify-content-center align-items-center " style={{ display: btnVisible ? "flex" : 'none', width: '48.5%', padding: '0 1px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          </div>
        </td>
        <td>${(product.Quantity * product.ProductInfo.Price).toFixed(2)}</td>
      </tr>
      <tr className="product-action-row">
        <td colSpan="4" className="clearfix">
          <div className="float-left">
            <Link
              to="#"
              className="btn-move"
              onClick={(e) => {
                e.preventDefault()
                handleMoveItemFromWishListToCart(product)
              }}
            >
              Move to Wishlist
            </Link>
          </div>
        </td>
      </tr>
    </>
  )
}

export default ProductItem;