import React from "react";
import "./style.css";

const CarouselSlidesDndListOrderController = (props) => {
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
  const handleDragEnter = (e) =>  e.target.classList.add("hovered-dnd-item1");

  /* remove class .over when not hovering over an item anymore*/
  const handleDragLeave = (e) => e.target.classList.remove("hovered-dnd-item1");

  const handleDrop = (e) => {
    /* prevent redirect in some browsers*/
    e.stopPropagation();
    
    if(!sourceElement) return
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

      // console.log("list with item removed", list);
      // console.log("removed:  line", removed);
      // console.log("insertAt index", insertAt);

      let tempList = [];

      /* if dropped at last item, don't increase target id by +1. 
         max-index is arr.length */
      if (insertAt >= list.length) {
        tempList = list.slice(0).concat(removed);
        props.reorder(tempList);
        e.target.classList.remove("hovered-dnd-item1");
      } else if (insertAt < list.length) {
        /* original list without removed item until the index it was removed at */
        tempList = list.slice(0, insertAt).concat(removed);

        // console.log("tempList", tempList);
        // console.log("insert the rest: ", list.slice(insertAt));

        /* add the remaining items to the list */
        const newList = tempList.concat(list.slice(insertAt));
        // console.log("newList", newList);

        /* set state to display on page */
        props.reorder(newList);
        e.target.classList.remove("hovered-dnd-item1");
      }
    }
    e.target.classList.remove("hovered-dnd-item1");
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
  };

  return (
    <div className="dnd-list-wrapper1">
      {props.slides.map((slide, i) => {
        return (
          <input
            id={i}
            key={i}
            style={{
              background: `url(${slide.image})`,
              backgroundSize:'cover',
              position: "relative",
              border: slide.id === props.currentSlide.id ? '1px #91c4e5 solid' :  '1px transparent dashed'
            }}
            disabled={true}
            className="dnd-item1"
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

export default CarouselSlidesDndListOrderController;
