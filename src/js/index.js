'use strict';

import { animatePage } from "./partials/animations.js";
document.addEventListener("DOMContentLoaded", () => {
  const totalTl = animatePage();
  log(totalTl, "totalTl: ");


    ///////// END OF DOMContentLoaded Listener ////////////
});



/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}