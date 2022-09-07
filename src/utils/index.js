import { instanceCOMAPI } from "../axios/axios-instances";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { toast } from 'react-toastify';

/**
 * Is Internet Explorer?
 * @return { bool }
 */
export const isIEBrowser = function () {
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Trident") > -1)
        return true;
    return false;
}

/**
 * Is Firefox Explorer?
 * @return { bool }
 */
export const isFirefoxBrowser = function () {
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Firefox") > -1)
        return true;
    return false;
}

/**
 * Is Edge Explorer?
 * @return { bool }
 */
export const isEdgeBrowser = function () {
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Edge") > -1)
        return true;
    return false;
}

/**
 * Is Safari?
 * @return { bool }
 */
export const isSafari = function () {
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf('Safari') !== -1 && sUsrAg.indexOf('Chrome') === -1)
        return true;
    return false;
}

/**
 * handle Sticky Header
 * @param { Element } stickyHeader 
 * @param { Number } limit
 * @param { String } addClass
 */
function stickyHandler(stickyHeader, limit, addClass = "fixed") {

    if (window.pageYOffset >= limit && window.outerWidth >= 992) {
        if (!stickyHeader.parentElement.classList.contains("sticky-wrapper")) {
            let wrapper = document.createElement("div");
            wrapper.className = 'sticky-wrapper';
            if (!stickyHeader.parentElement.classList.contains("sticky-header")) {
                stickyHeader.parentElement.insertBefore(wrapper, stickyHeader);
            } else {
                stickyHeader.parentElement.parentElement.insertBefore(wrapper, stickyHeader);
            }
            wrapper.setAttribute("style", "height:" + stickyHeader.offsetHeight + "px");
            wrapper.insertAdjacentElement("beforeend", stickyHeader);
        }
        if (!stickyHeader.classList.contains(addClass)) {
            stickyHeader.parentElement.setAttribute("style", "height:" + stickyHeader.offsetHeight + "px");
            stickyHeader.classList.add(addClass);
        }
    } else {
        stickyHeader.classList.remove(addClass);
        if (stickyHeader.classList.contains(addClass)) stickyHeader.classList.remove(addClass);
        if (stickyHeader.parentElement.classList.contains("sticky-wrapper")) {
            stickyHeader.parentElement.removeAttribute("style");
        }
    }
}

let stickyOffset = -1;
let stickyTop = -1;
/**
 * initialize stickyoffset
 */
export function initStickyOffset() {
    stickyOffset = -1;
    stickyTop = -1;
}

/**
 * definePolyfills
 */
export const definePolyfills = () => {
    if (typeof Object.values != 'function') {
        Object.defineProperty(Object, "values", {
            value: function values(obj) {
                if (obj === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                let res = [];

                Object.keys(obj).map(function (key) {
                    res.push(obj[key]);
                    return 1;
                })

                return res;
            }
        });
    }

    if (window.Element && !Element.prototype.closest) {
        Element.prototype.closest =
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i,
                    el = this;

                do {
                    i = matches.length;
                    while (--i >= 0 && matches.item(i) !== el) { };
                } while ((i < 0) && (el = el.parentElement));
                return el;
            };
    }

    if (!Element.prototype.index) {
        Element.prototype.index = function (s) {
            let self = this;
            let children = self.parentElement.children;
            for (let i = 0; i < children.length; i++) {
                if (self === children[i]) return i;
            }
            return 0;
        };
    }
}

/**
 * Scroll Top
 */
export function scrollTop() {
    document.querySelector("#scroll-top").addEventListener("click", function (e) {
        if (isIEBrowser() || isEdgeBrowser() || isFirefoxBrowser() || isSafari()) {
            let pos = window.pageYOffset;
            let timer = setInterval(() => {
                if (pos <= 0)
                    clearInterval(timer);
                window.scrollBy(0, -40);
                pos -= 40;
            }, 1);
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
        e.preventDefault();
    });

    window.addEventListener("scroll", function () {
        if (document.querySelector("#scroll-top")) {
            if (window.pageYOffset > 600) {
                document.querySelector("#scroll-top").classList.add("fixed");
            } else {
                document.querySelector("#scroll-top").classList.remove("fixed");
            }
        }
    }, { passive: true });
}


/**
 * initialize layout
 */
export function init() {
    let stickyContent = document.querySelector('.main .sticky-header');
    if (stickyContent && stickyContent.classList.contains('fixed'))
        stickyContent.classList.remove('fixed');

    setTimeout(() => {

        if (document.querySelector(".sticky-header")) {
            window.addEventListener("scroll", stickyInit, { passive: true });
        }
    }, 800);
}

/**
 * sticky initialization for base
 */
export function stickyInit() {
    if (document.querySelector(".sticky-header")) {
        let stickyHeader1 = document.querySelector("header .sticky-header");
        if (stickyHeader1) {
            stickyHandler(stickyHeader1, 300);
        }

        if (document.querySelector("header.sticky-header")) {
            stickyHandler(document.querySelector("header.sticky-header"), 300);
        }

        let stickyHeader2 = document.querySelector(".main .sticky-header");
        if (stickyHeader2) {
            if (!stickyHeader2.classList.contains("fixed") && (stickyOffset === -1 || stickyOffset === 0))
                stickyOffset = stickyHeader2.getBoundingClientRect().top + window.pageYOffset + stickyHeader2.offsetHeight;
            stickyHandler(stickyHeader2, stickyOffset, "fixed");
        }
    }
}

/**
 * find item of array
 * @param { Array } items 
 * @param { Int } id 
 */
export function findIndex(items = [], id) {
    let res = false;
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            res = true;
            break;
        }
    }
    return res;
}

