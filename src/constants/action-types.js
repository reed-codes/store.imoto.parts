// Get products
export const FETCH_SINGLE_PRODUCT = 'FETCH_SINGLE_PRODUCT';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const INIT_BRANDS = 'INIT_BRANDS';
export const INIT_TAGS = 'INIT_TAGS';
export const SHOW_QUICKVIEW = 'SHOW_QUICKVIEW';
export const HIDE_QUICKVIEW = 'HIDE_QUICKVIEW';
export const INIT_CATEGORIES = 'INIT_CATEGORIES';
export const INIT_CURRENT_CATEGORY = 'INIT_CURRENT_CATEGORY';
export const SET_CURRENT_CATEGORY = "SET_CURRENT_CATEGORY";

// Filter Products
export const FILTER_BRAND = 'FILTER_BRAND';
export const FILTER_PRICE = 'FILTER_PRICE';
export const FILTER_CATEGORIES = 'FILTER_CATEGORIES';
export const FILTER_SIZE = 'FILTER_SIZE';
export const SORT_BY = 'SORT_BY';
export const FILTER_CURRENT_CATEGORY = 'FILTER_CURRENT_CATEGORY';
export const FILTER_TAGS = 'FILTER_TAGS';
export const FILTER_CLEAN_FILTERS = 'FILTER_CLEAN_FILTERS';
export const CHANGE_NUM_ITEMS_DISPLAYED = 'CHANGE_NUM_ITEMS_DISPLAYED';
export const CHANGE_VIEW_MODE = 'CHANGE_VIEW_MODE';
export const PAGINATE = 'PAGINATE';

// Cart
export const ADD_TO_CART = 'ADD_TO_CART';
export const INIT_CART = 'INIT_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREMENT_QTY = 'INCREMENT_QTY';
export const SET_QTY = 'SET_QTY';
export const DECREMENT_QTY = 'DECREMENT_QTY';
export const CLEAR_CART = 'CLEAR_CART';
export const MOVE_ITEM_FROM_CART_TO_WISHLIST = 'MOVE_ITEM_FROM_CART_TO_WISHLIST';

// Cart Wishlist
export const INIT_CART_WISHLIST = 'INIT_CART_WISHLIST';

// WishList
export const INIT_WISHLIST = 'INIT_WISHLIST';
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
export const CLEAR_WISHLIST = 'CLEAR_WISHLIST';
export const MOVE_ITEM_FROM_WISHLIST_TO_CART = 'MOVE_ITEM_FROM_WISHLIST_TO_CART';

// Order Details action types
export const SET_ORDER = "SET_ORDER";
export const SET_ORDER_DETAILS = "SET_ORDER_DETAILS";
export const SET_DELIVERY_ADDRESS = "SET_DELIVERY_ADDRESS";
export const SET_DELIVERY_METHOD = "SET_DELIVERY_METHOD"; 

// Compare
export const ADD_TO_COMPARE = 'ADD_TO_COMPARE';
export const REMOVE_FROM_COMPARE = 'REMOVE_FROM_COMPARE';
export const REMOVE_ALL_COMPARE = 'REMOVE_ALL_COMPARE';

// CheckOut Process
export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST';
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE';

//Demo change
export const HIDE_CART_MODAL = 'HIDE_CART_MODAL';
export const SHOW_CART_MODAL = 'SHOW_CART_MODAL';

//Newsletter PopUp Modal
export const HIDE_NEWSLETTER = 'HIDE_NEWSLETTER';

//Refresh Store
export const REFRESH_STORE = 'REFRESH_STORE';

// user and userseller action types
export const SET_USER = "SET_USER";
export const SET_SELLER = "SET_SELLER";
export const SET_USER_SELLER = "SET_USER_SELLER";
export const INIT_USER_SELLER = "INIT_USER_SELLER";

export const RESET_USER = "RESET_USER";
export const RESET_SELLER = "RESET_SELLER";
export const UPDATE_USER_LOYALTY_PROGRAMS = "UPDATE_USER_OPTIONS";
export const UPDATE_USER_OPTIONS = "UPDATE_USER_OPTIONS";
export const RESET_USER_SELLER = "RESET_USER_SELLER";
export const ADD_USER_ADDRESS = "ADD_USER_ADDRESS";
export const UPDATE_USER_ADDRESS = "UPDATE_USER_ADDRESS";

