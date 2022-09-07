import React, { useState } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { themeCatalogue } from "./themes/catalogue/theme-catalogue";
import { useSellerConfig } from "../store/sellerConfigContext";
import { updateAppColorPalette } from "../action";
import { DeleteConfirmationDialogue } from "./home/sections/components/delete-confirmation-dialogue";
import {
  adjustColorBrightness,
  getObjectDeepCopy,
  getSellerConfigJsonBlob,
  updateSellerConfigS3File,
} from "../utils";
import { CircleSpinner } from "react-spinners-kit";

const TemplateItemWrapper = styled.button`
  padding: 0 !important;
  cursor: pointer;
  border-radius: 0 !important;
  border: ${(props) => (props.isCurrentTheme ? "3px solid #1e70ba" : "")};
  transition: all 0.2s ease-out;
  &:hover {
    filter: brightness(90%);
  }
  &:active {
    filter: brightness(80%);
  }
`;

const ColorOptionsBtn = styled.div`
  height: 100%;
  flex: 1;
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-out;
  cursor: pointer;
  text-transform: uppercase;
  padding: 1.85rem 4.2rem;
  border-radius: 0;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.429;
`;

const SubmitColorChangesBtn = styled(ColorOptionsBtn)`
  &:hover {
    background: #0378b3 !important;
  }
  &:active {
    background: #02699d !important;
  }
`;

const RestoreColorPaletteText = styled.div`
  padding-bottom: 13px;
  padding-top: 3px;
  padding-right: 2px;
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  &:hover {
    color: #0088cc;
  }
  &:active {
    color: ${(props) => props.hoverColor};
  }
`;

const ThemingWidget = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const [currentThemeSettingView, setCurrentThemeSettingView] = useState(""); //can be "", "LAYOUT" or "COLOR"
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState(sellerConfigs.Theme.ColorPalette);
  const OPEN_THEME_WIDGET = Boolean(currentThemeSettingView);
  const currentTheme = sellerConfigs.Theme.Template;
  const colorsArray = Object.entries(colors);

  const COLORS_HAVE_BEEN_MODIFIED =
    JSON.stringify(colors) !== JSON.stringify(sellerConfigs.Theme.ColorPalette);

  const handleOpenThemeWidget = (view) => {
    document.querySelector("body").style.overflow = "hidden !important";
    setCurrentThemeSettingView(view);
  };

  const handleCloseThemeWidget = () => {
    document.querySelector("body").style.overflow = "auto !important";
    setCurrentThemeSettingView("");
  };

  const handleEnableLoading = () => {
    setIsLoading(true);
  };

  const handleDisableLoading = () => {
    setIsLoading(false);
  };

  const handleResetColors = () => {
    setColors(sellerConfigs.Theme.ColorPalette);
  };

  const handleColorChange = (key, value) => {
    if (key && value) {
      const color = value[0] === "#" ? value : "#" + value;
      const newColorObject = {
        ...colors,
        [key]: color,
      };
      setColors(newColorObject);
    } else {
    }
  };

  const handlePersistColorPaletteChanges = (pal) => {
    let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);
    let palette = pal ? pal : colors;

    updatedSellerConfig = {
      ...updatedSellerConfig,
      Theme: {
        ...updatedSellerConfig.Theme,
        ColorPalette: palette,
      },
    };

    persistChangesToS3(updatedSellerConfig);
    sellerConfigDispatch(updateAppColorPalette(palette));
  };

  const handlePersistLayoutChanges = (id) => {
    if (!isLoading && currentTheme !== id) {
      handleEnableLoading();
      const newTheme = themeCatalogue[id - 1];

      let updatedSellerConfig = getObjectDeepCopy(sellerConfigs);

      updatedSellerConfig = {
        ...updatedSellerConfig,
        Theme: {
          ...updatedSellerConfig.Theme,
          Template: newTheme.Id,
          HasSideBar: newTheme.HasSideBar,
          IsContained: newTheme.IsContained,
        },
      };

      persistChangesToS3(updatedSellerConfig, true);
    }
  };

  const persistChangesToS3 = async (sellerConfig, reload) => {
    const blob = getSellerConfigJsonBlob(sellerConfig);

    const [UPDATE_SUCCESSFUL, err] = await updateSellerConfigS3File(
      blob,
      "localhost"
    );

    if (UPDATE_SUCCESSFUL) {
      // toast.success("Customization successful", {
      //   position: "bottom-right",
      //   autoClose: 5000,
      //   hideProgressBar: true,
      // });
      if (reload) {
        window.location.reload();
      }
    } else {
      handleDisableLoading();
    }
  };

  return (
    <>
      <div
        style={{
          padding: 15,
          color: "#777",
          width: 330,
          height: "100vh",
          background: "#fff",
          position: "fixed",
          zIndex: 9990,
          right: OPEN_THEME_WIDGET ? 0 : -330,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          transform: "translate(0,0)",
          transition: "all .3s ease-out",
          cursor: "default",
        }}
        className="shadow-lg"
      >
        <Header close={handleCloseThemeWidget} />

        {currentThemeSettingView === "LAYOUT" ? (
          <TemplatesContainer
            save={handlePersistLayoutChanges}
            currentTheme={currentTheme}
          />
        ) : (
          <PaletteContainer
            colors={colorsArray}
            change={handleColorChange}
            isModified={COLORS_HAVE_BEEN_MODIFIED}
            reset={handleResetColors}
            save={handlePersistColorPaletteChanges}
          />
        )}

        <LiveThemeCustomizerWidgetToggler
          open={handleOpenThemeWidget}
          view={currentThemeSettingView}
        />

        <ThemeChangeLoader loading={isLoading} />
      </div>
    </>
  );
};

