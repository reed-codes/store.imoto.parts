import {
  SET_SELLER_CONFIGURATIONS,
  RESET_SELLER_CONFIGURATIONS,
  SET_DEFAULT_COUNTRIES,
  SET_DEFAULT_LOYALTY_PROGRAMS,
  SET_DEFAULT_COUNTRY_CODE_LIST,
  ADD_HOME_SCREEN_SLIDE,
  ADD_INFO_BOX_SLIDE,
  UPDATE_HOME_SCREEN_SLIDER,
  DELETE_HOME_SCREEN_SLIDE,
  TOGGLE_COMPONENT_DELETE_STATUS,
  VIEW_DELETED_COMPONENTS,
  HIDE_DELETED_COMPONENTS,
  UPDATE_COMPONENT_USING_COMPONENT_NAME,
  DELETE_INFO_BOX_SLIDER_BY_INDEX,
  EDIT_INFO_BOX_SLIDE_ICON_BY_INDEX,
  ADD_FEATURE_BOX,
  EDIT_FEATURE_BOX_BY_INDEX,
  DELETE_FEATURE_BOX_BY_INDEX,
  DELETE_BRAND_BY_INDEX,
  ADD_BRAND_TO_CONTAINER,
  UPDATE_BRANDS_CONTAINER,
  ADD_ITEM_TO_CATEGORIES_SLIDER,
  DELETE_CATEGORY_FROM_CATEGORIES_SLIDER_BY_INDEX,
  UPDATE_CATEGORIES_SLIDER,
  SET_OPEN_AUTHENTICATION_MODAL,
  SET_ENABLE_EDITING,
  UPDATE_APP_THEME,
  UPDATE_APP_COLOR_PALETTE,
} from "../../constants/action-types";

