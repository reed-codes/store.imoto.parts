import {
    FETCH_SINGLE_PRODUCT,
    RECEIVE_PRODUCTS,
    SHOW_QUICKVIEW,
    HIDE_QUICKVIEW,
    REFRESH_STORE,
    FILTER_BRAND,
    FILTER_PRICE,
    FILTER_CATEGORIES,
    FILTER_CLEAN_FILTERS,
    SORT_BY,
    FILTER_TAGS,
    CHANGE_NUM_ITEMS_DISPLAYED,
    CHANGE_VIEW_MODE,
    PAGINATE,
    INIT_CURRENT_CATEGORY,
    SET_CURRENT_CATEGORY
} from "../../constants/action-types";
import {
    findIndex,
    shopFilterProducts,
    getMaxProductPrice,
    getMinProductPrice,
    getStructuredCategories,
    getAlteredStructuredCategories,
    getTree,
    getProductsFromCategories,
    getBrands,
    getTags
} from "../../utils/index";

export const initialPricelistState = {
    pricelist: [],
    single: {}, // FOR QUICK VIEW MODAL THAT OPENS FOR A SPECIFIC PRODUCT
    quickShow: false,
    fetchBegin: true, // ACTS AS FLAG TO INDICATE THAT PRODUCTS ARE BEING FETCHED FROM API
    filter: {
        tags: [],
        brands: [],
        price: {
            min: 0,
            max: 100000
        },
        otherCategories: [],
        categories: []
    },
    viewOptions: {
        sortBy: "menu_order", // OPTIONS : Default sorting, Sort by popularity, Sort by average rating, Sort by newness, Sort by price: low to high, Sort by
        numItemsDisplay: 25, // OPTIONS : 10, 25, 50,75 and 100
        page: 1,
        viewMode: "GRID", // LIST OR GRID
    },
    original: {
        tags: [],
        brands: [],
        categories: [],
        structuredCategories: [],
        price: {
            min: 0,
            max: 100000
        }
    },
    structuredGlobalCategories: [],
    currentCategory: "",
    filteredPricelist: []
};

