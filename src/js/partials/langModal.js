'use strict';

import { getLocalStorage, setLocalStorage } from "../helpers/funcs.js";

//TODO: to check langs
export function promptLangVersion() {
  const langVer = getLocalStorage("langVer", 1);
  if (!langVer) {
    const langModalStyles = {
      position: "fixed",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, .7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
    const promptModalStyles = {
      width: "200px",
      height: "200px",
      backgroundColor: "#fff",
      border: "1px solid #ff8502",
    }

    const headingStyles = {
      fontSize: "1em",
      color: "#ff8502",
    };

    const langModal = document.createElement("div");
    const promptModal = document.createElement("div");
    const heading = document.createElement("p");


  }
}