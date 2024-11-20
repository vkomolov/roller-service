'use strict';

import { animatePage } from "./partials/animations.js";
document.addEventListener("DOMContentLoaded", () => {
  const totalTl = animatePage();

  log(totalTl, "totalTl: ");
});

/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}