import React, { useState } from "react";
import "./style.css";

const DndListOrderController = (props) => {
  // console.log("props.options", props.options);
  // const list = ["blue", "green", "lime", "purple", "gold"];
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
      const removedFromIndex = props.options.findIndex(
        (item, i) => i.toString() === sourceElement.id
      );

      const insertAt = Number(e.target.id);

      const a = props.options[removedFromIndex];
      const b = props.options[insertAt];
      const reorderdList = [...props.options];

      reorderdList[insertAt] = a;
      reorderdList[removedFromIndex] = b;
      e.target.classList.remove("hovered-dnd-item");
      props.reorder(reorderdList);

      e.target.classList.remove("hovered-dnd-item");
    }
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
      {props.options.map((option, i) => {
        return (
          <div
            id={i}
            key={i}
            style={{
              backgroundColor: "#cce5ff",
              marginRight: 10,
              cursor: "grab",
              height: 70,
              width: 90,
              minWidth: 90,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
              // border:
              //   slide.id === props.currentSlide.id
              //     ? "1px #91c4e5 solid"
              //     : "1px transparent dashed",
            }}
            disabled={true}
            className="footer-social-media-dnd-item btn btn-primary"
            draggable="true"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            dangerouslySetInnerHTML={{ __html: option.icon }}
            onClick={() => props.setCurrentSocialMediaOption(option, i)}
          />
        );
      })}
    </div>
  );
};

export default DndListOrderController;