const ThemeChangeLoader = (props) => {
  return (
    <div
      style={{
        height: 40,
        gap: 15,
        fontSize: 12,
        fontWeight: "bold",
        color: "#fff",
        width: "100%",
        background: "#08c",
        position: "absolute",
        zIndex: 10,
        bottom: 0,
        left: 0,
        opacity: props.loading ? 1 : 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        bottom: props.loading ? 0 : -40,
        transition: "all .3s ease-out",
        cursor: "default",
      }}
      className="shadow-lg"
    >
      Configuring New Theme <CircleSpinner color={"#fff"} size={15} />
    </div>
  );
};

const Header = (props) => {
  return (
    <div className="border-bottom pb-4">
      <h4
        style={{
          fontSize: "2rem !important",
          lineHeight: "1.35rem !important",
          marginBottom: "13px !important",
          marginTop: "0 !important",
          color: "#222529 !important",
          fontWeight: 700,
        }}
      >
        Live customizer
      </h4>
      <p className="mb-0">Customize layout and theme in Preview Real Time</p>
      <div
        title="Close (Esc)"
        style={{
          position: "absolute",
          top: 9,
          right: 4,
          color: "#08c",
          padding: "10p",
          cursor: "pointer",
          fontSize: "25px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          opacity: 0.6,
        }}
        onClick={() => props.close("")}
      >
        ×
      </div>
    </div>
  );
};

const TemplatesContainer = (props) => {
  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: props.loading ? "hidden" : "auto",
          position: "relative",
          transform: "translate(0,0)",
        }}
      >
        {themeCatalogue.map((theme) => {
          return (
            <TemplateItem
              key={uuidv4()}
              theme={theme}
              select={props.save}
              isCurrentTheme={theme.Id === props.currentTheme}
            />
          );
        })}
      </div>
      <div
        style={{
          height: 2,
          background: "#e7e7e7",
          width: "100%",
          position: "fixed",
          bottom: "1.4rem",
          right: 0,
          zIndex: 10,
          boxShadow: "rgb(0 0 0) 0px -2px 20px",
        }}
      />
    </>
  );
};

const PaletteContainer = (props) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const defaultColorPalette = {
    Primary: "#da1a32",
    Secondary: "#ed7211",
    Success: "#28a745",
    Tertiary: "#2FA969",
    Quaternary: "#FF7272",
    Quinary: "#2F3946",
    White: "#FFFFFF",
    "Gray-10": "#232529",
    "Gray-20": "#515151",
    "Gray-30": "#777777",
    "Gray-40": "#8D8D8D",
    "Gray-50": "#999999",
    "Gray-60": "#F4F4F4",
    Body: "#FFFFFF",
  };
  const handleEnableDeleteConfirmation = () => setDeleteConfirmation(true);
  const handleDisableDeleteConfirmation = () => setDeleteConfirmation(false);

  const handleRestorePalatte = () => {
    props.save(defaultColorPalette);
    handleDisableDeleteConfirmation();
  };

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          position: "relative",
          paddingTop: 5,
        }}
      >
        {props.colors.map((color) => {
          return (
            <ColorOption key={color[0]} color={color} change={props.change} />
          );
        })}
      </div>

      <div
        style={{
          height: 60,
          width: "100%",
          transition: "all 0.3s",
          marginTop: 5,
          marginBottom: 5,
          display: "flex",
          gap: 3,
          position: "relative",
          zIndex: 100,
        }}
      >
        {props.isModified && (
          <ColorOptionsBtn
            className="btn btn-outline-danger"
            onClick={props.reset}
          >
            Cancel
          </ColorOptionsBtn>
        )}

        <SubmitColorChangesBtn
          style={{
            color: "#fff",
            background: "#08c",
            pointerEvent: props.isModified ? "auto" : "none",
            opacity: props.isModified ? 1 : 0.6,
            cursor: props.isModified ? "pointer" : "not-allowed",
          }}
          onClick={() => props.save()}
        >
          Apply
        </SubmitColorChangesBtn>
      </div>

      <RestoreColorPaletteText
        hoverColor={adjustColorBrightness("#0088cc", -25)}
        onClick={handleEnableDeleteConfirmation}
      >
        Restore palette to default
      </RestoreColorPaletteText>

      <div
        style={{
          height: 2,
          background: "#e7e7e7",
          width: "100%",
          position: "fixed",
          bottom: "1.4rem",
          right: 0,
          zIndex: 10,
          boxShadow: "rgb(0 0 0) 0px -2px 20px",
        }}
      />

      {deleteConfirmation && (
        <DeleteConfirmationDialogue
          message={
            "Are you sure you want to restore the color palette to default ?"
          }
          cancel={handleDisableDeleteConfirmation}
          confirm={handleRestorePalatte}
        />
      )}
    </>
  );
};

