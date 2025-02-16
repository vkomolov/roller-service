'use strict';

import { activateNavLink, createMasonry, lockedEventListener } from "./helpers/funcsDOM.js";
import { initThumbs } from "./modulesPack/gallery-thumbs/gallery-thumbs-index.js";
import { animatePage, fadeInGallery } from "./partials/animations.js";

document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.dataset.type;
  const linkAnchors = {
    index: "#",
    gates: "#gatesSection",
    rollers: "#securityShuttersSection",
    automation: "#rollerShuttersAutomation",
    barriers: "#barrierSection",
    awnings: "#awningsSection",
    windows: "#windowSection",
    security: "#securitySurveillanceSection",
  };
  const navLinkSelector = ".nav-link";
  const navHexagonSelector = ".hexagon-comb-block__cell-link";

  //checking and lighten several duplicate navigations for the .active links:
  activateNavLink(navLinkSelector, pageType, "active", linkAnchors[pageType] || "#");
  activateNavLink(navHexagonSelector, pageType, "active", linkAnchors[pageType] || "#")

  //GSAP animation tweens
  const totalTl = animatePage();
  //log(totalTl, "totalTl: ");

  createMasonry("#gallery-work", {
    gap: 20,
  })
    .then(imagesArr =>  {
      return fadeInGallery(imagesArr);
    })
    .then(timelines => {
      Object.assign(totalTl, timelines);
      //log("total timelines: ", totalTl);
    })

    //TODO: фильтровать из "/thumbs", "/thumbs/" в "thumbs"

    .then(() => initThumbs("#gallery-work", "thumbs"))
    .catch(error => {
      console.error(error);
    });

  //listening to "resize" event to recompile the masonry gallery with the new parameters...
  lockedEventListener("resize", window, 2000)(() => {
    createMasonry("#gallery-work", {
      gap: 20,
    })
      .catch(error => {
        console.error(error);
      })
    //.then(res =>  log(res, "elements: "));
  });

    ///////// END OF DOMContentLoaded Listener ////////////
});


/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}