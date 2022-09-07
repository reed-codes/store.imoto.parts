import * as api from "../api";
import * as types from "../constants/action-types";
import { toast } from "react-toastify";

/**
 * Receive all Products
 * @param { Array } products
 */
export const receiveProducts = (
  products,
  categories,
  filteredPricelist,
  viewOptions
) => ({
  type: types.RECEIVE_PRODUCTS,
  products,
  categories,
  filteredPricelist,
  viewOptions,
});

/**
 * Paginate
 * @param { Number } page
 */
export const paginate = (page) => ({
  type: types.PAGINATE,
  page,
});

/**
 * Receive all brands
 * @param { Array } brands
 */
export const initBrands = (brands) => ({
  type: types.INIT_BRANDS,
  brands,
});

/**
 * Receive all tags
 * @param { Array } tags
 */
export const initTags = (tags) => ({
  type: types.INIT_TAGS,
  tags,
});

/**
 * Receive all categories
 * @param { Array } tags
 */
export const initCategories = (categories) => ({
  type: types.INIT_CATEGORIES,
  categories,
});

/**
 * Set current category
 * @param {*} category
 */
export const initCurrentCategory = (category) => ({
  type: types.INIT_CURRENT_CATEGORY,
  category,
});

export const setCurrentCategory = (category) => ({
  type: types.SET_CURRENT_CATEGORY,
  category,
});

/**
 * Refresh Store
 * @param {*} current
 */
export const refreshUnSafe = (current) => ({
  type: types.REFRESH_STORE,
  current,
});

/**
 * Dispatch Refresh Store
 * @param { Number } demo
 */
export const refreshStore = (current) => refreshUnSafe(current);


/**
 * Get a Product
 * @param { String } productId
 */
export const getProduct = (productId) => ({
  type: types.FETCH_SINGLE_PRODUCT,
  productId,
});

/**
 * Show QuickView Modal
 * @param { Object } product
 */

export const showQuickView = (product) => ({
  type: types.SHOW_QUICKVIEW,
  product,
});

/**
 * Hide QuickView Modal
 */
export const hideQuickView = () => ({ type: types.HIDE_QUICKVIEW });

/****************** Cart Action *****************/

/**
 * Add to Cart
 * @param { Object } product
 * @param { Number } qty
 */
export const addToCart = (product, qty = 1) => ({
  type: types.ADD_TO_CART,
  product,
  qty
})

export const showCartModal = (product) => ({
  type: types.SHOW_CART_MODAL,
  product
})


/**
 * Add to Cart in modal
 * @param { Object } product
 * @param { Number } qty
 */
export const quickAddToCart = (product, qty = 1) => ({
  type: types.ADD_TO_CART,
  product,
  qty
});
/**
 * Add item in Wishlist to Cart
 * @param { Object } product
 * @param { Number } qty
 */

/**
 * Remove item from Cart
 * @param { Object } product
 */
export const removeFromCart = (product) => ({
   type: types.REMOVE_FROM_CART, product 
});

/**
 * Clear Cart
 * @param { Object } product
 */
export const clearCart = ( product) => ({
  type: types.CLEAR_CART, product
});

/**
 * Increment quantity of item
 * @param { Object } product
 * @param { Number } qty
 */
export const incrementQty = (product) => ({
  type: types.INCREMENT_QTY,
  product,
  // qty: 1,
});

/**
 * Decrement quantity of item
 * @param { String } product
 */
export const decrementQty = (product) => ({
  type: types.DECREMENT_QTY,
  product,
});

/**
 * Decrement quantity of item
 * @param { String } product
 */
 export const setQty = (product , qty) => ({
  type: types.SET_QTY,
  product,
  qty
});

/********************* Wishlist Action *********************/

/**
 * Add item to Wishlist
 * @param { Object } product
 */

/**
 * Add item to Wishlist
 * @param { Object } product
 */
export const initCartWishList = (lists) => ({
   type: types.INIT_CART_WISHLIST, lists
});



/**
 * Add item to Wishlist
 * @param { Object } product
 */
export const addToWishList = (product) => ({
  type: types.ADD_TO_WISHLIST, product
});

/**
 * Remove item from Wishlist
 * @param { String } productId
 */
export const removeFromWishlist = (product) => ({
  type: types.REMOVE_FROM_WISHLIST, product
});

/**
 * Remove item from Cart and Add to Whishlist
 * @param { String } product
 */
export const moveFromCartToWishlist = (product) => ({
  type: types.MOVE_ITEM_FROM_CART_TO_WISHLIST, product 
});

/**
 * Remove item from Wishlist and Add to Cart
 * @param { String } product
 */
export const moveFromWishlistToCart = (product) => ({
 type: types.MOVE_ITEM_FROM_WISHLIST_TO_CART, product 
});

/**
 * Remove item from Wishlist and Add to Cart
 * @param { String } product
 */

