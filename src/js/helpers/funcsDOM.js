'use strict';

import { gsap } from "gsap";
//import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

/**
 * It checks whether the given style rule is supported for the given HTML Element
 * @param {HTMLElement} element - target HTML Element
 * @param {string} param - css rule
 * @param {string} value - the value of the css rule
 * @return {boolean}
 */
export function isStyleSupported (element, param, value) {
    return param in element.style && CSS.supports(param, value);
}

/**
 * it migrates the given HTML Element to another HTML parent
 * @param {HTMLElement} target - the target HTML Element
 * @param {HTMLElement} parentFrom - the current HTML parent
 * @param {HTMLElement} parentTo - the target HTML parent to migrate to
 */
export function migrateElement({ target, parentFrom, parentTo }) {
    if (target.parentNode) {
        (target.parentNode === parentFrom ? parentTo : parentFrom).appendChild(target);
    }
    else {
        console.warn(`transitBox: target in not in DOM: ${target}`);
    }
}

/**
 * Fountains a certain number of balls.
 * @param {HTMLElement} targetElem - the target Element for animation
 * @param {Object} [params={}] - additional params
 * @param {number} [params.ballsCount = 1] - The quantity of the balls to be fountained. Defaults to 1 if not provided.
 * @param {Object} [params.cssStyles={}] additional css styles of the balls
 * @param {boolean} [params.animateSeparate=false] the flag for separate animation of the balls
 * @param {string[]} [params.ballColors=[]] If not provided, a default inner array (ballColorsArr) is used:
 *
 * @return {gsap.core.Timeline | null}
 */
