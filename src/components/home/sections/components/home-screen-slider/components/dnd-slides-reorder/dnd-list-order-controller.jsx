import React from "react";
import "./style.css";

const DndListOrderController = (props) => {
  let sourceElement = null;

  /* change opacity for the dragged item. 
  remember the source item for the drop later */
  const handleDragStart = (e) => {
    e.target.style.opacity = 0.7;
    sourceElement = e.target;
    e.dataTransfer.effectAllowed = "move";
  };

  /* do not trigger default event of item while passing (e.g. a link) */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /* add class .over while hovering other items */
  const handleDragEnter = (e) => e.target.classList.add("hovered-dnd-item");

  /* remove class .over when not hovering over an item anymore*/
  const handleDragLeave = (e) => e.target.classList.remove("hovered-dnd-item");

  const handleDrop = (e) => {
    /* prevent redirect in some browsers*/
    e.stopPropagation();

    if (!sourceElement) return;
    /* only do something if the dropped on item is 
    different to the dragged item*/
    if (sourceElement !== e.target) {
      /* remove dragged item from list */
      const list = props.slides.filter(
        (item, i) => i.toString() !== sourceElement.id
      );

      /* this is the removed item */
      const removed = props.slides.filter(
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
        e.target.classList.remove("hovered-dnd-item");
      } else if (insertAt < list.length) {
        /* original list without removed item until the index it was removed at */
        tempList = list.slice(0, insertAt).concat(removed);

        /* add the remaining items to the list */
        const newList = tempList.concat(list.slice(insertAt));

        /* set state to display on page */
        props.reorder(newList);
        e.target.classList.remove("hovered-dnd-item");
      }
    }
    e.target.classList.remove("hovered-dnd-item");
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
  };

  return (
    <div
      style={{
        border: "1px #c7c8c9 solid",
        background: "#e9ecef",
        display: "flex",
        overflow: "auto",
        padding: "1.4rem 1.5rem",
      }}
    >
      {props.slides.map((slide, i) => {
        return (
          <input
            id={i}
            key={i}
            style={{
              backgroundColor: "#cce5ff",
              background: `url(${slide.img})`,
              backgroundSize: "cover !important",
              backgroundPosition: "center !important",
              position: "relative",
              display: "block",
              height: 50,
              width: 95,
              minWidth: 95,
              display: "flex",
              marginRight: 10,
              cursor: "grab",
              border:
                slide.id === props.currentSlide.id
                  ? "1px #91c4e5 solid"
                  : "1px transparent dashed",
            }}
            disabled={true}
            className="home-screen-slider-dnd-item"
            draggable="true"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </div>
  );
};

export default DndListOrderController;
