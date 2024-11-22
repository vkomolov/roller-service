'use strict';

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

///////////////// REGISTER GSAP PLUGINS /////////////
gsap.registerPlugin(ScrollTrigger);

//////////////// ANIMATION DATA /////////////////////
/// ANIMATION SELECTORS
/// index.html
const i = {
    scrolledNav: "#scrolledNav",
    gatesSection: "#gatesSection",
    headingAccentHero: ".section__heading-block--hero .accent",
    headingHeroRest: ".section__heading-block--hero .rest-of-heading",
    textBlockHero: ".section__text-block--hero",
    biddingBlockHero: ".section__bidding-block--hero",
    iconWrapperHero: ".section__img-wrapper--hero",
    fadeInLeft: "[data-type=fade-in-left]",
    fadeInRight: "[data-type=fade-in-right]",
    fadeInUp: "[data-type=fade-in-up]",
    scaleIn: "[data-type=scale-in]",
}

/// ANIMATION PARAMS
const pageAnimations = {
    index: () => {
        const tlData = {};

        return tlData;
    },
    common: () => {
        const tlData = {};

        ///////////// SCROLLED NAVIGATION ANIMATION //////////
        const scrolledNav = gsap.to(i.scrolledNav, {
            top: 0,
            duration: 1,
            ease: "back.out(2.5)",
            delay: 0.5,
            scrollTrigger: {
                trigger: i.gatesSection,
                start: "top 10%",
                //end: "bottom 85%",
                toggleActions: "play none none reverse",
                //markers: true,
                /**
                 * preventOverlaps vs fastScrollEnd - should be chosen on of them
                 */
                preventOverlaps: true, //prevent overlapping animations at several trigger animations
                //fastScrollEnd: true, // stop previous animation if the scrollTrigger starts animation again...
            }
        });

        ///////////// SECTION HERO ANIMATION /////////////////
        const tlHero = gsap.timeline();

        tlHero.to(i.headingAccentHero, {
            opacity: 1,
            duration: 2,
            delay: 0.3,
        });
        tlHero.from(i.headingAccentHero, {
            x: 80,
            duration: 0.8,
            ease: "circ.out"
        }, "<");
        tlHero.to(i.headingHeroRest, {
            opacity: 1,
            duration: 2,
        }, "<");
        tlHero.from(i.headingHeroRest, {
            x: -80,
            duration: 0.8,
            ease: "circ.out"
        }, "<");
        tlHero.to(i.textBlockHero, {
            opacity: 1,
            duration: 2,
        }, "-=1.5");
        tlHero.from(i.textBlockHero, {
            y: 80,
            duration: 0.8,
            ease: "circ.out"
        }, "<");
        tlHero.to(i.biddingBlockHero, {
            opacity: 1,
            duration: 2,
        }, "<+0.3");
        tlHero.from(i.biddingBlockHero, {
            y: 40,
            duration: 0.8,
            ease: "circ.out"
        }, "<");
        tlHero.to(i.iconWrapperHero, {
            scale: 1,
            duration: 1.5,
            ease: "elastic.out"
        }, "<+0.5");

        if (hasRealAnimations(tlHero)) {
            tlData["tlHero"] = tlHero;
        }

        ///////////// FADE-IN-LEFT ANIMATIONS /////////////////

        const fadeInLeftAnimations = getAllScrollTwoTweens(i.fadeInLeft,"fadeInLeft",{
            opacity: 1,
            duration: 0.7,
            delay: 0.2,
        }, {
            x: -80,
            y: 80,
            duration: 1,
            ease: "circ.out",
        });
        //assigning timeline references
        Object.assign(tlData, fadeInLeftAnimations);

        ///////////// FADE-IN-RIGHT ANIMATIONS /////////////////

        const fadeInRightAnimations = getAllScrollTwoTweens(i.fadeInRight, "fadeInRight", {
            opacity: 1,
            duration: 0.7,
            delay: 0.2,
        }, {
            x: 80,
            y: 80,
            duration: 1,
            ease: "circ.out",
        });
        //assigning timeline references
        Object.assign(tlData, fadeInRightAnimations);

        ///////////// SCALE-IN ANIMATIONS ///////////

        const scaleInAnimations = getAllScrollTwoTweens(i.scaleIn, "scaleIn", {
            opacity: 1,
            duration: 1,
            delay: 0.2,
        }, {
            scale: 0.7,
            duration: 1.2,
            ease: "back.out(1)",
        });
        //assigning timeline references
        Object.assign(tlData, scaleInAnimations);


        //////////// FADE-IN-UP ANIMATIONS /////////////////

        const fadeInUpAnimations = getAllScrollTwoTweens(i.fadeInUp, "fadeInUp", {
            opacity: 1,
            duration: 1,
            delay: 0.2,
        }, {
            y: 80,
            duration: 1,
            ease: "circ.out",
        });
        //assigning timeline references
        Object.assign(tlData, fadeInUpAnimations);

        /////////////////


        return tlData;
    }
}


////////////////  ANIMATION FUNCTIONS ////////////////

//for the dynamic and SPA site without reloading, using the flag to avoid multiple listeners
let listenerAdded = false;

