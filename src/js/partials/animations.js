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
    pairLeft: "[data-type=pair-left]",
    pairRight: "[data-type=pair-right]",
    sectionBenefits: ".section[data-type=benefits]"
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

        ///////////// PAIR-LEFT ANIMATION /////////////////

        const pairLeftElems = gsap.utils.toArray(i.pairLeft);
        pairLeftElems.forEach((elem, index) => {
            const tlKey = `pairLeft_${index}`;
            const tl = getScrollTimeLinePairLeftRight(elem, "left");

            if (tl && hasRealAnimations(tl)) {
                Object.assign(tlData, { [tlKey]: tl });
            }
        });

        ///////////// PAIR-RIGHT ANIMATION /////////////////
        const pairRightElems = gsap.utils.toArray(i.pairRight);
        pairRightElems.forEach((elem, index) => {
            const tlKey = `pairRight_${index}`;
            const tl = getScrollTimeLinePairLeftRight(elem, "right");

            if (tl && hasRealAnimations(tl)) {
                Object.assign(tlData, { [tlKey]: tl });
            }
        });


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
 * It creates the Timeline scroll animations for the elements at "--pair" sections
 * @param {HTMLElement} elem  - the HTMLElement
 * @param {("left", "right")} position - for left and right elements in sections "--pair"
 * @return {gsap.core.Timeline | false} - returns the object with the special key of the timeline or false
 */
function getScrollTimeLinePairLeftRight(elem, position) {
    if (elem instanceof HTMLElement) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play reverse play reverse",
                //markers: true,
            }
        });

        tl.to(elem, {
            opacity: 1,
            duration: 1,
        });
        tl.from(elem, {
            x: position === "left" ? -80 : 80,
            y: 80,
            duration: 1,
            ease: "circ.out"
        }, "<");

        return tl;
    }
    else {
        console.warn(`at pageAnimations: the given selector ${i.pairLeft} is not HTMLElement at index: ${index}...`);
        return false;
    }
}

/////// DEV
function log(it, text="value: ") {
    console.log(text, it );
}