export const initialSellerConfigState = {
  SellerID: "",
  UIConfig: {
    viewDeleteSections: false,
    HomeScreenSlider: {
      deleted: false,
      slides: [],
    },
    InfoBoxesSlider: {
      order: 0,
      deleted: false,
      info: [],
    },
    FeatureBoxes: {
      order: 0,
      deleted: false,
      features: [],
      feature: [],
    },
    CategoriesSlider: {
      order: 7,
      deleted: false,
      title: "",
      categories: [],
    },
    BrandsCarousel: {
      order: 7,
      deleted: false,
      brands: [],
    },
    AdBannerOne: {
      img: "",
      hyperlink: "",
      deleted: false,
    },
    FeaturedProductsHeader: {
      title: "",
      deleted: false,
    },
    FeaturedProductsSlider: {
      deleted: false,
      products: [],
      title: "",
    },
    NewProductsHeader: { title: "", deleted: false },
    NewProductsSlider: {
      title: "",
      deleted: false,
      products: [],
    },
    AdBannerTwo: {
      deleted: false,
      img: "",
      hyperlink: "",
    },
    ProductsWidget: {
      deleted: false,
      columns: [
        { deleted: false, title: "", products: [], position: 0 },
        { deleted: false, title: "", products: [], position: 1 },
        { deleted: false, title: "", products: [], position: 2 },
        { title: "", products: [], position: 3 },
      ],
    },
    Footer: {
      deleted: false,
      columns: [
        {
          title: "contact info",
          itemList: [
            {
              label: "ADDRESS",
              value: "Unit 13, 3 Melrose Blvd, Melrose, Johannesburg, 2196",
            },
            { label: "PHONE", value: "123 456 7890" },
            { label: "FAX", value: "098 765 4321" },
          ],
          socialMediaOptions: [],
        },
        {
          title: "Customer service",
          itemList: [
            { label: "Help & FAQs", hyperlink: "/help-and-faqs" },
            { label: "Order Tracking", hyperlink: "/order-tracking" },
          ],
        },
        {
          title: "Popular tags",
          commaSeparateditemList:
            "bag, pants, blue, sweater, winter, shorts, cosplay, kids",
        },
        {
          title: "Subscribe newsletter",
          description:
            "Get all the latest information on events, sales and offers. Sign up for newsletter:",
        },
      ],
      copyrightText: "Porto eCommerce. 2020. All Rights Reserved",
      paymentMethods: [
        {
          id: "f8a41c43-de45-4371-9477-63137c4d6bc5",
          order: 1,
          img:
            "https://imotoconfig.s3.amazonaws.com/assets/74f7e0ce-b669-405e-ba92-3e97e5b4505d/store/c1632afc-4d0b-4889-9898-fe8479991bdd.png",
          hyperlink: "",
        },
        {
          id: "e1d573c9-fa75-4137-ae5b-f5d4f0a1f517",
          order: 2,
          img:
            "https://imotoconfig.s3.amazonaws.com/assets/74f7e0ce-b669-405e-ba92-3e97e5b4505d/store/b967060f-0979-4f0a-8cc8-ca0f0945191d.png",
          hyperlink: "",
        },
        {
          id: "73b6f0b0-3e6c-4380-92d6-6dc5d7d89b1c",
          order: 3,
          img:
            "https://imotoconfig.s3.amazonaws.com/assets/74f7e0ce-b669-405e-ba92-3e97e5b4505d/store/49f52a93-66c9-4bd9-b388-3ca27c460b3e.png",
          hyperlink: "",
        },
      ],
    },
  },
  Theme: {
    Template: 1,
    HasSideBar: false,
    ColorPalette: {},
  },
  SellerContactInfo: {
    Address: {
      Type: "Office",
      Address1: "59 Joubert Street",
      Address2: "unit 98 Ansteys Bld",
      Address3: "Johannesburg",
      Address4: "2001",
      Address5: "Gauteng",
      Coordinate: { lon: 28.089704, lat: -26.28818 },
    },
    Phone: "(123) 456-7890",
    Email: "mail@example.com",
    TradingHours: "Mon - Sun / 9:00AM - 8:00 PM",
    SocialMedia: {
      Facebook: "https://www.facebook.com",
      Twitter: "https://www.twitter.com",
      Instagram: "https://www.instagram.com",
    },
  },
  DefaultCountries: {
    ZA: {
      Name: "South Africa",
      Label: "VAT",
      Tax: 15,
      CurrencyCode: "ZAR",
      Currency: "R",
      DialingCode: "+27",
      MobileLength: 9,
      Language: "en",
      WelcomeMessage:
        "This platorm is for is only for automotive professionals who are either workshops, retailers or wholesalers.",
    },
    DE: {
      Name: "Germany",
      TaxLabel: "VAT",
      Tax: 19,
      CurrencyCode: "EUR",
      Currency: "€",
      DialingCode: "+49",
      MobileLength: 11,
      Language: "de",
      WelcomeMessage:
        "This platorm is for is only for automotive professionals who are either workshops, retailers or wholesalers.",
    },
    GA: {
      Name: "Ghana",
      TaxLabel: "VAT",
      Tax: 12.5,
      CurrencyCode: "GH",
      Currency: "GH₵",
      DialingCode: "+233",
      MobileLength: 9,
      Language: "fr",
      WelcomeMessage:
        "This platorm is for is only for automotive professionals who are either workshops, retailers or wholesalers.",
    },
    EG: {
      Name: "Egypt",
      TaxLabel: "VAT",
      Tax: 14,
      CurrencyCode: "EGP",
      Currency: "£",
      DialingCode: "+20",
      MobileLength: 11,
      Language: "ar",
      WelcomeMessage:
        "This platorm is for is only for automotive professionals who are either workshops, retailers or wholesalers.",
    },
    KE: {
      Name: "Kenya",
      TaxLabel: "VAT",
      Tax: 16,
      CurrencyCode: "KES",
      Currency: "K",
      DialingCode: "+254",
      MobileLength: 9,
      Language: "en",
      WelcomeMessage:
        "This platorm is for is only for automotive professionals who are either workshops, retailers or wholesalers.",
    },
  },
  DefaultCountryCodes: ["ZA", "DE", "GA", "EG", "KE"],
  DefaultCountryLoyaltyPrograms: [
    {
      ZA: [
        { Option: "Extra", Description: "The Bosch Extra Loyalty Program" },
        { Option: "iMoto", Description: "The test iMoto loyalty program" },
      ],
    },
    {
      DE: [{ Option: "Extra", Description: "The Bosch Extra Loyalty Program" }],
    },
    {
      GA: [{ Option: "Extra", Description: "The Bosch Extra Loyalty Program" }],
    },
    {
      EG: [{ Option: "Extra", Description: "The Bosch Extra Loyalty Program" }],
    },
    {
      KE: [{ Option: "Extra", Description: "The Bosch Extra Loyalty Program" }],
    },
  ],
  UserInfo: {
    openAuthModal: false,
    isAuthenticated: false,
    enableEditing: true,
  },
  PricelistScreenConfigs: {},
};