// seller configuration action types:
export const SET_SELLER_CONFIGURATIONS = "SET_SELLER_CONFIGURATIONS";
export const RESET_SELLER_CONFIGURATIONS = "RESET_SELLER_CONFIGURATIONS";
export const UPDATE_HOME_SCREEN_SLIDER = "UPDATE_HOME_SCREEN_SLIDER";
export const ADD_HOME_SCREEN_SLIDE = "ADD_HOME_SCREEN_SLIDE";
export const DELETE_HOME_SCREEN_SLIDE = "DELETE_HOME_SCREEN_SLIDE";
export const VIEW_DELETED_COMPONENTS = "VIEW_DELETED_COMPONENTS";
export const HIDE_DELETED_COMPONENTS = "HIDE_DELETED_COMPONENTS";
export const TOGGLE_COMPONENT_DELETE_STATUS = "TOGGLE_COMPONENT_DELETE_STATUS";
export const UPDATE_COMPONENT_USING_COMPONENT_NAME = "UPDATE_COMPONENT_USING_COMPONENT_NAME"
export const UPDATE_APP_THEME = "UPDATE_APP_THEME"
export const UPDATE_APP_COLOR_PALETTE = "UPDATE_APP_COLOR_PALETTE"


// Action types for Home Screen Info Boxes Slider
export const ADD_INFO_BOX_SLIDE = 'ADD_INFO_BOX_SLIDE';
export const DELETE_INFO_BOX_SLIDER_BY_INDEX = "DELETE_INFO_BOX_SLIDER_BY_INDEX";
export const EDIT_INFO_BOX_SLIDE_ICON_BY_INDEX = "EDIT_INFO_BOX_SLIDE_ICON_BY_INDEX"; 
export const UPDATE_INFO_BOXES_SLIDER = "UPDATE_INFO_BOXES_SLIDER";
export const ADD_FEATURE_BOX = "ADD_FEATURE_BOX";
export const EDIT_FEATURE_BOX_BY_INDEX = "EDIT_FEATURE_BOX_BY_INDEX";
export const DELETE_FEATURE_BOX_BY_INDEX = "DELETE_FEATURE_BOX_BY_INDEX";
export const DELETE_BRAND_BY_INDEX = "DELETE_BRAND_BY_INDEX";
export const UPDATE_BRANDS_CONTAINER = "UPDATE_BRANDS_CONTAINER";
export const ADD_BRAND_TO_CONTAINER = "ADD_BRAND_TO_CONTAINER";
export const ADD_ITEM_TO_CATEGORIES_SLIDER = "ADD_ITEM_TO_CATEGORIES_SLIDER"; 
export const DELETE_CATEGORY_FROM_CATEGORIES_SLIDER_BY_INDEX = "DELETE_CATEGORY_FROM_CATEGORIES_SLIDER_BY_INDEX";
export const UPDATE_NEW_PRODUCTS_HEADER = "UPDATE_NEW_PRODUCTS_HEADER";
export const UPDATE_NEW_PRODUCTS_SLIDER_ITEM = "UPDATE_NEW_PRODUCTS_SLIDER_ITEM";
export const ADD_PRODUCT_TO_NEW_PRODUCTS_SLIDER = "ADD_PRODUCT_TO_NEW_PRODUCTS_SLIDER";
export const DELETE_SLIDE_FROM_NEW_PRODUCTS_SLIDER = "DELETE_SLIDE_FROM_NEW_PRODUCTS_SLIDER";
export const UPDATE_CATEGORIES_SLIDER = "UPDATE_CATEGORIES_SLIDER";
export const ADD_PRODUCT_TO_FEATURED_PRODUCTS_SLIDER = "ADD_PRODUCT_TO_FEATURED_PRODUCTS_SLIDER";
export const DELETE_SLIDE_FROM_FEATURED_PRODUCTS_SLIDER = "DELETE_SLIDE_FROM_FEATURED_PRODUCTS_SLIDER"
export const UPDATE_AD_BANNER_ONE = "UPDATE_AD_BANNER_ONE";
export const UPDATE_AD_BANNER_TWO = "UPDATE_AD_BANNER_TWO";
export const UPDATE_FEATURED_PRODUCTS_HEADER = "UPDATE_FEATURED_PRODUCTS_HEADER";
export const UPDATE_FEATURED_PRODUCTS_SLIDER_ITEM = "UPDATE_FEATURED_PRODUCTS_SLIDER_ITEM";

// sellers defaults action type:
export const SET_DEFAULT_COUNTRIES = "SET_DEFAULT_COUNTRIES";
export const SET_DEFAULT_LOYALTY_PROGRAMS = "SET_DEFAULT_LOYALTY_PROGRAMS";
export const SET_DEFAULT_COUNTRY_CODE_LIST = "SET_DEFAULT_COUNTRY_CODE_LIST";

export const SET_OPEN_AUTHENTICATION_MODAL = "SET_OPEN_AUTHENTICATION_MODAL";
export const SET_ENABLE_EDITING = "SET_ENABLE_EDITING";

// notificationn and database worker action types
export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const SET_NOTIFICATION_WORKER = "SET_NOTIFICATION_WORKER";
export const SET_DATABASE_WORKER = "SET_DATABASE_WORKER";