export function fountainBalls(targetElem, params = {}) {
    if (!document.body.contains(targetElem)) {
        console.error(`the given targetElem ${targetElem} is not in DOM...`);
        return null;
    }

    ///////////// INITIAL SETTINGS /////////////////

    const ballStylesObj = {
        position: "absolute",
        width: "30px",
        height: "30px",
        top: "50%",
        left: "50%",
        borderRadius: "50%",
        zIndex: "-1",
        visibility: "hidden",
        scale: "0"
    };
    const ballColorsArr = [
        "#0adb38",
        "#db0ac6",
        "#db0a11",
        "#150adb",
        "#0adbca",
        "#cddb0a"
    ];

    const {
        ballsCount = 1,
        cssStyles = {},
        animateSeparate = false,
        ballColors = [],
    } = params;

    const ballStyles = {
        ...ballStylesObj,
        ...cssStyles
    }
    const colors = ballColors.length ? ballColors : ballColorsArr;

    /**
     * Function for "fountain" movement of balls with the common animations
     * @param {gsap.core.Timeline} tl - the timeline for the animation
     * @param {HTMLElement[]} ballsArray - the real array (not collection) of DOM elements
     * @return {void}
     */
    const fountainAll = (tl, ballsArray=[]) => {
        // Clear and reset the timeline
        tl.clear().progress(0);

        // Setting initial values directly in the timeline
        tl.set(ballsArray, {
            //if to remove the initial positions of the balls, they will appear in different places of the area
            //x: 0,
            y: 0,
            immediateRender: false // prevents immediate render of the settings
        });

        // Animation of appearing balls with the random size and random color
        tl.to(ballsArray, {
            autoAlpha: 1,
            scale: function() {
                return gsap.utils.random(0.3, 1);
            },
            backgroundColor: function() {
                return gsap.utils.random(colors);
            },
            duration: 0.1,
            //stagger: 0.1, // delay between animations for each ball
        })

        // Animation of balls moving up the Y axis
        tl.to(ballsArray, {
            y: function() {
                return gsap.utils.random(-70, -100);
            },
            stagger: {
                //each: 0.1, // delay between animations for each ball
                repeat: 1, // repeat once (for the "back" effect)
                yoyo: true, // animation "forward-backward"
                //from: "random",  // "start", "random", "center", "end" to determine the order
            },
            ease: "circ", // smooth deceleration at the end
        }, 0)

        // Animation of balls on the X axis
        tl.to(ballsArray, {
              x: () => gsap.utils.random(-200, 200),
              ease: "none", // linear animation
              duration: 1, // animation duration on X axis
              //stagger: 0.1, // delay between balls
          }, 0) // starting the animation on the X axis at the same time as on the Y axis

        // Hiding the balls after animation
        tl.to(ballsArray, {
            autoAlpha: 0,
            duration: 0.1
        }, "-=0.1");

        // Starting the timeline
        tl.play();
    };

    /**
     * Function for "fountain" movement of balls with the separate animations
     * @param {gsap.core.Timeline} tl - the timeline for the animation
     * @param {HTMLElement[]} ballsArray - the real array (not collection) of DOM elements
     * @return {void}
     */
    const fountainSeparate = (tl, ballsArray = []) => {
        // Clear and reset the timeline
        tl.clear().progress(0);

        // Checking for the nested timelines in the main timeline if the animation has already been run
        const childTimeLines = tl.getChildren(false, false, true);

        /**
         * Creating the inner timelines of each ball or using the already created inner timelines of the previous run
         * Adding the animations to the separate inner timeline of each ball
         */
        ballsArray.forEach((ball, index) => {
            let ballTl = childTimeLines[index];
            if (!ballTl) {
                ballTl = gsap.timeline();
                tl.add(ballTl, index * 0.2);
            }

            //to avoid the IDE alerts on checking the method "to" in childTimeLines[index]
            if ("to" in ballTl && typeof ballTl.to === "function") {
                // Animation of appearing of each ball with the random size and random color
                ballTl.to(ball, {
                    autoAlpha: 1,
                    scale: gsap.utils.random(0.3, 1),
                    backgroundColor: gsap.utils.random(colors),
                    duration: 0.1
                });

                // Animation of each ball moving up the Y axis
                ballTl.to(ball, {
                    y: gsap.utils.random(-70, -100),
                    //duration: 1,
                    ease: "circ",   // smooth deceleration at the end
                    yoyo: true, // animation "forward-backward"
                    repeat: 1,   // repeat once (for the "back" effect)
                }, 0);

                // Animation of balls on the X axis
                ballTl.to(ball, {
                    x: gsap.utils.random(-200, 200),
                    duration: 1,    // animation duration on X axis
                    ease: "none",   // linear animation
                }, 0);  // starting the animation on the X axis at the same time as on the Y axis

                // Hiding the balls after animation
                ballTl.to(ball, {
                    autoAlpha: 0,
                    duration: 0.1
                }, "-=0.1");
            }
        });

        // Starting the timeline
        tl.play();
    }

    ///////////// END OF INITIAL SETTINGS /////////////////

    // Adding styles to the target element: position: relative; and display: inline-block;
    targetElem.style.position = "relative";
    targetElem.style.display = "inline-block";

    //creating balls with account to the given balls count in params
    const ballsArr = [];

    for (let i = 1; i <= ballsCount; i++) {
        let ball = document.createElement("div");
        Object.assign(ball.style, ballStyles);
        targetElem.appendChild(ball);
        ballsArr.push(ball);
    }

    const tl = gsap.timeline({ paused: true });

    targetElem.addEventListener("mouseenter", () => {
        animateSeparate ? fountainSeparate(tl, ballsArr) : fountainAll(tl, ballsArr);
    });

    return tl;
}

/**
 * A function that adds a scroll event listener to a DOM element, window, or document,
 * with a delay to limit the number of times the callback function is triggered during scroll events.
 * It prevents the callback from being called too frequently by using a "lock" mechanism.
 *
 * @param {HTMLElement|Window|Document} listenerOwner - The DOM element, window, or document to listen for scroll events.
 * @param {number} [delay=300] - The delay (in milliseconds) between consecutive callback executions. Defaults to 300ms.
 * @returns {Function} A function that accepts a callback and parameters, and returns another function to remove the scroll event listener.
 *
 * @throws {Error} If the listenerOwner is not a valid DOM element, window, or document.
 *
 * @example
 * // Example of using scrollLimitedListener with the window object
 * const initScrollLimiter = scrollLimitedListener(window, 700);
 *     const removeScrollListener = initScrollLimiter(() => {
 *         const scrollY = window.scrollY || document.documentElement.scrollTop;
 *         console.log(scrollY); // Logs scroll position
 *     });
 *
 *     // Remove the scroll listener on click
 *     document.addEventListener("click", () => removeScrollListener());
 */