/**
 * find item of array
 * @param { Array } items 
 * @param { Int } id 
 */
export function findCartIndex(items = [], id) {
    let res = false;
    for (let i = 0; i < items.length; i++) {
        if (items[i].ProductID === id) {
            res = true;
            break;
        }
    }
    return res;
}


/**
 * find Product by id in array of products
 * @param { Array } products 
 * @param { String } id 
 */
export function findProductById(products, id) {
    return products.filter(item => isNaN(id) === false && item.id === parseInt(id))[0]
}

/**
 * find Blog by id in array of products
 * @param { Array } blogs 
 * @param { String } id 
 */
export function findBlogById(blogs, id) {
    return blogs.filter(item => isNaN(id) === false && item.id === parseInt(id))[0]
}

/**
 * execute isotope grid
 * @param { Function Pointer } isotope 
 * @param { Function Pointer } imagesLoaded 
 */
export function isotopeLoad(isotope, imagesLoaded) {
    let grids = document.querySelectorAll(".grid");
    for (let i = 0; i < grids.length; i++) {
        let grid = grids[i];

        let iso = new isotope(grid, {
            itemSelector: '.grid-item',
            layoutMode: 'masonry',
            percentPosition: true,
            getSortData: {
                'md-order': '[data-md-order] parseInt'
            },
            sortReorder: true,
            masonry: {
                columnWidth: '.grid-sizer',
            }
        });

        let imgLoad = imagesLoaded(grid, { background: true });
        imgLoad.on('done', function (instance, image) {
            if (window.innerWidth < 768 && window.innerWidth > 400) {
                iso.arrange({ sortBy: 'md-order' });
            }

            iso.layout();
        });

        if (grids[i].parentElement.classList.contains("featured-section")) {
            let links = document.querySelectorAll(".filter-button-group .nav-link");
            function isotopeImage(e) {
                e.preventDefault();
                let filterValue = e.currentTarget.getAttribute("data-filter");
                iso.arrange({
                    filter: filterValue
                });
                e.currentTarget.parentElement.parentElement.querySelector(".active").classList.remove("active");
                e.currentTarget.classList.add('active');
                // setTimeout( () => {
                //     appearAnimate();
                // }, 400 );
            }
            for (let j = 0; j < links.length; j++) {
                links[j].addEventListener("click", isotopeImage);
            }
        }
        function isoArrange() {
            iso.arrange({
                sortBy: (window.innerWidth < 768 && window.innerWidth > 400) ? 'md-order'
                    : 'original-order'
            });
        }
        window.addEventListener('resize', isoArrange);
    }
}

/**
* Remove all XSS attacks potential
* @param { String } html 
* @return { Object } 
*/
export const removeXSSAttacks = (html) => {
    const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    // Removing the <script> tags
    while (SCRIPT_REGEX.test(html)) {
        html = html.replace(SCRIPT_REGEX, "");
    }

    // Removing all events from tags...
    html = html.replace(/ on\w+="[^"]*"/g, "");

    return {
        __html: html
    }
}

/**
 * Filter Product
 * @param { Array } products 
 * @param { String } type 
 * @param { String } demo 
 * @param { Int } format 
 */
export function productFilter(products, type = "arrivals") {
    switch (type) {
        case "arrivals":
            return products.filter(product => (
                product.new === true
            ));

        case "sale":
            return products.filter(product => (
                product.sale === true
            ));

        case "featured":
            return products.filter(product => (
                product.featured === true
            ));

        case "top":
            return products.filter(product => (
                product.top > 5
            )).sort(function (a, b) {
                return b.top - a.top;
            });

        case "latest":
            return products.filter(product => (
                product.date
            )).sort(function (a, b) {
                return Date.parse(b.date) - Date.parse(a.date);
            });

        case "rated":
            return products.filter(product => (
                product.Ranking
            )).sort(function (a, b) {
                return b.rating - a.rating;
            });

        case "all":
            return products;

        default:
            return products;
    }
}

