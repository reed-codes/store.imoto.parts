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
    setTimeout(() => {
      toTop();
    }, 100);
  }, [pricelistState.viewOptions.page]);

  // let cur = props.curPage;
  // let pageCount = Math.ceil(count / displayCount);
  // let res = getArray(count, cur, pageCount);
  // if (pageCount === 0) return <div></div>;

  // function pageUpdate(e, item) {
  //   e.preventDefault();
  //   setTimeout(() => {
  //     toTop();
  //   }, 100);
  //   props.changeCurrentPage(item);
  // }

  function pageUpdatePrev(e) {
    e.preventDefault();
    setTimeout(() => {
      toTop();
    }, 100);
    console.log("PREV");
    if (props.curPage - 1 > 0) {
      props.changeCurrentPage(props.curPage - 1);
    }
  }

  function pageUpdateNext(e) {
    e.preventDefault();
    setTimeout(() => {
      toTop();
    }, 100);
    console.log("NEXT");
    // if (cur < pageCount) {
      props.changeCurrentPage(props.curPage + 1);
    // }
  }

  return (
    <nav className="toolbox toolbox-pagination">
      <ul className="pagination m-0">
        {props.curPage !== 1 && (
          <li className={`page-item`}>
            <Link
              className="page-link page-link-btn"
              to="#"
              onClick={(e) => pageUpdatePrev(e)}
            >
              <i className="icon-angle-left"></i>
            </Link>
          </li>
        )}

        <li className={`page-item`} key={"page-item active"}>
          <Link
            className="page-link"
            to="#"
            onClick={(e) => e.preventDefault()}
          >
            {props.curPage}
            <span className="sr-only"></span>
          </Link>
        </li>
        <li className={`page-item`}>
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