export function scrollLimitedListener(listenerOwner, delay=300) {
    if (!(document.contains(listenerOwner)) && window !== listenerOwner && document !== listenerOwner) {
        throw new Error("Provided listenerOwner at scrollLimitedListener() is not a valid DOM element.");
    }

    let isLocked = false;

    return (cb, params = []) => {
        const handler = () => {
            if (!isLocked) {
                isLocked = true;
                setTimeout(() => {
                    cb(...params);
                    isLocked = false;
                }, delay);
            }
        };

        listenerOwner.addEventListener("scroll", handler);

        return () => {
            listenerOwner.removeEventListener("scroll", handler);
        }
    };
}

export function customTargetStyleOnScroll(target, trigger, classActivation, scrollOwner = window, scrollTimeLimit = 300) {
    if (!document.contains(target) || !document.contains(trigger)) {
        throw new Error("at initTopAppearanceOnScroll(): the given target or trigger are not found in DOM...");
    }

    /**
     * is scrolledNav is already active to avoid extra animations
     * @type {boolean}
     */
    let isScrolledActive = false;

    const initScrollLimiter = scrollLimitedListener(scrollOwner, scrollTimeLimit);
    initScrollLimiter(() => {
        const triggerTop = trigger.getBoundingClientRect().top;

        if (triggerTop <= 0) {
            if (!isScrolledActive) {
                requestAnimationFrame(() => {
                    target.classList.add(classActivation);
                    isScrolledActive = true;
                });
            }
        }
        else {
            if (isScrolledActive && target.classList.contains(classActivation)) {
                requestAnimationFrame(() => {
                    target.classList.remove(classActivation);
                    isScrolledActive = false;
                });
            }
        }
    });
}

/**
 *  It sets attributes to HTMLElement instances
 * @param {[Element]} [elements=[]] the list of HTMLElements to be set with the attributes
 * @param {Object} [targetAttr={}] consists of the keys as the attributes and the values
 * @returns {void}
 */
export function setAttributes(elements = [], targetAttr = {}) {

  elements.forEach((element, i) => {
    if (!(element instanceof HTMLElement)) {
      throw new Error(`one of the elements at index ${i} is not the instance of HTMLElement...`);
    }

    Object.entries(targetAttr).forEach(([attr, value]) => {
      element.setAttribute(attr, (value !== null && value !== undefined) ? value.toString() : "");
    });
  });
}

export function handleScroll(isScrolled = true) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isScrolled) {
        requestAnimationFrame(() => {
            document.body.style.paddingRight = `0`;
            document.body.style.overflow = 'auto';
        });
    } else {
        requestAnimationFrame(() => {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
        });
    }
}

export function getImagesInParent(parent) {
    if (!(document.contains(parent)) && window !== parent && document !== parent) {
        throw new Error("no such element in DOM");
    }

    return Array.from(parent.children).find((elem => {
        const elemTagName = elem.tagName.toLowerCase();
        return elemTagName === "img"
          || elemTagName === "picture"
          || elemTagName === "svg"
          || elemTagName === "canvas"
          || elemTagName === "video";
    }));
}

/**
 * @function getImagesLoaded
 * @description This function checks the loading status of all images within a specified container and returns a promise.
 * It resolves with an array of elements that contain images that have successfully loaded, filtering out those that failed to load.
 * If any images are broken, their URLs will be logged to the console.
 *
 * @param {HTMLElement} container - The DOM element that contains the images to check. This element must be present in the document.
 * @returns {Promise<Array<HTMLElement>>} A promise that resolves to an array of HTML elements (children of the container) where all images are successfully loaded.
 *
 * @example
 * const container = document.querySelector('.image-container');
 * getImagesLoaded(container).then(loadedElements => {
 *     console.log('Loaded elements:', loadedElements);
 * }).catch(error => {
 *     console.error('Error loading images:', error);
 * });
 */