/**
 * Filter by category
 * @param { Array } products 
 * @param { String } category 
 * @param { Int } format 
 */
export function categoryFilter(products, category = "all") {
    return products.filter(product => (
        (category === "all") ?
            true
            : product.category.indexOf(category) !== -1
    ))
}

/**
 * Get the variant product price min-max price
 * @param { Array } variants 
 * @param { String } set 
 */
export function getPrice(variants, set = 'max') {
    let xVal = [];
    variants.map((variant) => {
        let max = variant.type.reduce((a, b) => {
            let price1 = a.salePrice ? a.salePrice : a.Price;
            let price2 = b.salePrice ? b.salePrice : b.Price;
            if (set === 'max') {
                return price1 > price2 ? a : b;
            } else {
                return price1 < price2 ? a : b;
            }
        });
        xVal.push(max.salePrice ? max.salePrice : max.Price);
        return 1;
    });
    if (set === 'max') {
        return xVal.reduce((a, b) => Math.max(a, b));
    } else {
        return xVal.reduce((a, b) => Math.min(a, b));
    }
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

/**
 * In the Shop Page, function that uses the to filter the products
 * @param { Array } products 
 * @param { Array } filter 
 * @param { String } current demo-1, demo-2, etc
 */
export function shopFilterProducts(products, filter, sortBy, allCategories) {
    const pricelistFilteredByCategory = getProductsFromCategories(products, filter.categories, allCategories)
    let filterProduct = pricelistFilteredByCategory.filter(product => {
        let brandFlag = 0;
        if (filter.brands.length > 0) {
            brandFlag = filter.brands.indexOf(product.Brand) > -1 ? 1 : 0;
        } else brandFlag = 1;

        let tagFlag = 0;
        if (filter.tags.length > 0) {
            for (let tag of product.Tags) {
                if (filter.tags.indexOf(tag) > -1) {
                    tagFlag = 1;
                    break
                }
            }
        } else tagFlag = 1;

        return (((product.Price >= filter.price.min) && (product.Price <= filter.price.max)) && brandFlag && tagFlag)
    })
    
    if(sortBy === "menu_order"){
        filterProduct = shuffle(filterProduct)
    }
    else if (sortBy === "rating") {
        filterProduct.sort((a, b) => b.Ranking - a.Ranking);
    } else if (sortBy === "price") {
        filterProduct.sort((a, b) => a.Price - b.Price);
    } else if (sortBy === "price-desc") {
        filterProduct.sort((a, b) => b.Price - a.Price);
    }else if(sortBy === "alphabetic"){
        filterProduct.sort((a, b) => {
            return (a.Description).charCodeAt(0) - (b.Description).charCodeAt(0);
        });
    }

    return filterProduct;
}

export const removeProductDuplicates = (arr) => {
    let new_arr = arr.filter((product, index, self) =>
        index === self.findIndex((item) => (
            item.ProductID === product.ProductID
        ))
    )
    return new_arr
}

export const getMaxProductPrice = (arr) => {
    if (!arr.length) {
        return 11000
    } else {
        let newArr = new Array(...arr);
        let sortedArr = newArr.sort((a, b) => a.Price - b.Price);
        return sortedArr[sortedArr.length - 1].Price;
    }
};

export const getMinProductPrice = (arr) => {
    if (!arr.length) {
        return 0
    } else {
        let newArr = new Array(...arr);
        let sortedArr = newArr.sort((a, b) => a.Price - b.Price);
        return sortedArr[0].Price;
    }
};


/* outerHeight */
function outerHeight(self) {
    return parseInt(window.getComputedStyle(self).getPropertyValue("margin-bottom")) + parseInt(window.getComputedStyle(self).getPropertyValue("margin-top")) + parseInt(self.offsetHeight);
}

/* width */
function width(self) {
    return parseInt(self.clientWidth) - parseInt(window.getComputedStyle(self).getPropertyValue("padding-left")) - parseInt(window.getComputedStyle(self).getPropertyValue("padding-right"));
}

/**
 * 
 * @param { node } self 
 */
function maxChildHeight(self) {
    let children = self.children;
    let maxHeight = -1;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let height = 0;
        for (let j = 0; j < child.children.length; j++) {
            height += outerHeight(child.children[j]);
        }
        if (maxHeight < height)
            maxHeight = height;
    }
    return maxHeight;
}

