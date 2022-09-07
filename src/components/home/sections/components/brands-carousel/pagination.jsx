import React from 'react';

const Pagination = (props) => {
    return (
      <div
        style={{
          width: "fit-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 63,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: 110,
        }}
      >
        <nav>
          <div
            className="pagination"
            style={{
              margin: 0,
              padding: "1rem 3rem",
              display: "flex",
              alignItems: "center",
              gap: 5,
              userSelect: "none",
            }}
          >
            <div>
              <button
                className="page-link btn btn-outline-primary btn-sm"
                style={{
                  opacity: props.IS_FIRST_SLIDE ? 0.9 : 1,
                  pointerEvents: props.IS_FIRST_SLIDE ? "none" : "auto",
                  color: props.IS_FIRST_SLIDE ? "#777" : "#0088cb",
                  borderColor: props.IS_FIRST_SLIDE ? "#ccc" : "#0088cb",
                }}
                onClick={() => !props.IS_FIRST_SLIDE && props.handlePrev()}
              >
                {"<<"}
              </button>
            </div>
  
            <div className="page-item">
              <button
                className="page-link btn btn-outline-primary btn-sm"
                style={{ color: "#0088cb", borderColor: "#0088cb" }}
              >
                {props.currentSlideIndex + 1}
              </button>
            </div>
            <span
              style={{
                height: "100%",
                transform: "translateX(3px)",
                opacity: 0.3,
              }}
            >
              /
            </span>
            <div
              className="page-item"
              id={props.slides.length - 1}
              onClick={props.handleChangeSlideIndex}
            >
              <button
                className="page-link btn btn-outline-primary btn-sm"
                style={{
                  color: props.IS_LAST_SLIDE ? "#0088cb" : "#777",
                  borderColor: props.IS_LAST_SLIDE ? "#0088cb" : "#ccc",
                }}
              >
                {props.slides.length}
              </button>
            </div>
  
            <div>
              <button
                className="page-link btn btn-outline-primary btn-sm"
                style={{
                  opacity: props.IS_LAST_SLIDE ? 0.9 : 1,
                  pointerEvents: props.IS_LAST_SLIDE ? "none" : "auto",
                  color: props.IS_LAST_SLIDE ? "#777" : "#0088cb",
                  borderColor: props.IS_LAST_SLIDE ? "#ccc" : "#0088cb",
                }}
                onClick={() => !props.IS_LAST_SLIDE && props.handleNext()}
              >
                {">>"}
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  };

  export default Pagination;