'use strict';

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

///////////////// REGISTER GSAP PLUGINS /////////////
gsap.registerPlugin(ScrollTrigger);

//////////////// ANIMATION DATA /////////////////////
/// ANIMATION SELECTORS
/// index.html
const i = {
    headingAccentHero: ".section__heading-block--hero .accent",
    headingHeroRest: ".section__heading-block--hero .rest-of-heading",
    textBlockHero: ".section__text-block--hero",
    biddingBlockHero: ".section__bidding-block--hero",
    iconWrapperHero: ".section__img-wrapper--hero",
    fadeInLeft: "[data-type=fade-in-left]",
    fadeInRight: "[data-type=fade-in-right]",
    scaleIn: "[data-type=scale-in]",
}

/// ANIMATION PARAMS
const pageAnimations = {
    index: () => {
        const tlData = {};

        ///////////// SECTION ABOUT ANIMATION /////////////////
        //const tlAbout = gsap.timeline();


        return tlData;
    },
    common: () => {
        const tlData = {};

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
            Object.assign(tlData, { tlHero });
        }

        ///////////// FADE-IN-LEFT ANIMATIONS /////////////////

        const fadeInLeftElems = gsap.utils.toArray(i.fadeInLeft);
        fadeInLeftElems.forEach((elem, index) => {
            const tlKey = `fadeInLeft_${index}`;
            const tl = getScrollTimeLineFadeLeftRight(elem, "left");

            if (tl && hasRealAnimations(tl)) {
                Object.assign(tlData, { [tlKey]: tl });
            }
        });

        ///////////// FADE-IN-RIGHT ANIMATIONS /////////////////

        const fadeInRightElems = gsap.utils.toArray(i.fadeInRight);
        fadeInRightElems.forEach((elem, index) => {
            const tlKey = `fadeInRight_${index}`;
            const tl = getScrollTimeLineFadeLeftRight(elem, "right");

            if (tl && hasRealAnimations(tl)) {
                Object.assign(tlData, { [tlKey]: tl });
            }
        });

        ///////////// SCALE-IN ANIMATIONS ///////////
        const scaleInElems = gsap.utils.toArray(i.scaleIn);
        scaleInElems.forEach((elem, index) => {
            const tlKey = `scaleIn_${index}`;
            const tl = getScrollTimeLineScaleIn(elem);

            if (tl && hasRealAnimations(tl)) {
                Object.assign(tlData, { [tlKey]: tl });
            }
        });


        ////////////

        return tlData;
    }
}


////////////////  ANIMATION FUNCTION ////////////////

//for the dynamic and SPA site without reloading, using the flag to avoid multiple listeners
let listenerAdded = false;

export function animatePage() {
    if (document.readyState === "loading" && !listenerAdded) {
        document.addEventListener("DOMContentLoaded", onPageLoaded);
        listenerAdded = true;  // Set a flag so that the listener is added only once
    }
    else {
        return onPageLoaded();
    }

    function onPageLoaded() {
        const pageName = document.body.dataset.type;
        const totalTl = pageAnimations.common();

        if (pageName in pageAnimations) {
            const tlPage = pageAnimations[pageName]();
            return Object.assign(totalTl, tlPage);
        }
        else {
            console.warn(`no such page name ${pageName} found in "pageAnimations"...`);
            return totalTl;
        }
    }
}

function hasRealAnimations(timeline) {
    // Getting all child tweens of the timeline
    const children = timeline.getChildren();

    // Checking if there is at least one tween with a duration greater than zero
    return children.some(child => child.duration() > 0);
}

/**
 * It creates the Timeline scroll animations with fading from left or right
 * @param {HTMLElement} elem  - the HTMLElement
 * @param {("left", "right")} position - for left and right elements in sections "--pair"
 * @return {gsap.core.Timeline | false} - returns the object with the special key of the timeline or false
 */
function getScrollTimeLineFadeLeftRight(elem, position) {
    if (elem instanceof HTMLElement) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 100%",
                //end: "bottom 85%",
                toggleActions: "play reverse restart reverse",
                //markers: true,
                /**
                 * preventOverlaps vs fastScrollEnd - should be chosen on of them
                 */
                //preventOverlaps: true, //prevent overlapping animations at several trigger animations
                fastScrollEnd: true, // stop previous animation if the scrollTrigger starts animation again...
            }
        });

        tl.to(elem, {
            opacity: 1,
            duration: 0.7,
            delay: 0.2,
        });
        tl.from(elem, {
            x: position === "left" ? -80 : 80,
            y: 80,
            duration: 1,
            ease: "circ.out",
        }, "<");

        return tl;
    }
    else {
        console.warn(`at getScrollTimeLinePairLeftRight: the given selector ${elem} is not HTMLElement...`);
        return false;
    }
}

function getScrollTimeLineScaleIn(elem) {
    if (elem instanceof HTMLElement) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 100%",
                //end: "bottom 85%",
                toggleActions: "play reverse restart reverse",
                //markers: true,
                /**
                 * preventOverlaps vs fastScrollEnd - should be chosen on of them
                 */
                //preventOverlaps: true, //prevent overlapping animations at several trigger animations
                fastScrollEnd: true, // stop previous animation if the scrollTrigger starts animation again...
            }
        });

        tl.to(elem, {
            opacity: 1,
            duration: 1,
            delay: 0.2,
        });
        tl.from(elem, {
            scale: 0.7,
            duration: 1.2,
            ease: "back.out(1)",
        }, "<");

        return tl;
    }
    else {
        console.warn(`at getScrollTimeLineScaleIn: the given selector ${elem} is not HTMLElement...`);
        return false;
    }
}


/////// DEV
function log(it, text="value: ") {
    console.log(text, it );
}