/**
 * get the raw offsetTop
 * @param { Node  } stickySidebar 
 */
function getRowTop(stickySidebar) {
    let position = stickySidebar.style.position;
    let top = stickySidebar.style.top;
    let bottom = stickySidebar.style.bottom;
    let width = stickySidebar.style.width;
    stickySidebar.style.position = '';
    stickySidebar.style.top = '';
    stickySidebar.style.bottom = '';
    stickySidebar.style.width = '';
    stickyTop = stickySidebar.getBoundingClientRect().top + window.pageYOffset;
    stickySidebar.style.position = position;
    stickySidebar.style.top = top;
    stickySidebar.style.bottom = bottom;
    stickySidebar.style.width = width;
    return stickyTop;
}

/**
 * utils to handle sticky content
 */
export const setStickyValues = function (height = 82) {
    if (isIEBrowser()) {
        let stickyContent = document.querySelector('.sticky-sidebar');
        if (!stickyContent) return;
        stickyContent.style.position = "relative";
        stickyContent.style.top = '0';
    }
}

/**
 * sticky Box 
 */
export const stickyContentHandle = () => {
    if (isIEBrowser()) {
        let stickySidebars = document.querySelectorAll('.sticky-sidebar');
        for (let i = 0; i < stickySidebars.length; i++) {
            let stickySidebar = stickySidebars[i];
            let scrollTop = window.pageYOffset;
            let originWidth = width(stickySidebar.parentElement);
            let offsetTop = 90;
            if (window.outerWidth >= 992) {
                stickyTop = getRowTop(stickySidebar);
                let parentBottom = outerHeight(stickySidebar.parentElement.parentElement) + stickyTop;
                if (scrollTop + 10 < stickyTop || outerHeight(stickySidebar) >= maxChildHeight(stickySidebar.parentElement.parentElement)) {
                    stickySidebar.style.position = '';
                    stickySidebar.style.top = '';
                    stickySidebar.style.bottom = '';
                    stickySidebar.style.width = '';
                    continue;
                } else if (scrollTop > stickyTop && scrollTop + window.innerHeight < parentBottom - 20 && scrollTop + window.innerHeight > stickySidebar.clientHeight + stickyTop) {
                    stickySidebar.style.position = 'fixed';
                    if (maxChildHeight(stickySidebar.parentElement.parentElement) > stickySidebar.offsetHeight + 20 && window.innerHeight > stickySidebar.offsetHeight) {
                        stickySidebar.style.bottom = '';
                        stickySidebar.style.top = offsetTop + 'px';
                    }
                    else {
                        stickySidebar.style.bottom = '10px';
                        stickySidebar.style.top = '';
                    }

                    stickySidebar.style.width = originWidth + 'px';
                    continue;
                } else if (scrollTop + window.innerHeight > parentBottom) {
                    if (window.innerHeight > stickySidebar.offsetHeight && maxChildHeight(stickySidebar.parentElement.parentElement) > stickySidebar.offsetHeight + 20 && scrollTop + offsetTop + outerHeight(stickySidebar) < parentBottom - 20) {
                        stickySidebar.style.position = 'fixed';
                        stickySidebar.style.bottom = '';
                        stickySidebar.style.top = offsetTop + 'px';
                    }
                    else {
                        let top = stickySidebar.parentElement.parentElement.offsetHeight - outerHeight(stickySidebar);
                        stickySidebar.style.position = 'absolute';
                        stickySidebar.style.top = top + 'px';
                        stickySidebar.style.bottom = '';
                    }
                    stickySidebar.style.width = originWidth + 'px';
                    continue;
                } else if (scrollTop < stickySidebar.offsetTop + stickyTop + 30) {
                    if (stickySidebar.style.position === "absolute") {
                        stickySidebar.style.top = stickyTop + 'px';
                        stickySidebar.style.bottom = '';
                        stickySidebar.style.width = originWidth + 'px';
                    }
                    continue;
                }
            } else {
                stickySidebar.style.position = '';
                stickySidebar.style.top = '';
                stickySidebar.style.bottom = '';
                stickySidebar.style.width = '';
            }
        }
        let stickySliders = document.querySelectorAll('.sticky-slider');
        for (let i = 0; i < stickySliders.length; i++) {
            let stickySlider = stickySliders[i];
            let scrollTop = window.pageYOffset;
            let originWidth = width(stickySlider.parentElement);
            let offsetTop = 90;
            if (window.outerWidth >= 992) {
                stickyTop = getRowTop(stickySlider);
                let parentBottom = outerHeight(stickySlider.parentElement.parentElement) + stickyTop;
                if (scrollTop + 10 < stickyTop || outerHeight(stickySlider) >= maxChildHeight(stickySlider.parentElement.parentElement)) {
                    stickySlider.style.position = '';
                    stickySlider.style.top = '';
                    stickySlider.style.bottom = '';
                    stickySlider.style.width = '';
                    continue;
                } else if (scrollTop > stickyTop && scrollTop + window.innerHeight < parentBottom - 20 && scrollTop + window.innerHeight > stickySlider.clientHeight + stickyTop) {
                    stickySlider.style.position = 'fixed';
                    if (maxChildHeight(stickySlider.parentElement.parentElement) > stickySlider.offsetHeight + 20 && window.innerHeight > stickySlider.offsetHeight) {
                        stickySlider.style.bottom = '';
                        stickySlider.style.top = offsetTop + 'px';
                    }
                    else {
                        stickySlider.style.bottom = '10px';
                        stickySlider.style.top = '';
                    }

                    stickySlider.style.width = originWidth + 'px';
                    continue;
                } else if (scrollTop + window.innerHeight > parentBottom) {
                    if (window.innerHeight > stickySlider.offsetHeight && maxChildHeight(stickySlider.parentElement.parentElement) > stickySlider.offsetHeight + 20 && scrollTop + offsetTop + outerHeight(stickySlider) < parentBottom - 20) {
                        stickySlider.style.position = 'fixed';
                        stickySlider.style.bottom = '';
                        stickySlider.style.top = offsetTop + 'px';
                    }
                    else {
                        let top = stickySlider.parentElement.parentElement.offsetHeight - outerHeight(stickySlider);
                        stickySlider.style.position = 'absolute';
                        stickySlider.style.top = top + 'px';
                        stickySlider.style.bottom = '';
                    }
                    stickySlider.style.width = originWidth + 'px';
                    continue;
                } else if (scrollTop < stickySlider.offsetTop + stickyTop + 30) {
                    if (stickySlider.style.position === "absolute") {
                        stickySlider.style.top = stickyTop + 'px';
                        stickySlider.style.bottom = '';
                        stickySlider.style.width = originWidth + 'px';
                    }
                    continue;
                }
            } else {
                stickySlider.style.position = '';
                stickySlider.style.top = '';
                stickySlider.style.bottom = '';
                stickySlider.style.width = '';
            }
        }
    }
}

