import React, { useEffect, useState, useContext } from "react";
import { setCurrentCategory } from "../../../../action";
import { PricelistContext } from "../../../../store/PricelistContext";
import { useSellerConfig } from "../../../../store/sellerConfigContext";
import styled from "styled-components";

const MainNavTab = styled.a`
text-decoration:none !important;
padding: 0.8rem 1.8rem !important;
color:${(props) => props.color} !important
`

function MainMenu(props) {
  const { pricelistState, pricelistDispach } = useContext(PricelistContext);
  const { sellerConfigs } = useSellerConfig();
  const { addClass = "", subClass = ""} = props;

  // Push the user to the categries page when clicked and set the current category on the value clicked
  const handleCategoriesClick = ({ CategoryID }) => {
    pricelistDispach(setCurrentCategory(CategoryID));
    props.history.push("/categories/full-width");
  };

  return (
    <nav className={`main-nav ${addClass}`} 
     style = {{
      border:'none'
     }}
     >
      <ul
        className={`menu sf-arrows ${subClass}`}
        id="cats-container"
        style={{
          borderTop: `1px ${sellerConfigs.Theme.ColorPalette["Gray-60"]} solid`,
        }}
      >
        <RenderLevel
          children={pricelistState.original.structuredCategories}
          handleCategoriesClick={handleCategoriesClick}
        />
      </ul>
    </nav>
  );
}

// Takes in the children [array] parameter and checks if each child has children.
// If the child has children it returns the DropdownItem component which triggers this component again until it has no child
// If it does not have children we return the name of the category
const RenderLevel = ({ children, handleCategoriesClick }) => {
  const { sellerConfigs } = useSellerConfig();
  return children.map((category, index) => {
    if (category.children && category.children.length > 0) {
      return (
        <li
          key={index}
          style={{
            background: `${sellerConfigs.Theme.ColorPalette["Body"]} !important`,
            borderColor: sellerConfigs.Theme.ColorPalette["Primary"]
          }}
          
        >
          <MainNavTab
            onClick={() => handleCategoriesClick(category)}
            className="sf-with-ul menu-level-styles"
            href="#"
            color = {sellerConfigs.Theme.ColorPalette["Gray-10"]}
          >
            {category.Name}
          </MainNavTab>
          <ul
            className="sub-menu"
            style={{
              background: sellerConfigs.Theme.ColorPalette["Body"],
            }}
          >
            <RenderLevel children={category.children} />
          </ul>
        </li>
      );
    } else {
      return (
        <li
          key={index}
          style={{
            background: sellerConfigs.Theme.ColorPalette["Body"],
            borderColor: sellerConfigs.Theme.ColorPalette["Primary"]

          }}
        >
          <MainNavTab
            onClick={() => handleCategoriesClick(category)}
            className="menu-level-styles"
            href="#"
            color = {sellerConfigs.Theme.ColorPalette["Gray-10"]}
          >
            {category.Name}
          </MainNavTab>
        </li>
      );
    }
  });
};

export default MainMenu;