export const animatePage = () => {
    if (document.readyState === "loading" && !listenerAdded) {
        document.addEventListener("DOMContentLoaded", () => onPageLoaded(pageAnimations));
        listenerAdded = true;  // Set a flag so that the listener is added only once
    }
    else {
        return onPageLoaded(pageAnimations);
    }
}

/**
 * It gets the animation instructions Object and returns the Object with the references to the initiated timelines
 * @param {Object} animationData - the Object with the animation instructions for the pages
 * @return {Object} - Returns the Object with the references to all the initiated timelines
 */
function onPageLoaded(animationData) {
    const pageName = document.body.dataset.type;
    const totalTl = {};


    if (animationData.common) {
        const commonTl = animationData.common();
        Object.assign(totalTl, commonTl);
    }
    else {
        console.warn(`at onPageLoaded(): no "common" property found in the given Object...`);
    }

    if (pageName in animationData) {
        const tlPage = animationData[pageName]();
        return Object.assign(totalTl, tlPage);
    }
    else {
        console.warn(`at onPageLoaded(): no such page name property: ${pageName} found in the given Object...`);
        return totalTl;
    }
}

/**
 * Checking the gsap timeline for not empty animations
 * @param {gsap.core.Timeline | gsap.core.Tween} timeline - the gsap timeline to be checked
 * @return {boolean} - returns whether the timeline has at least one not empty tween
 */
function hasRealAnimations(timeline) {
    // Getting all child tweens of the timeline
    // Checking if there is at least one tween with a duration greater than zero
    return timeline.getChildren().some(child => child.duration() > 0);
}

/**
 * It creates the Timeline scroll animations with fading in from opacity: 0, and optional gsap.from params which
 * are animated with the opacity animation...
 * @param {HTMLElement} elem  - the HTMLElement
 * @param {Object} [gsapToParams={}] - params for the first tween with gsap.to
 * @param {Object} [gsapFromParams={}] - params for the last tween with gsap.from
 * @param {String} [nextAnimePos="<"] - The position for the second tween, indicating when the animation should start relative to the first.
 * @return {gsap.core.Timeline|boolean} - Returns a Timeline with animations, or false if the passed element is not an HTMLElement.
 *
 * @example using first tween gsap.to params for the first animation, and gsap.from params for the last tween
 * getScrollTimelineTwoTweens(elem, { opacity: 1, duration: 0.7, delay: 0.2 }, { x: 80, y: 80, duration: 1, ease: "circ.out", });
 *
 * @example
 * getScrollTimelineTwoTweens(elem, { opacity: 1, duration: 1, delay: 0.2 }, { scale: 0.7, duration: 1, ease: "circ.out", }, "-=1.5");
 */
function getScrollTimelineTwoTweens(elem, gsapToParams = {}, gsapFromParams = {}, nextAnimePos = "<") {
    if (elem instanceof HTMLElement) {
        //The timeline initiation with the ScrollTrigger and its default params...
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 80%",
                //end: "bottom 85%",
                toggleActions: "play none none reverse",
                //markers: true,
                /**
                 * preventOverlaps vs fastScrollEnd - should be chosen on of them
                 */
                preventOverlaps: true, //prevent overlapping animations at several trigger animations
                //fastScrollEnd: true, // stop previous animation if the scrollTrigger starts animation again...
            }
        });

        tl.to(elem, {
            ...gsapToParams,
        });
        tl.from(elem, {
            ...gsapFromParams,
        }, nextAnimePos);

        return tl;
    }
    else {
        console.warn(`at getScrollTimeLinePairLeftRight: the given selector ${elem} is not HTMLElement...`);
        return false;
    }
}

/**
 * It makes animation timeline for each element by selector and returns the Object with the timeline references...
 * @param {String} selector - the common selector of the target elements in DOM
 * @param {String} [propKey="tlKey"] - the key part for making unique key of the timeline in the Object to return...
 * @param {Object} [gsapToParams={}] - params for the first tween with gsap.to
 * @param {Object} [gsapFromParams={}] - params for the last tween with gsap.from
 * @param {String} [nextAnimePos="<"] - The position for the second tween, indicating when the animation should start relative to the first.
 * @return {Object} - Object containing gsap.core.Timeline references in particular properties...
 */
function getAllScrollTwoTweens(selector, propKey = "tlKey", gsapToParams = {}, gsapFromParams = {}, nextAnimePos = "<") {
    const targetElems = gsap.utils.toArray(selector);
    const tlObj = {};
    if (!targetElems.length) {
        console.warn(`at getAllScrollTimeLineTwoTweens(): no elements found in DOM with selector: ${selector}...`);
        return tlObj;
    }

    targetElems.forEach((elem, index) => {
        const tlKey = `${propKey}_${index}`;
        const tl = getScrollTimelineTwoTweens(elem, gsapToParams, gsapFromParams, nextAnimePos);

        if (tl && hasRealAnimations(tl)) {
            tlObj[tlKey] = tl;
        }
    });

    return tlObj;
}


/////// DEV
function log(it, text="value: ") {
    console.log(text, it );
}