export const clearWishlist = ( product) => ({
 type: types.CLEAR_WISHLIST, product 
});


/********************* Compare Action *********************/

/**
 * Add item to Compare List
 * @param { Object } product
 */
export const addToCompare = (productId) => (dispatch) => {
  dispatch({ type: types.ADD_TO_COMPARE, productId });
};

/**
 * Remove item form Compare List
 * @param { String } productId
 */
export const removeFromCompare = (productId) => (dispatch) => {
  dispatch({ type: types.REMOVE_FROM_COMPARE, productId });
};

/**
 * Clear all compare products
 *
 */
export const clearAllCompare = () => (dispatch) => {
  dispatch({ type: types.REMOVE_ALL_COMPARE });
};

export const updateNewProductsHeaderTitle = (title) => ({
  type: types.UPDATE_NEW_PRODUCTS_HEADER,
  payload: title,
});
/********************* Filter Action *********************/

/**
 * Filter by Brand
 * @param { String }  brand
 */
export const filterBrand = (brand) => ({
  type: types.FILTER_BRAND,
  brand,
});

/**
 * Filter by Tag
 * @param { String }  brand
 */
export const filterTag = (tag) => ({
  type: types.FILTER_TAGS,
  tag,
});

/**
 * Filter by Price
 * @param { Number } value
 */
export const filterPrice = (price) => ({
  type: types.FILTER_PRICE,
  price,
});

/**
 * Sort by
 * @param { String } sortBy
 */
export const filterSort = (sortBy) => ({
  type: types.SORT_BY,
  sortBy,
});

/**
 * Change view count
 * @param { Integer } count
 */
export const changeNumItemsDisplayed = (count) => ({
  type: types.CHANGE_NUM_ITEMS_DISPLAYED,
  count,
});

/**
 * Change view mode
 * @param { String } mode
 */
export const changeViewMode = (mode) => ({
  type: types.CHANGE_VIEW_MODE,
  mode,
});

/**
 * Filter by Size
 * @param { Number } value
 */
export const filterSize = (size) => ({
  type: types.FILTER_SIZE,
  size,
});

/**
 * Filter by categories
 * @param { Number } value
 */
export const filterCategories = (category) => ({
  type: types.FILTER_CATEGORIES,
  category,
});

/**
 * Clean All Filter
 *
 */
export const cleanFilter = () => ({
  type: types.FILTER_CLEAN_FILTERS,
});

/****************** SellerCOnfig Action *****************/
export const addFeatureBox = (newFeatureBox) => ({
  type: types.ADD_FEATURE_BOX,
  payload: newFeatureBox,
});

export const editFeatureBoxByIndex = (payload) => ({
  type: types.EDIT_FEATURE_BOX_BY_INDEX,
  payload: payload,
});

export const deleteFeatureBoxByIndex = (index) => ({
  type: types.DELETE_FEATURE_BOX_BY_INDEX,
  payload: index,
});

export const addInfoBoxSlide = (newInfoBox) => ({
  type: types.ADD_INFO_BOX_SLIDE,
  payload: newInfoBox,
});

export const editInfoBoxSlideIconByIndex = (payload) => ({
  type: types.EDIT_INFO_BOX_SLIDE_ICON_BY_INDEX,
  payload: payload,
});

export const deleteInfoBoxSlideByIndex = (index) => ({
  type: types.DELETE_INFO_BOX_SLIDER_BY_INDEX,
  payload: index,
});

export const deleteBrandByIndex = (index) => ({
  type: types.DELETE_BRAND_BY_INDEX,
  payload: index,
});

export const updateBrandsContainer = (brand) => ({
  type: types.UPDATE_BRANDS_CONTAINER,
  payload: brand,
});

export const addBrandToContainer = (brand) => ({
  type: types.ADD_BRAND_TO_CONTAINER,
  payload: brand,
});

export const addItemToCategoriesSlider = (item) => ({
  type: types.ADD_ITEM_TO_CATEGORIES_SLIDER,
  payload: item,
});

export const deleteItemFromCategorySliderByIndex = (index) => ({
  type: types.DELETE_CATEGORY_FROM_CATEGORIES_SLIDER_BY_INDEX,
  payload: index
});

export const updateCategoriesSlider = (category) => ({
  type: types.UPDATE_CATEGORIES_SLIDER,
  payload: category
});

export const addHomeScreenSilde = (slide) => ({
  type: types.ADD_HOME_SCREEN_SLIDE,
  payload: slide,
});

export const updateHomeScreenSlider = (slide) => ({
  type: types.UPDATE_HOME_SCREEN_SLIDER,
  payload: slide,
});

export const deleteHomeScreenSlide = (id) => ({
  type: types.DELETE_HOME_SCREEN_SLIDE,
  payload: id,
});

export const hideDeletedComponents = () => ({
  type: types.HIDE_DELETED_COMPONENTS,
});

