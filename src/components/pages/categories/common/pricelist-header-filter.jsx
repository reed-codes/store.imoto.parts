import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {filterSort, changeNumItemsDisplayed, changeViewMode} from "../../../../action";
import {PricelistContext} from "../../../../store/PricelistContext";

function ToolBox() {
    const {pricelistState, pricelistDispach} = useContext(PricelistContext);
    let viewMode = pricelistState.viewOptions.viewMode;
    let numItemsDisplay = pricelistState.viewOptions.numItemsDisplay;

    function handelViewModeChange(e) {
        e.preventDefault();
        if (viewMode !== e.currentTarget.title) {
            pricelistDispach(changeViewMode(e.currentTarget.title));
        }
    }

    return (<nav className={"toolbox"}>
        <div className="toolbox-left">
            <div className="toolbox-item toolbox-sort">
                <label>Sort By:</label>

                <div className="select-custom">
                    <select 
                        name="orderby" 
                        className="form-control" 
                        defaultValue="menu_order"
                        onChange={ (e) => pricelistDispach(filterSort(e.currentTarget.value)) }>
                        <option value="menu_order">Default sorting</option>
                        <option value="alphabetic">Sort alphabetically</option>
                        <option value="rating">Sort by average rating</option>
                        <option value="price-desc">Sort by price: high to low</option>
                        <option value="price">
                            Sort by price: low to high</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="toolbox-right">
            <div className="toolbox-item toolbox-show">
                <label>Show:</label>

                <div className="select-custom">
                    <select 
                        name="count" 
                        className="form-control"
                        onChange={ (e) => pricelistDispach(changeNumItemsDisplayed(Number(e.currentTarget.value))) }
                        defaultValue={numItemsDisplay}
                        >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <div className="toolbox-item layout-modes">
                <Link to="#"
                      className={ `layout-btn btn-grid ${ viewMode === "GRID" ? "active" : "" }` }
                      title="GRID"
                      onClick={handelViewModeChange}>
                    <i className="icon-mode-grid"></i>
                </Link>
                <Link to="#"
                      className={ `layout-btn btn-grid ${ viewMode === "LIST" ? "active" : "" }` }
                      title="LIST"
                      onClick={handelViewModeChange}>
                    <i className="icon-mode-list"></i>
                </Link>
            </div>
        </div>
    </nav>);
}

export default ToolBox;
