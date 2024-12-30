'use strict';

import { animatePage, fadeInGallery } from "./partials/animations.js";
import { createMasonry, lockedEventListener } from "./helpers/funcsDOM.js";
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