/**
 * Util for making parallax background
 */
export function setParallax() {
    let parallax = document.querySelector(".parallax");
    if (parallax) {
        let y = (parallax.offsetTop - window.pageYOffset) / 20 + 40;
        parallax.style.backgroundPositionY = `${y}%`;
    }
}

/**
 * count up
 */
export let elementCount = function () {
    let counterSections = document.querySelectorAll(".counters-section");
    for (let j = 0; j < counterSections.length; j++) {
        let counterSection = counterSections[j];

        if (window.innerHeight >= counterSection.querySelector(".count").getBoundingClientRect().top) {
            let myTimer = setInterval(function () {
                let counts = counterSection.querySelectorAll(".count-wrapper .count");

                for (let i = 0; i < counts.length; i++) {
                    let element = counts[i];
                    if (!element.closest(".appear-animation") || (element.closest(".appear-animation.appear-animation-visible"))) {

                        let from = parseInt(element.getAttribute("data-from"));
                        let to = parseInt(element.getAttribute("data-to"));
                        let cur = parseFloat(element.getAttribute("data-value"));
                        cur = cur + parseFloat(((to - from) / 30));
                        if (cur >= to) {
                            cur = to;
                            window.clearInterval(myTimer);
                        }
                        element.setAttribute("data-value", cur);

                        if (element.getAttribute("data-append"))
                            element.innerText = cur.toFixed(0) + element.getAttribute("data-append");
                        else element.innerText = cur.toFixed(0)
                    }
                }
            }, 100);

            if (j === counterSections.length - 1)
                window.removeEventListener("scroll", elementCount);
        }
    }
}

/**
 * utils to set countto in about-2
 */
export const countTo = function () {
    let items = document.querySelectorAll('.count-to');

    if (items) {
        for (let i = 0; i < items.length; i++) {

            let item = items[i];
            let amount = parseInt(item.getAttribute('data-to'), 10) - parseInt(item.getAttribute('data-from'), 10);
            let time = parseInt(item.getAttribute('data-speed'), 10);
            let interval = parseInt(item.getAttribute('data-refresh-interval'), 10);
            let pt = 0;
            let height = item.parentElement.parentElement.parentElement.offsetTop;
            let flag = 0;

            document.addEventListener("scroll", countToScrollHandler, { passive: true });

            function countToScrollHandler() {
                if (pt <= time && height >= window.pageYOffset) {
                    if (0 === flag) {
                        let timerId = setInterval(() => {
                            if (pt >= time) {
                                clearInterval(timerId);
                            }

                            item.innerHTML = parseInt((pt * amount) / time);
                            pt = pt + interval;
                        }, interval);
                    }

                    flag = 1;
                }
            }
        }
    }
}

