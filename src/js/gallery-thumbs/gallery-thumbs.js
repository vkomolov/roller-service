"use strict";

import { replaceFilePath } from "../helpers/funcsDOM.js";

//////// END OF IMPORTS //////////////////

export function initThumbs(gallerySelector, originPath = null) {
  const galleryBlock = document.querySelector(gallerySelector);
  if (!galleryBlock) {
    throw new Error("at initGalleryThumbs: The given 'galleryContainer' is not in the DOM...");
  }

  //for checking media tags
  const queryTags = ["picture", "video", "audio", "object", "img"];
  const mediaArr = [];

  for (const elem of galleryBlock.children) {
    const mediaItem = elem.querySelector(queryTags.join(", ")); //receiving one string with the selectors
    if (mediaItem) mediaArr.push(mediaItem);
  }

  const runThumbs = initModal(mediaArr, originPath);

  galleryBlock.addEventListener("click", ({ target }) => {
    const foundIndex = mediaArr.findIndex(item => item === target.parentElement || item === target);
    if (foundIndex === -1) {
      console.error("at initThumbs: the clicked element is not found in the gallery... omitting click...");
    }
    else {
      // Disabling scrolling when modal is open
      document.body.style.overflow = "hidden";

      runThumbs(foundIndex);
    }
  });

  function initModal(mediaArr, originPath = null) {
    const modalStyle = {
      fontSize: "1em",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      zIndex: 200,
      padding: "3em 5em",
      overflow: "hidden",
    };
    const mediaContainerStyle = {
      boxSizing: "border-box",
      maxWidth: "100%",
      maxHeight: "100%",
      overflow: "hidden",
      opacity: "0",
      transition: "opacity 1.5s ease",
    };
    const pictureStyle = {
      width: "100%",
      //maxWidth: "100%",
    };
    const imgScoreStyle = {
      position: "absolute",
      top: "1%",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "1.5em",
      color: "rgba(255, 255, 255, .8)",
    };
    const arrowStyle = {
      fontSize: "1.5em",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      width: "1.5em",
      height: "1.5em",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      lineHeight: 1,
      backgroundColor: "rgba(255, 255, 255, .4)",
      color: "rgba(255, 255, 255, 1)",
      cursor: "pointer",
    };
    const closeButtonStyle = {
      fontSize: "1em",
      position: "absolute",
      top: "1%",
      right: "0.5em",
      display: "flex",
      width: "1.5em",
      height: "1.5em",
      justifyContent: "center",
      alignItems: "center",
      lineHeight: "1em",
      backgroundColor: "rgba(255, 255, 255, .4)",
      color: "rgba(255, 255, 255, 1)",
      cursor: "pointer",
    };
    //clicked index of the media array
    let currentIndex = null;

    //creating modal container
    const modal = document.createElement("div");

    const imgScore = document.createElement("span");
    imgScore.setAttribute("tabindex", "0");

    const closeButton = document.createElement("span");
    closeButton.classList.add("foxy-on-hover");
    closeButton.textContent = "X";
    closeButton.setAttribute("data-type", "close");
    closeButton.setAttribute("tabindex", "0");

    const arrowPrev = document.createElement("span");
    arrowPrev.classList.add("foxy-on-hover");
    arrowPrev.textContent = "<";
    arrowPrev.setAttribute("data-type", "prev");
    arrowPrev.setAttribute("tabindex", "0");

    const arrowNext = document.createElement("span");
    arrowNext.classList.add("foxy-on-hover");
    arrowNext.textContent = ">";
    arrowNext.setAttribute("data-type", "next");
    arrowNext.setAttribute("tabindex", "0");

    const mediaContainer = document.createElement("div");

    Object.assign(modal.style, modalStyle);
    Object.assign(imgScore.style, imgScoreStyle);
    Object.assign(closeButton.style, closeButtonStyle);
    Object.assign(arrowPrev.style, arrowStyle, { left: "0.5em" });
    Object.assign(arrowNext.style, arrowStyle, { right: "0.5em" });
    Object.assign(mediaContainer.style, mediaContainerStyle);

    modal.append(imgScore, closeButton, arrowPrev, arrowNext, mediaContainer);

    let clonedMediaItem = null;

    //////// LISTERNERS //////////
    const getPrev = () => {
      const index = currentIndex === 0 ? mediaArr.length - 1 : currentIndex - 1;
      runThumbs(index);
    };
    const getNext = () => {
      const index = currentIndex === mediaArr.length - 1 ? 0 : currentIndex + 1;
      runThumbs(index);
    }
    const actions = {
      "close": handleEscape,
      "prev": getPrev,
      "next": getNext,
      "Escape": handleEscape,
      "ArrowLeft": getPrev,
      "ArrowRight": getNext,
    };

    modal.addEventListener("click", ({ target }) => {
      const { type } = target.dataset;
      if (type && actions[type]) {
        actions[type]();
      }
    });

    modal.addEventListener('swiped-left', getPrev);

    modal.addEventListener('swiped-right', getNext);

    function handleKey(event) {
      if (event.key in actions) {
        actions[event.key]();
      }
    }
    function handleEscape() {
      modal.remove();
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    }
    const runThumbs = (clickedIndex) => {
      mediaContainer.style.opacity = "0";
      //adding document listener on each runThumbs, removing document listener on modal.remove()
      document.addEventListener("keydown", handleKey);

      if (clickedIndex !== currentIndex) {
        currentIndex = clickedIndex;
        const clickedElem = mediaArr[clickedIndex];
        let imgAlt = null;
        const clonedElem = clickedElem.cloneNode(true);

        if (!clonedMediaItem) {
          clonedMediaItem = clonedElem;
          Object.assign(clonedMediaItem.style, pictureStyle);
          mediaContainer.appendChild(clonedMediaItem);
        }
        else {
          mediaContainer.removeChild(clonedMediaItem);
          //overwriting the appended media item...
          clonedMediaItem = clonedElem;
          mediaContainer.appendChild(clonedMediaItem);
        }

        if (!clickedElem.childElementCount) {
          updateSource(clickedElem, clonedMediaItem, originPath);
          // if the element is img, then to get alt attribute...
          if (clickedElem.hasAttribute("alt")) {
            imgAlt = clickedElem.getAttribute("alt");
          }
        }
        else {
          const children = clickedElem.children;
          const childrenCloned = clonedMediaItem.children;

          for (let i = 0; i < children.length; i++) {
            updateSource(children[i], childrenCloned[i], originPath);
            // if the element is img, then to get alt attribute...
            if (children[i].hasAttribute("alt")) {
              imgAlt = children[i].getAttribute("alt");
            }
          }
        }

        //giving the count of the image
        const imgAltText = imgAlt ? `: ${imgAlt}` : "";
        imgScore.textContent = `${clickedIndex + 1} / ${mediaArr.length} ${imgAltText}`;

        // Add the modal to the body
        document.body.appendChild(modal);

      }
      else {
        // Add the modal to the body
        document.body.appendChild(modal);
      }

      setTimeout(() => {
        mediaContainer.style.opacity = "1";
      }, 0);

      function updateSource(clickedElem, clonedMediaItem, originPath = null) {
        const attrData = {
          "IMG": "src",
          "SOURCE": "srcset",
          "OBJECT": "data"
        };

        const attr = attrData[clickedElem.tagName];
        if (attr) {
          if (clickedElem.hasAttribute(attr) && clickedElem.getAttribute(attr) !== "") {
            if (!originPath) {
              console.warn("at initThumbs: No origin path to media is provided, falling back to default source...");
              clonedMediaItem.setAttribute(attr, clickedElem.getAttribute(attr));
            }
            else {
              clonedMediaItem.setAttribute(attr, replaceFilePath(clickedElem.getAttribute(attr), originPath));
            }
          }
          else {
            console.error(`at initThumbs.initModal.runThumbs.updateSource: the clicked elem ${clickedElem.tagName} at the index of the parent: ${clickedIndex}  has no "${attr}" attribute or it is empty... omitting thumbs...`);
          }
        }
      }
    };

    return runThumbs;
  }
}


/////// DEV
function log(it, text = "value: ") {
  console.log(text, it);
}