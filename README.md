## Table of Contents

```toc
1. Theming Documentation
    1.1 Layout Theming
    1.2 Color Palette Manipulation


```



# 1. Theming Documentation

---

## **1.1   Layout Theming**

---

- **Purpose:** This feature allows us to dynamically render the site's layout and styling on page load - depending on which theme was chosen by the admin.
    
    
    ### **1.1.1 What is a theme**
    
    ---
    
    - Since every template looks different from every other template,  what we refer to as a ‘theme’  is the collection of styling assets that contribute to this difference in appearance between templates.
        - This includes the CSS files, fonts used, and any specifically designed components
            - **Note:** It should be said that for the most part, the templates from which we are extracting themes are almost identical.
            - They all follow the exact same pattern when it comes to routes, components as well as general functionality, etc
            - What really differentiates them are things like the following:
                - How the components are styled by that template's styles.css file
                - The fonts used
                - How the JSX of each component is structured,
                    - For example, all the templates are essentially made up of the same kinds of components - what changes is how the JSX of these components is structured in each template
                    - This difference in JSX structure is for example - the reason that even though all the templates have a `footer.jsx` file, visually all the footers look different
    - In more general terms, we use the term ‘theme’  to refer to the general look and feel of the site
    
    ### **1.1.2 Setup process**
    
    ---
    
    - **Creating themes**
        - For each template whose general look and feel we want to convert into a theme, we need to package all the assets of that template, that contribute to its appearance into a theme folder - so every theme will essentially be held within its own theme folder
        - **The assets that we are concerned with and that contribute to the appearance of a template include the following:**
            - **Static files**
                - `/public/assets/css/**styles.min.css**`
                - `/public/assets/css/**porto-new-font.css**`
                - `/public/assets/fonts/`
            - **Components**
                - `header.JSX` and all of its imported components, namely
                    - `main-menu.JSX`
                    - `search-form.JSX`
            - The example file structure for a theme looks like the following:
                
                ```markdown
                ```bash
                |--one/
                |           |--theme.jsx
                |           |--assets/
                |           |         |--css/
                |           |         |      |--style.min.css
                |           |         |      |--porto-new-font.css
                |           |         |--fonts/
                |           |                 |  ... 
                |           |
                |           |--components/
                |           |            |--main-menu.jsx
                |           |            |--search-form.jsx
                |
                |--two/
                ```
                ```
                
        - Within each theme folder, we create a `theme.jsx` component that imports the assets of that theme and returns them as one, this allows us to represent and reference each theme through its component.
        - To create the `theme.jsx` file for each theme, we make use of header.jsx
            - This is more convenient than creating a totally new component because `header.jsx` already imports `main-menu.jsx` and `search-form.jsx`
            - Therefore all we need is to also include the stylesheets imports as well - to form a single component that then represents a theme.
            - The following example represents the imports of a `header.jsx` file that follows this pattern
                
                ```markdown
                ```bash
                import MainMenu from "./components/main-menu";
                import SearchForm from "./components/search-form";
                
                import './assets/css/style.min.css'
                import './assets/css/porto-new-font.css'
                ```
                ```
                
    
    ### **1.1.2 Storing themes**
    
    ---
    
    - All themes are held under the themes directory within the components folder of the app
    - The example directory structure looks like the following
        
        ```markdown
        ```bash
        
        |--components/
        |            |--layout.jsx
        |            |--themes/
        |            |--pages/
        |            |--home/ 
        |            |--...
        
        ```
        ```
        
    
    ### **1.1.3 Using theme**
    
    ---
    
    - Within the components directory, we create another `theme.jsx` file
    - The purpose of this particular `theme.jsx` file is to serve as the single point of entry for our theme logic
    - It import all the available themes from their respective folders and then uses a switch statement to decide which theme to render - depending on what theme is recorded in the sellerConfigContext
    - This way instead of including this logic within the `layout.jsx`  all we need to do is import this `theme.jsx`  component into `layout.jsx`
    - The following code snippet shows the example logic used within `theme.jsx`
    
    ```jsx
    const ThemeOne = React.lazy(() => import("./themes/one/theme"));
    const ThemeTwo = React.lazy(() => import("./themes/two/theme"));
    const ThemeThree = React.lazy(() => import("./themes/three/theme"));
    
    const Theme = () => {
      switch (sellerconfig.Theme.Template) {
        case "1":
          return <ThemeOne />;
        case "2":
          return <ThemeTwo />;
        case "3":
          return <ThemeThree />;
        ...
        default:
          return <ThemeOne />;
      }
    };
    ```
    
    - We then import and use `theme.jsx` into `layout.jsx`
    - Depending on which theme is rendered by the switch statement - the header, and related components as well as the styles belonging to that theme will take effect on the app
    - The snippet below shows how the theme component is used within `layout.jsx`
        
        ```jsx
        import Theme from "./Theme"; //we import it here
        import Footer from "./common/footer";
        import TopNotice from "./common/top-notice";
        
        function Layout(props) {
             ...
             return(
                  <TopNotice />
        /*
        Remember that the theme component houses the header component belonging to the rendered theme, hence why we place it here at the top
        */
                    **<Theme />**  
                     {props.children}
                    <Footer />
                    ...
             )
        }
        ```
        