/**
 * Active Each Nav 
 * @param { Event } 
 */
export function activeListNav(e) {
    for (let i = 7; i >= 0; i--) {
        if (!document.querySelector("#cat-" + i)) continue;
        if (document.querySelector("#cat-" + i + " .category-title").getBoundingClientRect().top < 50 && (document.querySelector("cat-" + (i + 1) + " .category-title") ? document.querySelector("cat-" + (i + 1) + " .category-title").getBoundingClientRect().top > 0 : true)) {
            if (document.querySelector(".category-list-nav .nav-link.active")) {
                document.querySelector(".category-list-nav .nav-link.active").classList.remove("active");
            }
            document.querySelector('[data-target="cat-' + i + '"]').classList.add("active");
            break;
        }
    }
}

/**
 * get total Price of products in cart.
 * @param {Array} cartItems 
 */
export const getCartTotal = items => {
    let total = 0;
    if (items) {
        for (let i = 0; i < items.length; i++) {
            total = total + (parseInt(items[i].ProductInfo.Price, 10) * Number(items[i].Quantity) );
        }
    }
    return total;
}

/**
 * get number of products in cart
 * @param {Array} cartItems 
 * @return {Integer} total
 */
export const getQtyTotal = items => {
    let total = 0;
    if (items) {
        for (let i = 0; i < items.length; i++) {
            total += parseInt(items[i].Quantity, 10);
        }
    }
    return total;
}


/**
 * filters products array by tags
 * @param {Array} tags 
 * @param {Array} pricelist 
 */
export const filterBytags = (tags, pricelist) => (
    pricelist.filter(product => {
        for (let i = 0; i < product.tags.length; i++) return (tags.indexOf(product.tags[i]) >= 0)
    })
)

/**
 * Get all Products and categories
 */
export const getPricelist = async (SellerID, searchString = "1", page = 0, count = 25) => {
    try {
        const ax = await instanceCOMAPI();
        const pricelistResponse = await ax.get(`/pricelist/search/${SellerID}/${1}/${searchString}/${page}/${count}`)
        const categoriesResponse = await ax.get(`/allcategories`)
        const sellerPricelist = pricelistResponse.data;
        const sellerCategories = categoriesResponse.data.filter((category => category.SellerID === SellerID))
        return [sellerPricelist, sellerCategories]

    } catch (err) {
        console.error(err.message)
        return []
    }
}

/**
 * Get Products by category and by count
 */
export const getPricelistByCategory = async (SellerID, cat, page = 0, count = 1) => {
    try {
        const ax = await instanceCOMAPI();
        const pricelistResponse = await ax.get(`/pricelist/search/${SellerID}/${process.env.REACT_APP_PRICELIST}/${cat}/${(page - 1)}/${count}`)
        const sellerPricelist = pricelistResponse.data;

        if (sellerPricelist) return sellerPricelist
        else throw { message: "pricelist returned as null : " + String(sellerPricelist) }
    } catch (err) {
        console.error(err.message)
        return []
    }
}

/**
 * Extract brands from Products array
 */
export const getBrands = (products) => Array.isArray(products) ? [...(new Set(products.map(product => product.Brand)))] : [];

/**
 * Extract tags from Products array
 */
export const getTags = (products) => {

    if (Array.isArray(products)) {
        let tagsList = []
        products.map(product => {
            if (product.Tags) tagsList = [...tagsList, ...product.Tags]
        })
        return [...(new Set(tagsList))]
    } else {
        return []
    }
};


// filters pricelist by category 
export const getProductsFromCategories = (pricelist, filteredCategories) => {
    if (!Array.isArray(pricelist) || !Array.isArray(filteredCategories)) {
        console.log(
            "improper data : pricelist and | or filteredCategories ",
            pricelist,
            filteredCategories
        );
        return [];
    }

    if (!pricelist.length) return [];

    const currentCategory = filteredCategories[filteredCategories.length - 1];
    // SEARCH FOR PRODUCTS DIRECTLY UNDER THE CATEGORY
    return pricelist.filter((product) => {
        return (product.CategoryID === currentCategory) || (product.ParentCategories.includes(currentCategory))
    });
};


/**
 * Format categories and subcategories into hierarchy
 */
