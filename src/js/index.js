'use strict';

import { animatePage, fadeInGallery } from "./partials/animations.js";
import { createMasonry, lockedEventListener } from "./helpers/funcsDOM.js";
import { initGalleryThumbs } from "./partials/galleryThumbs.js";

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
      //log(res, "masonry elements: ")
      return fadeInGallery(imagesArr);
    })
    .then(timelines => {
      Object.assign(totalTl, timelines);
      //log("total timelines: ", totalTl);
    })
    .catch(error => {
      console.error(error);
    })

  initGalleryThumbs("#gallery-work", {
    auxSource: "assets/img/gallery",
    imageParentStyle: {
      width: "50%",
      minWidth: "250px",
      maxHeight: "80%",
      boxSizing: "border-box",
      overflow: "hidden"
    }
  });


    ///////// END OF DOMContentLoaded Listener ////////////
});


/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}