export function getImagesLoaded(container) {
    return new Promise((resolve, reject) => {
        if (!document.contains(container)) {
            reject(new Error("Container not found in DOM at getImagesLoaded..."));
            return;
        }

        imagesLoaded(container, instance => {
            const brokenImages = { brokenUrls: [], brokenIndexes: [] };

            if (instance.hasAnyBroken) {
                instance.images.forEach((item, index) => {
                    if (!item.isLoaded) {
                        brokenImages.brokenUrls.push(item.img.attributes.src.value);
                        brokenImages.brokenIndexes.push(index);
                    }
                });

                // Displaying a warning only if there are broken images
                if (brokenImages.brokenUrls.length > 0) {
                    console.warn("The following URLs of the images are not found: ", brokenImages.brokenUrls);
                }
            }

            // Creating an array of container elements
            const elements = Array.from(container.children);
            // Filtering elements, excluding broken images
            const filteredElements = elements.filter((item, index) => !brokenImages.brokenIndexes.includes(index));

            // Returning the result even if the images were not broken
            resolve(filteredElements);
        });
    });
}

export async function initMasonry(containerSelector, params =  {}) {
    const options = {
        percentPosition: false,
        gap: 0,
    };
    const auxOptions = {
        ...options,
        ...params,
    };

    try {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`at initMasonry: no such selector ${containerSelector} found in DOM`);
        }

        container.style.position = "relative";
        //container.style.overflow = "hidden";
        const imagesArr = await getImagesLoaded(container);
        const containerWidth = parseFloat(window.getComputedStyle(container).width);

        log(containerWidth, "container width: ");

        const { gap } = auxOptions;
        //all image items are equal in width by css rule...
        const styles = window.getComputedStyle(imagesArr[0]);
        let itemWidth = parseFloat(styles.width);
        const itemMinWidth = parseFloat(styles.minWidth);
        itemWidth = auxOptions.percentPosition && itemMinWidth > 0 ? Math.max(itemWidth, itemMinWidth) : itemWidth;
        log(itemWidth, "image width: ");

        let totalWidth = 0;
        let columns = 0;

        while (true) {
            if (containerWidth > (totalWidth + itemWidth)) {
                totalWidth += itemWidth;
                columns++;

                if (containerWidth > (totalWidth + itemWidth + gap)) {
                    totalWidth += gap;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }

        log(totalWidth, "totalWidth: ");
        log(columns, "columns: ");

        const leftOffset = (containerWidth - totalWidth) / 2;
        log(leftOffset, "leftOffset: ");

        const posLeftArr = new Array(columns).fill(0);
        const posTopArr = new Array(columns).fill(0);

        for (let i = 0, n = 0; i < imagesArr.length; i++) {
            const item = imagesArr[i];
            const itemHeight = parseFloat(window.getComputedStyle(item).height);

            if (n === 0) {
                posLeftArr[n] = leftOffset;
            }

            item.style.position = "absolute";
            item.style.top = `${posTopArr[n]}px`;
            item.style.left = `${posLeftArr[n]}px`;

            posTopArr[n] += itemHeight;

            //if the image item is not in the last row...
            if (i < (imagesArr.length - posLeftArr.length)) {
                posTopArr[n] += gap;
            }
            if (n < (posLeftArr.length - 1)) {
                posLeftArr[n + 1] = posLeftArr[n] + itemWidth + gap;
                n++;
            }
            else {
                n = 0;
            }
        }

        return imagesArr;
    }
    catch (error) {
        console.error("at initMasonry: ", error.message);
    }
}


/////// DEV
function log(it, text="value: ") {
    console.log(text, it );
}