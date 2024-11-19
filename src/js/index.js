'use strict';

import { animatePage } from "./partials/animations.js";
document.addEventListener("DOMContentLoaded", async () => {
  animatePage();
});

/////// DEV
function log(it, text="value: ") {
  console.log(text, it );
}