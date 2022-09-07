import React from "react";
import { useSellerConfig } from "../../store/sellerConfigContext";

const ThemeOne = React.lazy(() => import("./1/theme"));
const ThemeTwo = React.lazy(() => import("./2/theme"));
const ThemeThree = React.lazy(() => import("./3/theme"));
const ThemeFour = React.lazy(() => import("./4/theme"));
const ThemeFive = React.lazy(() => import("./5/theme"));
const ThemeSix = React.lazy(() => import("./6/theme"));

const Theme = () => {
  const { sellerConfigs } = useSellerConfig();
  switch (Number(sellerConfigs.Theme.Template)) {
    case 1:
      return <ThemeOne />;
    case 2:
      return <ThemeTwo />;
    case 3:
      return <ThemeThree />;
    case 4:
      return <ThemeFour />;
    case 5:
      return <ThemeFive />;
    case 6:
      return <ThemeSix />;
    default:
      return <ThemeOne />;
  }
};

export default Theme;
