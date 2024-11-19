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
    imageWrapperAbout: ".section__img-wrapper--pair[data-type=about]",
    textBlockAbout: ".section__text-block--pair[data-type=about]"
}

/// ANIMATION PARAMS
export const pageAnimations = {
    index: [
        {
            //params: {},   //params optional for timeline
            /*      condition: {
                    trigger: ".trigger-element",  //trigger element if necessary
                    event: "mouseenter",  //trigger event if necessary
                    action: "play", //action for the timeline
                  },*/
            children: [
                {
                    selector: i.headingAccentHero,
                    method: "to",
                    params: {
                        opacity: 1,
                        duration: 2,
                    },
                },
                {
                    selector: i.headingAccentHero,
                    method: "from",
                    params: {
                        x: 50,
                        duration: 0.8,
                        ease: "circ.out"
                    },
                    position: "<"
                },
                {
                    selector: i.headingHeroRest,
                    method: "to",
                    params: {
                        opacity: 1,
                        duration: 2,
                    },
                    position: "<"
                },
                {
                    selector: i.headingHeroRest,
                    method: "from",
                    params: {
                        x: -50,
                        duration: 0.8,
                        ease: "circ.out"
                    },
                    position: "<"
                },
                {
                    selector: i.textBlockHero,
                    method: "to",
                    params: {
                        opacity: 1,
                        duration: 2,
                    },
                    position: "-=1.5"
                },
                {
                    selector: i.textBlockHero,
                    method: "from",
                    params: {
                        y: 80,
                        duration: 0.5,
                        ease: "back.out"
                    },
                    position: "<"
                },
                {
                    selector: i.biddingBlockHero,
                    method: "to",
                    params: {
                        opacity: 1,
                        duration: 2,
                    },
                    position: "<+0.2"
                },
                {
                    selector: i.biddingBlockHero,
                    method: "from",
                    params: {
                        y: 80,
                        duration: 0.5,
                        ease: "back.out"
                    },
                    position: "<"
                },
                {
                    selector: i.iconWrapperHero,
                    method: "to",
                    params: {
                        scale: 1,
                        duration: 1.5,
                        ease: "elastic.out"
                    },
                    position: "-=1"
                },
            ]
        },
    ]
}


////////////////  ANIMATION FUNCTION ////////////////

//if the site is dynamic or uses SPA, then to add the flag
let listenerAdded = false;
export function animatePage () {
    if (document.readyState === "loading" && !listenerAdded) {
        document.addEventListener("DOMContentLoaded", onPageLoaded);
        listenerAdded = true;  // Set a flag so that the listener is added only once
    }
    else {
        onPageLoaded();
    }
    function onPageLoaded() {
        const pageName = document.body.dataset.type;
        if (pageName in pageAnimations) {
            const animations = pageAnimations[pageName];

            animations.forEach((tLine, i) => {
                const id = `${pageName}_${i}`;
                const tlParams = tLine.params || {};


                //setting params to the timeline
                const tl = gsap.timeline({
                    id,
                    ...tlParams,
                });


                const { trigger, event, action } = tLine?.condition || {};
                //if timeline runs on the event:
                if (trigger && event && action) {
                    const triggerElement = document.querySelector(trigger);
                    if (triggerElement) {
                        if (typeof tl[action] === "function") {
                            triggerElement.addEventListener(event, () => {
                                tl[action]();  // running timeline on the given event
                            });
                        }
                        else {
                            console.error(`at animations.js: the given action: ${action} is not the method of the timeline: ${id}...`);
                        }
                    }
                    else {
                        console.error(`at animations.js: no trigger: ${trigger} in DOM, or event: ${event}, or action: ${action}...`);
                    }
                }

                /// adding tweens to the timeline
                tLine.children.forEach(tween => {
                    const { selector, method, params, position } = tween;
                    if (position === undefined) {
                        tl[method](selector, params);
                    }
                    else {
                        tl[method](selector, params, position);
                    }
                });
            });
        }
        else {
            console.warn(`no such page name ${pageName} found in "pageAnimations"...`);
        }
    }
}

/////// DEV
function log(it, text="value: ") {
    console.log(text, it );
}