## **1.2   Color Palette Manipulation**

---

- **Purpose:** This feature allows us to dynamically manipulate the color palette used on the app.
- This includes the text colors, the component background colors, button colors, etc
    
    
    ### **1.2.1 Changing Website palette**
    
    ---
    
    - To control which colors appear on the site as the primary, secondary, error, info colors, etc - we use the `ColorPaletteManipulator` component.
    - This component is only visible to admins with UI editing privileges on the site
    - It essentially allows you to pick  the colors you would like to use for a specific purpose eg secondary text color or the primary color
    - It allows us to update the website's color palette via a color-picker as well as by entering a hexadecimal string representation of the new color e.g #f4f4f4
    - Whenever a color is updated using this component, the sellerconfig context is updated accordingly.
    - This state update triggers a rerender and the app refreshes with the updated color palette stored within the sellerconfig context
    
    ### **1.2.2 Using the defined color palette**
    
    ---
    
    - To allow the components to react to color changes in the color palette, we connect the colors used on the app to the color palette state
    - We use these colors defined in the palette to give our components inline styling
    - The example below shows how we connect the background color of the top-notice component to the primary color chosen for the app and stored in the color palette state
    - The below pattern is duplicated with every other component in the app that uses a color defined in the app’s color palette object
        
        ```jsx
           <div
              className="top-notice text-white"
              style={{
                background: sellerconfig.theme.colorPalette.primary,
              }}
            >
            ...
        ```
        
    - This ensures that if the user alters a color connected to the color palette in our sellerconfig state (this can be the primary color, secondary color, primary text color, etc ), all the components whose colors are connected to the palette values will rerender to use the updated colors
    
    ### 1.2.3 **Styling CSS pseudo-states**
    
    ---
    
    - P**seudo-states** in CSS allows us to style elements depending on what state they are currently in
    - For example, you are able to give a button a different background color depending on whether or not it is currently being hovered upon, clicked, etc
        - The same is true for other HTML elements
    - Since we want our components to both use and react to changes in the color palette
    - For the components/ elements that use pseudo states eg buttons, we need to connect colors used in these **pseudo-states** to the color palette as well.
        - This will allow us to have our elements use colors defined in the color palette during different states
        - For example, you can have the background color of buttons change to the secondary-color defined in the color palette whenever a user hovers over the button.
    - Since it is impossible to alter the CSS **pseudo-states** of elements directly with javascript, we enlist help of the `**styled-components**` npm package to allow us to tap into this functionality.
    - We take components whose **pseudo-state** colors we want to connect to the color palette state and then convert the component into a **styled-component**
    - The following example shows a link element that has been converted into a styled component and has had its **pseudo-states** (hover and active) connected to the color palette state
    
    ```jsx
    const Link = styled.a`
      &:hover {
        color: ${(props) => props.hoverColor} !important;
      }
      &:active {
        color: ${(props) => props.activeColor} !important;
      }
    `;
    ```
    
    - We then provide the relevant colors as props to the component when using it
    - For example
    
    ```jsx
    <Link
         href={`${process.env.PUBLIC_URL}/page/dashboard/account`}
         hoverColor={currentColorPalette.light_primary}
         activeColor={currentColorPalette.dark_primary}
         >
           My Account
    </Link>
    ```
    
    - **Note:** This method of using `**styled-components**` is only necessary for situations wherein we would like to alter the colors used by an element’s pseudo-states
        - If altering the colors used by an element's pseudo-states is not a requirement, normal inline styling should suffice