export const getStructuredCategories = (arr) => {
    const level_4 = arr.filter(cat => cat.Parents.length === 4);
    const level_3 = arr.filter(cat => cat.Parents.length === 3);
    const level_2 = arr.filter(cat => cat.Parents.length === 2);
    const level_1 = arr.filter(cat => cat.Parents.length === 1);

    const levelThreeWithSubcategories = level_3.map((category) => {
        const children = level_4.filter(subcategory => category.CategoryID === subcategory.ParentID)
        return {
            ...category,
            children,
            isExpanded: false
        }
    })

    const levelTwoWithSubcategories = level_2.map(category => {
        const children = levelThreeWithSubcategories.filter(subcategory => category.CategoryID === subcategory.ParentID)
        return {
            ...category,
            children,
            isExpanded: false
        }
    })

    const levelOneWithSubcategories = level_1.map(category => {
        const children = levelTwoWithSubcategories.filter(subcategory => category.CategoryID === subcategory.ParentID)
        return {
            ...category,
            children,
            isExpanded: false
        }
    })


    return levelOneWithSubcategories
}



const drill = (cat, item, arr) => {

    if (Array.isArray(cat.children)) {
        /*
          BASE CASE 1 : CATEGORY FOUND
          ==========
          when it has drilled down to category with no children
          it will hop out of current function execution and allow the below loop to pregress to next iteration 
        */
        if ((cat.CategoryID.trim()).toUpperCase() === (item.trim()).toUpperCase()) {
            const siblings = arr.filter(sib => (sib.CategoryID.trim()).toUpperCase() !== (cat.CategoryID.trim()).toUpperCase())
            return [cat, siblings]
        }

        /*
          BASE CASE 2 : NO MORE CHILDREN TO DRILL
          ==========
          when it has drilled down to category with no children
          it will hop out of current function execution and allow the below loop to pregress to next iteration 
        */
        else if (cat.children.length === 0) return

        else {
            for (let k = 0; k < cat.children.length; k++) {
                const res = drill(cat.children[k], item, cat.children)

                if (res) {
                    return res
                }

            }
        }


    }

}


/*
 finds specific category object containing nested children categories
 first element of returned array :returns thie requested category object and its nested children as an array
 second parameter of returned array : sibling categories at that level
*/

export const getTree = (item, categories) => {
    if (item && Array.isArray(categories)) {

        //checking if the requested category is at first level of cat array
        const filteredCat = categories.filter(cat => item.trim().toUpperCase() === cat.CategoryID.trim().toUpperCase())
        const requestedCategoryTree = filteredCat[0]
        //length will be greater than zero if its found
        if (filteredCat.length) {
            const siblingCats = categories.filter(cat => item.trim().toUpperCase() !== cat.CategoryID.trim().toUpperCase())
            return [requestedCategoryTree, siblingCats]
        } else {
            for (let i = 0; i < categories.length; i++) {
                const res = drill(categories[i], item);
                if (res) {
                    return res
                }
            }
        }


    } else {
        return []
    }

}

// RETURNS A VERSION OF STRUCTED CATEGORIES WHERE THE OBJECTS OFTHE FILTERED CATEGORIES ARE EXPANED BY DEFAULT
export const getAlteredStructuredCategories = (allCategories, filteredCategories) => {
    const level_4 = allCategories.filter(cat => cat.Parents.length === 4);
    const level_3 = allCategories.filter(cat => cat.Parents.length === 3);
    const level_2 = allCategories.filter(cat => cat.Parents.length === 2);
    const level_1 = allCategories.filter(cat => cat.Parents.length === 1);

    const levelThreeWithSubcategories = level_3.map((category) => {
        const children = level_4.filter(subcategory => (category.CategoryID).toUpperCase() === (subcategory.ParentID).toUpperCase())
        const IS_A_FILTERED_CATEGORY = filteredCategories.includes(category.CategoryID)

        return {
            ...category,
            children,
            isExpanded: IS_A_FILTERED_CATEGORY,
        }
    })

    const levelTwoWithSubcategories = level_2.map(category => {
        const children = levelThreeWithSubcategories.filter(subcategory => (category.CategoryID).toUpperCase() === (subcategory.ParentID).toUpperCase())
        const IS_A_FILTERED_CATEGORY = filteredCategories.includes(category.CategoryID)

        return {
            ...category,
            children,
            isExpanded: IS_A_FILTERED_CATEGORY,
        }
    })

    const levelOneWithSubcategories = level_1.map(category => {
        const children = levelTwoWithSubcategories.filter(subcategory => (category.CategoryID).toUpperCase() === (subcategory.ParentID).toUpperCase())
        const IS_A_FILTERED_CATEGORY = filteredCategories.includes(category.CategoryID)

        return {
            ...category,
            children,
            isExpanded: IS_A_FILTERED_CATEGORY,
        }
    })

    return levelOneWithSubcategories
}


