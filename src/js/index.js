'use strict';

import { animatePage } from "./partials/animations.js";
import { initMasonry } from "./helpers/funcsDOM.js";

document.addEventListener("DOMContentLoaded", () => {
  const totalTl = animatePage();
  log(totalTl, "totalTl: ");

  const masonryElem = initMasonry("#gallery-work", {
    gap: 7,
    percentPosition: true,
  })
    .then(res =>  log(res, "elements: "));


    ///////// END OF DOMContentLoaded Listener ////////////
});



/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}