export const showDeletedComponents = () => ({
  type: types.VIEW_DELETED_COMPONENTS,
});

export const updateComponent = (payload) => ({
  type: types.UPDATE_COMPONENT_USING_COMPONENT_NAME,
  payload: payload,
});

export const updateAppTheme = (payload) => ({
  type: types.UPDATE_APP_THEME,
  payload: payload,
});

export const updateAppColorPalette = (payload) => ({
  type: types.UPDATE_APP_COLOR_PALETTE,
  payload: payload,
});


export const toggleComponentDeletedStatus = (component) => ({
  type: types.TOGGLE_COMPONENT_DELETE_STATUS,
  payload: component,
});

export const setOpenAuthenticationModal = (open) => ({
  type: types.SET_OPEN_AUTHENTICATION_MODAL,
  payload: open,
});

export const setEnableEditing = (enable) => ({
  type: types.SET_ENABLE_EDITING,
  payload: enable
});

export const initUserSeller = (userSeller) => ({
  type: types.INIT_USER_SELLER,
  payload: userSeller
});

export const setUserSeller = (userSeller) => ({
  type: types.SET_USER_SELLER,
  payload: userSeller
});

export const setUser = (user) => ({
  type: types.SET_USER,
  payload: user
})

export const setSeller = (seller) => ({
  type: types.SET_SELLER,
  payload: seller
});

export const addUserAddress = (userAddress) => ({
  type: types.ADD_USER_ADDRESS,
  payload: userAddress
});

export const updateUserAddress = (userAddress) =>  ({
  type: types.UPDATE_USER_ADDRESS,
  payload: userAddress
});

/********************** CHECKOUT REDUCER ACTIONS ******************/
export const setDeliveryMethod = (deliveryMethod) => ({
  type: types.SET_DELIVERY_METHOD,
  payload: deliveryMethod
});

export const setDeliveryAddress = (address) => ({
  type : types.SET_DELIVERY_ADDRESS,
  payload: address
});

export const setOrder = (order) => ({
  type: types.SET_ORDER,
  payload: order
});

export const setOrderDetails = (orderDetails) => ({
  type: types.SET_ORDER_DETAILS,
  payload: orderDetails
});

/********************** NOTIFICATION REDUCER ACTIONS ******************/
export const setNotifications = (notifications) => ({
  type: types.SET_NOTIFICATIONS,
  payload: notifications
});

export const setNotificationWorker = (notificationWorker) => ({
  type: types.SET_NOTIFICATION_WORKER,
  payload: notificationWorker
});


/******************************************MOVE BELLOW TO DATABASE WORKER******************************************/
/******************************************MOVE BELLOW TO DATABASE WORKER******************************************/
/******************************************MOVE BELLOW TO DATABASE WORKER******************************************/

/**
 * TODO:
 * @param {*} dispatch     this is a call back function to be triggered
 */
export const initSellerConfigs = async (dispatch) => {
  const response = await api.getsSellerConfigurationData();

  if (response.sellerConfigurations) {
    dispatch({
      type: types.SET_SELLER_CONFIGURATIONS,
      payload: response.sellerConfigurations,
    });
  } else {
    console.error(response.error.message);
  }
};

/**
 * TODO:
 * @param {*} dispatch
 */
export const initDefaultCountries = async (dispatch) => {
  const response = await api.getDefaultCountriesFromAWSS3();

  if (response.DefaultCountries) {
    dispatch({
      type: types.SET_DEFAULT_COUNTRIES,
      payload: response.DefaultCountries,
    });
    dispatch({
      type: types.SET_DEFAULT_COUNTRY_CODE_LIST,
      payload: response.DefaultCountries,
    });
  } else {
    console.error(response.error.message);
  }
};

/**
 * TODO:
 * @param {*} dispatch
 */
export const initDefaultLoyaltyPrograms = async (dispatch) => {
  const response = await api.getDefaultLoyaltyProgramsFromAWSS3();

  if (response.DefaultCountryLoyaltyPrograms) {
    dispatch({
      type: types.SET_DEFAULT_LOYALTY_PROGRAMS,
      payload: response.DefaultCountryLoyaltyPrograms,
    });
  } else {
    console.error(response.error.message);
  }
};

/**
 * TODO:
 * @param {*} dispatch     this is a call back function to be triggered
 */
export const getUser = async (dispatch) => {
  const response = await api.getUserFromAPI();

  if (response.User) {
    dispatch({
      type: types.SET_USER,
      payload: response.User,
    });
  } else {
    console.error(response.error.message);
  }
};

/**
 * TODO:
 * @param {*} dispatch
 */
export const getUserSeller = async (dispatch) => {
  const response = await api.getUserSellerFromAPI();

  if (response.UserSeller) {
    dispatch({
      type: types.SET_USER_SELLER,
      payload: response.UserSeller,
    });
  } else {
    console.error(response.error.message);
  }
};