export const pricelistReducer = (state = initialPricelistState, action) => {
    switch (action.type) {
        case RECEIVE_PRODUCTS:
            if (action.categories) {
                const structuredCategories = getStructuredCategories(action.categories);

                return {
                    ...state,
                    filter: {
                        ...state.filter,
                        structuredCategories: structuredCategories,
                        otherCategories: [],
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.products)
                        }
                    },
                    original: {
                        ...state.original,
                        categories: action.categories,
                        structuredCategories: structuredCategories,
                        brands: getBrands(action.products),
                        tags: getTags(action.products),
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.products)
                        }
                    },
                    pricelist: action.products,
                    filteredPricelist: action.products,
                    structuredGlobalCategories: structuredCategories
                };
            } else if (action.filteredPricelist) {
                return {
                    ...state,
                    pricelist: action.products,
                    filteredPricelist: action.filteredPricelist,
                    filter: {
                        ...state.filter,
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.filteredPricelist)
                        }
                    },
                    original: {
                        ...state.original,
                        brands: getBrands(action.filteredPricelist),
                        tags: getTags(action.filteredPricelist),
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.filteredPricelist)
                        }
                    }
                };
            } else if (action.viewOptions) {
                return {
                    ...state,
                    pricelist: action.products,
                    filteredPricelist: action.filteredPricelist,
                    filter: {
                        ...state.filter,
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.filteredPricelist)
                        }
                    },
                    viewOptions: action.viewOptions,
                    original: {
                        ...state.original,
                        brands: getBrands(action.filteredPricelist),
                        tags: getTags(action.filteredPricelist),
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.filteredPricelist)
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    pricelist: action.products,
                    filteredPricelist: action.products,
                    filter: {
                        ...state.filter,
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.products)
                        }
                    },
                    original: {
                        ...state.original,
                        brands: getBrands(action.products),
                        tags: getTags(action.products),
                        price: {
                            min: getMinProductPrice(action.products),
                            max: getMaxProductPrice(action.products)
                        }
                    }
                };
            }

        case INIT_CURRENT_CATEGORY:
            const [category, otherCategories] = getTree(action.category, state.structuredGlobalCategories);
            const { children: thisCategoryChildren } = category;

            const updatedFilter = {
                ...state.filter,
                structuredCategories: thisCategoryChildren ? thisCategoryChildren : [category],
                otherCategories: otherCategories,
                categories: [...new Set(
                    [category.CategoryID]
                )]
            };

            return {
                ...state,
                filter: updatedFilter,
                original: {
                    ...state.original,
                    structuredCategories: thisCategoryChildren ? thisCategoryChildren : [category]
                },
                currentCategory: category.CategoryID,
                filteredPricelist: []
            };

        case SET_CURRENT_CATEGORY:
            return{
                ...state,
                currentCategory: action.category,
            };

        case SHOW_QUICKVIEW:
            return {
                ...state,
                single: action.product,
                quickShow: true
            };

        case HIDE_QUICKVIEW:
            return {
                ...state,
                quickShow: false
            };

        case FETCH_SINGLE_PRODUCT:
            if (findIndex(state.products, action.productId)) {
                const single = state.products.reduce((_, product) => {
                    return product;
                }, []);
                return {
                    ...state,
                    single: single
                };
            }
            break;

        case HIDE_QUICKVIEW:
            return {
                ...state,
                quickShow: false
            };

        case FILTER_BRAND:
            if (state.filter.brands.indexOf(action.brand) >= 0) {
                let newFilter = {
                    ...state.filter,
                    brands: state.filter.brands.filter((item) => item !== action.brand),
                    price: {
                        min: 0,
                        max: getMaxProductPrice(state.pricelist)
                    }
                };

                const filteredPricelist = shopFilterProducts(state.pricelist, newFilter, state.viewOptions.sortBy, state.original.categories);

                let tags = [];

                filteredPricelist.forEach((product) => {
                    tags = [
                        ...tags,
                        ...product.Tags
                    ];
                });

                return {
                    ...state,
                    filter: {
                        ...newFilter,
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    original: {
                        ...state.original,
                        tags: [...new Set(tags)],
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    filteredPricelist
                };
            } else {
                let newFilter = {
                    ...state.filter,
                    brands: [
                        ...state.filter.brands,
                        action.brand
                    ]
                };

                const filteredPricelist = shopFilterProducts(state.pricelist, newFilter, state.viewOptions.sortBy, state.original.categories);

                let tags = [];

                filteredPricelist.forEach((product) => {
                    tags = [
                        ...tags,
                        ...product.Tags
                    ];
                });

                return {
                    ...state,
                    filter: {
                        ...newFilter,
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    original: {
                        ...state.original,
                        tags: [...new Set(tags)],
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    filteredPricelist
                };
            }

        case FILTER_TAGS:
            if (state.filter.tags.indexOf(action.tag) >= 0) {
                let newFilter = {
                    ...state.filter,
                    tags: state.filter.tags.filter((item) => item !== action.tag),
                    price: {
                        min: 0,
                        max: getMaxProductPrice(state.pricelist)
                    }
                };

                const filteredPricelist = shopFilterProducts(state.pricelist, newFilter, state.viewOptions.sortBy, state.original.categories);

                let brands = [];

                filteredPricelist.forEach((product) => brands.push(product.Brand));

                return {
                    ...state,
                    filter: {
                        ...newFilter,
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    original: {
                        ...state.original,
                        brands: [...new Set(brands)],
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    filteredPricelist
                };
            } else {
                let newFilter = {
                    ...state.filter,
                    tags: [
                        ...state.filter.tags,
                        action.tag
                    ]
                };

                const filteredPricelist = shopFilterProducts(state.pricelist, newFilter, state.viewOptions.sortBy, state.original.categories);

                let brands = filteredPricelist.map((product) => product.Brand);

                return {
                    ...state,
                    filter: {
                        ...newFilter,
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    original: {
                        ...state.original,
                        brands: [...new Set(brands)],
                        price: {
                            min: getMinProductPrice(filteredPricelist),
                            max: getMaxProductPrice(filteredPricelist)
                        }
                    },
                    filteredPricelist
                };
            }

        case FILTER_CATEGORIES:
            if (action.category) {
                let newCategories = [];
                let indexOfToggledCategory = state.filter.categories.indexOf(action.category);

                if (indexOfToggledCategory >= 0) {
                    newCategories = state.filter.categories.slice(0, indexOfToggledCategory);
                } else {
                    const categoryObject = state.original.categories.filter((cat) => cat.CategoryID === action.category);
                    const categorySiblingsObjects = state.original.categories.filter((cat) => {
                        return (cat.CategoryID !== categoryObject[0].CategoryID && cat.ParentID === categoryObject[0].ParentID);
                    });
                    const siblingCategoriesListStrings = categorySiblingsObjects.map((catObject) => catObject.CategoryID);

                    // REMOVING SIBLING CATEGORIES FILTERED CATEGORIES LIST
                    // THIS IS SO THAT WE HAVE A SINLE PATHWAY TO SPECIFIC PRODUCTS EG. HARDWARE > KEYBOARD > WIRED
                    // INSTEAD OF HAVING SIBLING OF KEYBOARD FILTERD OUT AS WELL
                    const filteredOutSiblings = state.filter.categories.filter((cat) => !siblingCategoriesListStrings.includes(cat));
                    const indexOfParentOfChosenCat = filteredOutSiblings.indexOf(categoryObject[0].ParentID);
                    const categoriesSplicedUntilPositionOfParent = filteredOutSiblings.slice(0, indexOfParentOfChosenCat + 1);
                    newCategories = [
                        ...new Set(
                            [
                                ...categoriesSplicedUntilPositionOfParent,
                                action.category,
                            ]
                        ),
                    ]; // USING SET TRICK TO ENSURE THERE ARE NO DUPLICATE CATEGORY STRINGS
                }

                let updatedFilter = {
                    ...state.filter,
                    categories: newCategories,
                    tags: [],
                    brands: []
                };

                let pricelistBycategory = getProductsFromCategories(state.pricelist, newCategories, state.original.categories);

                if (state.viewOptions.sortBy === "rating") {
                    pricelistBycategory.sort((a, b) => b.Ranking - a.Ranking);
                } else if (state.viewOptions.sortBy === "price") {
                    pricelistBycategory.sort((a, b) => {
                        return a.Price - b.Price;
                    });
                } else if (state.viewOptions.sortBy === "price-desc") {
                    pricelistBycategory.sort((a, b) => {
                        return b.Price - a.Price;
                    });
                }

                const tags = getTags(pricelistBycategory);
                const brands = getBrands(pricelistBycategory);
                const alteredStructuredCategories = getAlteredStructuredCategories(state.original.categories, newCategories);
                const [alteredActiveTree] = getTree(state.currentCategory, alteredStructuredCategories);
                const currentCategoryChildren = alteredActiveTree ? alteredActiveTree.children : [];

                return {
                    ...state,
                    filter: {
                        ...updatedFilter,
                        price: {
                            min: getMinProductPrice(pricelistBycategory),
                            max: getMaxProductPrice(pricelistBycategory)
                        },
                        structuredCategories: currentCategoryChildren
                    },
                    original: {
                        ...state.original,
                        tags,
                        brands,
                        price: {
                            min: getMinProductPrice(pricelistBycategory),
                            max: getMaxProductPrice(pricelistBycategory)
                        }
                    },
                    viewOptions: {
                        ...state.viewOptions,
                        page: 1
                    },
                    filteredPricelist: pricelistBycategory
                };
            }

        case FILTER_PRICE:
            let newFilter = {
                ...state.filter,
                price: {
                    min: action.price.min,
                    max: action.price.max
                }
            };
            return {
                ...state,
                filter: newFilter,
                filteredPricelist: shopFilterProducts(state.pricelist, newFilter, state.viewOptions.sortBy, state.original.categories)
            };

        case SORT_BY:
            return {
                ...state,
                viewOptions: {
                    ...state.viewOptions,
                    sortBy: action.sortBy
                }
            };

        case CHANGE_NUM_ITEMS_DISPLAYED:
            return {
                ...state,
                viewOptions: {
                    ...state.viewOptions,
                    numItemsDisplay: action.count
                }
            };

        case CHANGE_VIEW_MODE:
            return {
                ...state,
                viewOptions: {
                    ...state.viewOptions,
                    viewMode: action.mode
                }
            };

        case PAGINATE:
            return {
                ...state,
                viewOptions: {
                    ...state.viewOptions,
                    page: action.page
                }
            };

        case FILTER_CLEAN_FILTERS:
            const tags = getTags(state.pricelist);
            const brands = getBrands(state.pricelist);

            const cleanedState = {
                ...state,
                filter: {
                    tags: [],
                    brands: [],
                    categories: state.currentCategory ? [state.currentCategory] : [],
                    otherCategories: state.filter.otherCategories,
                    price: {
                        min: 0,
                        max: getMaxProductPrice(state.pricelist)
                    },
                    category: "",
                    subCategory: "",
                    structuredCategories: state.original.structuredCategories
                },
                filteredPricelist: state.pricelist,
                original: {
                    ...state.original,
                    tags,
                    brands,
                    price: {
                        min: 0,
                        max: getMaxProductPrice(state.pricelist)
                    }
                }
            };

            return cleanedState;

        case REFRESH_STORE:
            return initialPricelistState;

        default:
            return state;
    }
};