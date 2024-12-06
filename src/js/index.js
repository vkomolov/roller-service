'use strict';

import { animatePage } from "./partials/animations.js";
import { createMasonry, lockedEventListener } from "./helpers/funcsDOM.js";

lockedEventListener("resize", window, 3000)(() => {
  createMasonry("#gallery-work", {
    gap: 20,
  })
    .then(res =>  log(res, "elements at window resize: "));
});

document.addEventListener("DOMContentLoaded", () => {
  const totalTl = animatePage();
  log(totalTl, "totalTl: ");

  createMasonry("#gallery-work", {
    gap: 20,
  })
    .then(res =>  log(res, "elements: "));


    ///////// END OF DOMContentLoaded Listener ////////////
});


/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}