import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { PricelistContext } from "../../store/PricelistContext";
import { isIEBrowser, isEdgeBrowser, isSafari } from "../../utils";

function Pagination(props) {
  const { pricelistState } = useContext(PricelistContext);
  const displayCount = pricelistState.viewOptions.numItemsDisplay;
  let count = pricelistState.filteredPricelist.length;

  const toTop = () => {
    let offTop;

    if (document.querySelector(".skeleton-body"))
      offTop =
        document.querySelector(".skeleton-body").getBoundingClientRect().top +
        window.pageYOffset;

    if ((isIEBrowser() || isEdgeBrowser() || isSafari()) && offTop) {
      let pos = window.pageYOffset;
      let timer = setInterval(() => {
        if (pos <= offTop) {
          if (pos < offTop - 40 && pos <= offTop) {
            window.scrollTo({
              top: offTop - 90,
            });
            clearInterval(timer);
          } else {
            window.scrollBy(0, 40);
            pos += 40;
          }

          window.scrollTo({
            top: offTop - 90,
          });
          clearInterval(timer);
        }

        if (pos >= offTop) {
          if (pos < offTop + 40 && pos >= offTop) {
            window.scrollTo({
              top: offTop - 90,
            });
            clearInterval(timer);
          } else {
            window.scrollBy(0, -40);
            pos -= 40;
          }
        }
      }, 1);
    } else {
      window.scrollTo({
        top: offTop - 90,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (document.querySelector("ul.pagination")) {
      if (count <= displayCount) {
        document.querySelector("ul.pagination").style.visibility = "hidden";
        document.querySelector("ul.pagination").style.opacity = 0;
      } else {
        document.querySelector("ul.pagination").style.visibility = "visible";
        document.querySelector("ul.pagination").style.opacity = 1;
      }
    }
  });

  useEffect(() => {
    setTimeout(() => {
      toTop();
    }, 100);
  }, [pricelistState.viewOptions.page]);


  let cur = props.curPage;
  let pageCount = Math.ceil(count / displayCount);
  let res = getArray(count, cur, pageCount);
  if (pageCount === 0) return <div></div>;

  function pageUpdate(e, item) {
    e.preventDefault();
    setTimeout(() => {
      toTop();
    }, 100);
    props.changeCurrentPage(item);
  }

  function pageUpdatePrev(e) {
    e.preventDefault();
    setTimeout(() => {
      toTop();
    }, 100);
    if (cur - 1 > 0) {
      props.changeCurrentPage(cur - 1);
    }
  }

  function pageUpdateNext(e) {
    e.preventDefault();
    setTimeout(() => {
      toTop();
    }, 100);
    if (cur < pageCount) {
      props.changeCurrentPage(cur + 1);
    }
  }

  function getArray(cur, pageCount) {
    let pagination = [];
    let more = 1;

    if (pageCount < 6) {
      more = 0;
      for (let i = 1; i <= pageCount; i++) {
        pagination.push(i);
      }
    } else if (cur <= pageCount - 4) {
      let init = cur;
      if (cur - 1 > 0) init = cur - 1;
      for (let i = init; i < init + 5; i++) {
        pagination.push(i);
      }
    } else {
      more = 0;
      for (let i = pageCount - 5; i <= pageCount; i++) {
        pagination.push(i);
      }
    }
    return { pagination: pagination, more: more };
  }

  return (
    <nav className="toolbox toolbox-pagination">
      <ul className="pagination m-0">
        <li className={`page-item ${cur === 1 ? "disabled" : ""}`}>
          <Link
            className="page-link page-link-btn"
            to="#"
            onClick={(e) => pageUpdatePrev(e)}
          >
            <i className="icon-angle-left"></i>
          </Link>
        </li>
        {res.pagination.map((item, index) => (
          <li
            className={`page-item ${item === cur ? "active" : ""}`}
            key={"page-item" + index}
          >
            <Link
              className="page-link"
              to="#"
              onClick={(e) => pageUpdate(e, item)}
            >
              {item}
              <span className="sr-only"></span>
            </Link>
          </li>
        ))}
        {res.more === 1 ? (
          <li className="page-item">
            <span>...</span>
          </li>
        ) : (
          ""
        )}
        <li className={`page-item ${cur === pageCount ? "disabled" : ""}`}>
          <Link
            className="page-link page-link-btn"
            to="#"
            onClick={(e) => pageUpdateNext(e)}
          >
            <i className="icon-angle-right"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