export const sellerConfigReducer = (
  state = initialSellerConfigState,
  action
) => {
  let copyFeatureBoxes = [];
  let copyInfoBoxes = [];
  let copyBrands = [];
  let copyCategories = [];
  switch (action.type) {
    // fetch seller configurastions from AWS-S3 and set state
    case SET_SELLER_CONFIGURATIONS:
      return {
        ...state,
        ...action.payload,
      };

    // set the context state to the default context state.
    case RESET_SELLER_CONFIGURATIONS:
      return initialSellerConfigState;

    // set the global state for default countries
    case SET_DEFAULT_COUNTRIES:
      return {
        ...state,
        DefaultCountries: action.payload,
      };

    // set the global state for default loyalty programs
    case SET_DEFAULT_LOYALTY_PROGRAMS:
      return {
        ...state,
        DefaultCountryLoyaltyPrograms: action.payload,
      };

    // set the global state for default country code list
    case SET_DEFAULT_COUNTRY_CODE_LIST:
      const countryCodes = Object.keys(action.payload);

      return {
        ...state,
        DefaultCountryCodes: countryCodes,
      };

    case ADD_HOME_SCREEN_SLIDE:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          HomeScreenSlider: {
            ...state.UIConfig.HomeScreenSlider,
            slides: [
              ...state.UIConfig.HomeScreenSlider.slides,
              action.payload,
            ].sort((a, b) => Number(a.order) - Number(b.order)),
          },
        },
      };

    case UPDATE_HOME_SCREEN_SLIDER:
      const filteredSlides = state.UIConfig.HomeScreenSlider.slides.filter(
        (slde) => slde.id !== action.payload.id
      ); //filtering out edited lide to insert updated one
      const updatedSlidesArray = [...filteredSlides, action.payload];
      const orderedSlidesArray = updatedSlidesArray.sort(
        (a, b) => Number(a.order) - Number(b.order)
      );

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          HomeScreenSlider: {
            ...state.UIConfig.HomeScreenSlider,
            slides: orderedSlidesArray,
          },
        },
      };

    case DELETE_HOME_SCREEN_SLIDE:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          HomeScreenSlider: {
            ...state.UIConfig.HomeScreenSlider,
            slides: state.UIConfig.HomeScreenSlider.slides.filter(
              (slide) => slide.id !== action.payload
            ),
          },
        },
      };

    case TOGGLE_COMPONENT_DELETE_STATUS:
      console.log(`[TOGGLE_COMPONENT_DELETE_STATUS] '${action.payload}'`);
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          [action.payload]: {
            ...state.UIConfig[action.payload],
            deleted: !state.UIConfig[action.payload].deleted,
          },
        },
      };

    case UPDATE_COMPONENT_USING_COMPONENT_NAME:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          [action.payload.component]: action.payload.data,
        },
      };

    case VIEW_DELETED_COMPONENTS:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          viewDeleteSections: true,
        },
      };

    case HIDE_DELETED_COMPONENTS:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          viewDeleteSections: false,
        },
      };

    case DELETE_INFO_BOX_SLIDER_BY_INDEX:
      copyInfoBoxes = [...state.UIConfig.InfoBoxesSlider.info];
      copyInfoBoxes.splice(action.payload, 1);

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          InfoBoxesSlider: {
            ...state.UIConfig.InfoBoxesSlider,
            info: copyInfoBoxes,
          },
        },
      };

    case EDIT_INFO_BOX_SLIDE_ICON_BY_INDEX:
      copyInfoBoxes = [...state.UIConfig.InfoBoxesSlider.info];
      copyInfoBoxes[action.payload.index].name = action.payload.name;

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          InfoBoxesSlider: {
            ...state.UIConfig.InfoBoxesSlider,
            info: copyInfoBoxes,
          },
        },
      };

    case ADD_INFO_BOX_SLIDE:
      copyInfoBoxes = [...state.UIConfig.InfoBoxesSlider.info];
      copyInfoBoxes.push(action.payload);

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          InfoBoxesSlider: {
            ...state.UIConfig.InfoBoxesSlider,
            info: copyInfoBoxes,
          },
        },
      };

    case ADD_FEATURE_BOX:
      copyFeatureBoxes = [...state.UIConfig.FeatureBoxes.features];
      copyFeatureBoxes.push(action.payload);

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          FeatureBoxes: {
            ...state.UIConfig.FeatureBoxes,
            features: copyFeatureBoxes,
          },
        },
      };

    case EDIT_FEATURE_BOX_BY_INDEX:
      copyFeatureBoxes = [...state.UIConfig.FeatureBoxes.features];
      copyFeatureBoxes[action.payload.index].name = action.payload.featureBox;

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          FeatureBoxes: {
            ...state.UIConfig.FeatureBoxes,
            feature: copyFeatureBoxes,
          },
        },
      };

    case DELETE_FEATURE_BOX_BY_INDEX:
      copyFeatureBoxes = [...state.UIConfig.FeatureBoxes.features];
      copyFeatureBoxes.splice(action.payload, 1);

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          FeatureBoxes: {
            ...state.UIConfig.FeatureBoxes,
            features: copyFeatureBoxes,
          },
        },
      };

    case DELETE_BRAND_BY_INDEX:
      copyBrands = [...state.UIConfig.BrandsCarousel.brands];
      copyBrands.splice(action.payload, 1);

      const fixBrandsOrder = copyBrands.map((brand, index) => {
        return {
          ...brand,
          order: index + 1,
        };
      });

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          BrandsCarousel: {
            ...state.UIConfig.BrandsCarousel,
            brands: [...fixBrandsOrder],
          },
        },
      };

    case ADD_BRAND_TO_CONTAINER:
      copyBrands = [...state.UIConfig.BrandsCarousel.brands];
      copyBrands.push(action.payload);

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          BrandsCarousel: {
            ...state.UIConfig.BrandsCarousel,
            brands: copyBrands,
          },
        },
      };

    case UPDATE_BRANDS_CONTAINER:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          BrandsCarousel: {
            ...state.UIConfig.BrandsCarousel,
            brands: action.payload,
          },
        },
      };

    case ADD_ITEM_TO_CATEGORIES_SLIDER:
      copyCategories = [...state.UIConfig.CategoriesSlider.categories];
      copyCategories.push(action.payload);

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          CategoriesSlider: {
            ...state.UIConfig.CategoriesSlider,
            categories: copyCategories,
          },
        },
      };

    case DELETE_CATEGORY_FROM_CATEGORIES_SLIDER_BY_INDEX:
      copyCategories = [...state.UIConfig.CategoriesSlider.categories];
      copyCategories.splice(action.payload, 1);

      const fixedCategoriesOrder = copyCategories.map((category, index) => {
        return {
          ...category,
          order: index + 1,
        };
      });

      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          CategoriesSlider: {
            ...state.UIConfig.CategoriesSlider,
            categories: fixedCategoriesOrder,
          },
        },
      };

    case UPDATE_CATEGORIES_SLIDER:
      return {
        ...state,
        UIConfig: {
          ...state.UIConfig,
          CategoriesSlider: {
            ...state.UIConfig.CategoriesSlider,
            categories: action.payload,
          },
        },
      };

    case SET_OPEN_AUTHENTICATION_MODAL:
      return {
        ...state,
        UserInfo: {
          ...state.UserInfo,
          openAuthModal: action.payload,
        },
      };

    case UPDATE_APP_THEME:
      return {
        ...state,
        Theme: {
          ...state.Theme,
          Template: action.payload.Id,
          HasSideBar: action.payload.HasSideBar,
        },
      };

    case UPDATE_APP_COLOR_PALETTE:
      return {
        ...state,
        Theme: {
          ...state.Theme,
          ColorPalette: action.payload,
        },
      };

    case SET_ENABLE_EDITING:
      return {
        ...state,
        UserInfo: {
          ...state.UserInfo,
          enableEditing: action.payload,
        },
      };

    // handle un implemented reducer action types
    default:
      throw new Error(
        `[SellerConfigReducer] does not recognize action.type: '${action.type}'`
      );
  }
};
