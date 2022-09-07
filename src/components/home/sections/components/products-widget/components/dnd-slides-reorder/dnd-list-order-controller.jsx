import React from "react";
import ProductTypeFour from "../../../../../../features/product/product-type-four";
import { v4 as uuidv4 } from "uuid";
import "./style.css";

const DndListOrderController = (props) => {
  let sourceElement = null;

  /* change opacity for the dragged item. 
  remember the source item for the drop later */
  const handleDragStart = (e) => {
    e.target.style.opacity = 1;
    sourceElement = e.target;
    e.dataTransfer.effectAllowed = "move";
  };

  /* do not trigger default event of item while passing (e.g. a link) */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /* add class .over while hovering other items */
  const handleDragEnter = (e) =>
    e.target.classList.add("hovered-product-widget-dnd-item");

  /* remove class .over when not hovering over an item anymore*/
  const handleDragLeave = (e) =>
    e.target.classList.remove("hovered-product-widget-dnd-item");

  const handleDrop = (e) => {
    e.persist();
    /* prevent redirect in some browsers*/
    e.stopPropagation();

    if (!sourceElement) return;
    /* only do something if the dropped on item is 
    different to the dragged item*/
    if (sourceElement !== e.target) {
      /* remove dragged item from list */

      const list = props.list.filter(
        (item, i) => i.toString() !== sourceElement.id
      );

      /* this is the removed item */
      const removed = props.list.filter(
        (item, i) => i.toString() === sourceElement.id
      )[0];

      /* insert removed item after this number. */
      let insertAt = Number(e.target.id);

      let tempList = [];

      /* if dropped at last item, don't increase target id by +1. 
         max-index is arr.length */
      if (insertAt >= list.length) {
        tempList = list.slice(0).concat(removed);
        props.reorder(tempList);
        e.target.classList.remove("hovered-product-widget-dnd-item");
      } else if (insertAt < list.length) {
        /* original list without removed item until the index it was removed at */
        tempList = list.slice(0, insertAt).concat(removed);

        /* add the remaining items to the list */
        const newList = tempList.concat(list.slice(insertAt));

        /* set state to display on page */
        props.reorder(newList);
        e.target.classList.remove("hovered-product-widget-dnd-item");
      }
    } else {
      // console.log("nothing happened")
    }
    e.target.classList.remove("hovered-product-widget-dnd-item");
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
  };

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      {props.list.map((item, i) => {
        return (
          <div
            key={uuidv4()}
            id={i}
            style={{
              backgroundSize: "cover",
              position: "relative",
              cursor: "grab",
              background: "#fff",
              marginBottom: 3,
              opacity: "1 !important",
            }}
            draggable="true"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                zIndex: 10,
                top: 0,
                left: 0,
                opacity: "1 !important",
              }}
              id={i}
            />

            <div
              style={{
                height: "100%",
                width: 30,
                background: "#fff",
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
              }}
              onClick = {()=>props.deleteProduct(item.ProductID)}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  background: "#f8ced04d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: "1px #dc3444 solid",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="#dc3444"
                  viewBox="0 0 16 16"
                  className="bi bi-trash-fill"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                </svg>
              </div>
            </div>
            <ProductTypeFour
              addClass=" left-details product-widget shadow-sm mb-0"
              product={item}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DndListOrderController;
