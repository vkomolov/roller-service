'use strict';

import { animatePage, fadeInGallery } from "./partials/animations.js";
import { createMasonry, activateNavLink, lockedEventListener } from "./helpers/funcsDOM.js";
import { initThumbs } from "./modulesPack/gallery-thumbs/gallery-thumbs.js";

lockedEventListener("resize", window, 2000)(() => {
  createMasonry("#gallery-work", {
    gap: 20,
  })
    .catch(error => {
      console.error(error);
    })
  //.then(res =>  log(res, "elements: "));
});

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
  const logoLinkSelector = ".logo-link";

  //checking and lighten several duplicate navigations for the .active links:
  activateNavLink(".nav-link", pageType, "active", linkAnchors[pageType] || "#");

  //removing href from "index.html" to "#" if pageType === "index"
  const logoLink = document.querySelector(logoLinkSelector);
  if (!logoLink) {
    console.warn(`logoLink Selector: ${logoLinkSelector} is no found in DOM...`);
  }
  else {
    if (pageType === "index") {
      logoLink.setAttribute("href", linkAnchors[pageType])
    }
  }

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
    .then(() => initThumbs("#gallery-work", "assets/img/gallery"))
    .catch(error => {
      console.error(error);
    })



    ///////// END OF DOMContentLoaded Listener ////////////
});


/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}