/**
   * Handles the uploading of the given file to the presigned URL destination
   * @param {string} uploadURL
   * @param {object} file
   * @param {string} fileType
   */
const handleFileUploadUsingPresignedURL = async (uploadURL, file, fileType, updateProgress) => {
const _ = await axios.put(uploadURL, file, {
    headers: {
    'Content-Type': fileType
    },
    onUploadProgress: progressEvent => {
    const val = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0);
    const percentage = val + "%";
            if(updateProgress){
            updateProgress(Number(val))
            }
            console.log("percentage", percentage)
    }
})
    return true
};


/**
 * Handles fetching of the presigned (authorizes) link/url required to upload the file
 * We will use the uploadURL returned to send up the file
 * OUTPUT : The location where the image has been uploaded
 * @param {object} file
 * @param {string} sellerID
 * @param {function} updateProgress - optional : callback function connected to state that we can give progress change updates as a percentage number
 */
export const handleImageUpload = async (file, sellerID, updateProgress) => {
    const IS_JPEG = file.type.split("/").includes("jpg") || file.type.split("/").includes("jpeg")
    const IS_PNG = file.type.split("/").includes("png")
    const IS_WEBP = file.type.split("/").includes("webp")  
    
    let fileType =  "";  
    let fileName = uuidv4()

    if(IS_JPEG) fileType = "jpg"
    else if(IS_PNG) fileType = "png"
    else if(IS_WEBP) fileType = "webp"

    try{
    const ax = await instanceCOMAPI();
    //Gets presigned URL for image upload
    const {data} = await ax.get(`/seller/upload/storeassets/${sellerID}/${fileName}.${fileType}`)
    const {UploadURL:uploadURL} = data;
    const _ = await handleFileUploadUsingPresignedURL(uploadURL, file, fileType, updateProgress);

    const fileURL = uploadURL.split("?")[0];
    return [fileURL, null]
    }catch(err){
            console.log(err.message)
            toast.error(err.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            });
    return [null, err]
    }

};
  

export const getSellerConfigJsonBlob = (sellerConfigJSON) => {
    const json = JSON.stringify(sellerConfigJSON);
    return new Blob([json], { type:'application/json' });
}


/**
 * Gets presigned URL based on store name
 * Uploads a seller's seller-config JSON file to S3 location
 * @param {object} file
 * @param {string} store
 */
export const updateSellerConfigS3File = async (file, store="localhost") => {
    try {
        const ax = await instanceCOMAPI();
        // Gets presigned URL for seller config file upload
        const {data} = await ax.get(`/storeconfig/${"localhost"}`)
        const {UploadURL:uploadURL} = data;
        const res = await handleFileUploadUsingPresignedURL(uploadURL, file, file.type);
        return [res , null]
    } catch(err) {
        console.log(err.message)
        toast.error(err.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
        });
        return [null, err]
    }
}

/**
 * creates and returns a deep copy of the given object
 * @param {object} obj
 */

export const getObjectDeepCopy = (obj)=>{
    if (
        typeof obj === 'object' &&
        !Array.isArray(obj) &&
        obj
    ) {
        return JSON.parse(JSON.stringify(obj))
    }else{
        console.log("Invalid input provided to 'getObjectDeepCopy'")
        toast.error("Invalid input provided to 'getObjectDeepCopy'", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
        });
        return null
    }
}


export const adjustColorBrightness = (col, amt) => {
    col = col.replace(/^#/, '')
    if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]
  
    let [r, g, b] = col.match(/.{2}/g);
    ([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt])
  
    r = Math.max(Math.min(255, r), 0).toString(16)
    g = Math.max(Math.min(255, g), 0).toString(16)
    b = Math.max(Math.min(255, b), 0).toString(16)
  
    const rr = (r.length < 2 ? '0' : '') + r;
    const gg = (g.length < 2 ? '0' : '') + g;
    const bb = (b.length < 2 ? '0' : '') + b;
  
    return `#${rr}${gg}${bb}`
}

// export const createTheme = (primary, secondary)=>{
//     return (
//         {
//             primary: primary,
//             secondary: secondary,
//             light_primary: adjust(primary, 25),
//             lighter_primary: adjust(primary, 50),
//             dark_primary: adjust(primary, -25),
//             darker_primary: adjust(primary, -50),
//             secondary: secondary,
//             light_secondary: adjust(secondary, 25),
//             lighter_secondary: adjust(secondary, 50),
//             dark_secondary: adjust(secondary, -25),
//             darker_secondary: adjust(secondary, -50),
//         }
//     )
// }