const ColorOption = (props) => {
  const colorName = props.color[0];
  const colorValue = props.color[1];

  return (
    <div
      style={{
        height: 60,
        width: "100%",
        marginBottom: 3,
        display: "flex",
      }}
    >
      <div
        style={{
          height: "100%",
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: 5,
        }}
      >
        <input
          value={colorName}
          className="form-control"
          disabled
          style={{
            height: "100%",
            width: "100%",
            margin: 0,
          }}
        />
      </div>

      <div
        style={{
          height: "100%",
          flex: 1,
          display: "flex",
          padding: 4,
        }}
      >
        <div
          style={{
            height: "100%",
            minWidth: 50,
          }}
        >
          <input
            type="color"
            value={colorValue}
            onChange={(e) => props.change(colorName, e.target.value)}
            className="form-control"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 0,
              background: "#222",
              border: "none",
              padding: 5,
            }}
          />
        </div>

        <div
          style={{
            height: "100%",
            flex: 1,
          }}
        >
          <input
            value={colorValue}
            onChange={(e) => props.change(colorName, e.target.value)}
            className="form-control"
            style={{
              height: "100%",
              width: "100%",
              margin: 0,
              padding: "2rem 1rem",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TemplateItem = (props) => {
  return (
    <TemplateItemWrapper
      className="list-group-item mb-1"
      onClick={() => props.select(props.theme.Id)}
      isCurrentTheme={props.isCurrentTheme}
    >
      <div
        className="layout-img"
        style={{
          pointerEvents: "none",
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/theme-catalogue/${props.theme.Id}/${props.theme.Id}.webp`}
          alt=""
          className="img-fluid media"
        />
      </div>
    </TemplateItemWrapper>
  );
};

const LiveThemeCustomizerWidgetToggler = (props) => {
  return (
    <div
      style={{
        background: "#fff",
        position: "absolute",
        left: -51,
        top: "43%",
        border: "1px solid #0088ccb0",
      }}
      className="shadow-lg"
    >
      <div
        style={{
          cursor: "pointer",
          height: 50,
          minWidth: 50,
          maxWidth: 50,
          borderBottom: "1px rgba(0,0,0,.1) solid",
          background: props.view === "LAYOUT" ? "#08c" : "#fff",
          color: props.view === "LAYOUT" ? "#fff" : "#08c",
          padding: "1.5rem !important !important",
          transition: "all 0.3s",
          textTransform: "uppercase",
          borderRadius: 0,
          fontSize: "1.4rem",
          fontWeight: 700,
          fontFamily: "Poppins, sans-serif",
          lineHeight: 1.429,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tip
        data-for="layout-switcher"
        onClick={() => props.open("LAYOUT")}
      >
        <ReactTooltip
          place="left"
          id="layout-switcher"
          effect="solid"
          type="info"
        >
          Edit Layout
        </ReactTooltip>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
          className="bi bi-grid-1x2-fill"
          viewBox="0 0 16 16"
        >
          <path d="M0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm0 9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5z" />
        </svg>
      </div>

      <div
        style={{
          cursor: "pointer",
          height: 50,
          minWidth: 50,
          maxWidth: 50,
          background: props.view === "COLOR" ? "#08c" : "#fff",
          color: props.view === "COLOR" ? "#fff" : "#08c",
          padding: "1.5rem !important !important",
          transition: "all 0.3s",
          textTransform: "uppercase",
          borderRadius: 0,
          fontSize: "1.4rem",
          fontWeight: 700,
          fontFamily: "Poppins, sans-serif",
          lineHeight: 1.429,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tip
        data-for="color-picker"
        onClick={() => props.open("COLOR")}
      >
        <ReactTooltip place="left" id="color-picker" effect="solid" type="info">
          Color Picker
        </ReactTooltip>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="currentColor"
          className="bi bi-palette-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.650-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07zM8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      </div>
    </div>
  );
};

export default ThemingWidget;
