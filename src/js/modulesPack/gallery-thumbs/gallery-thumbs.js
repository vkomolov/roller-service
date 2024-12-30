"use strict";

import { replaceFilePath } from "../../helpers/funcsDOM.js";

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
    //clicked index of the media array
    let currentIndex = null;

    //creating modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const imgScore = document.createElement("span");
    imgScore.classList.add("image-score");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.textContent = "X";
    closeButton.setAttribute("data-type", "close");
    closeButton.setAttribute("tabindex", "0");

    const arrowPrev = document.createElement("span");
    arrowPrev.classList.add("thumb-arrow", "prev");
    arrowPrev.textContent = "<";
    arrowPrev.setAttribute("data-type", "prev");
    arrowPrev.setAttribute("tabindex", "0");

    const arrowNext = document.createElement("span");
    arrowNext.classList.add("thumb-arrow", "next");
    arrowNext.textContent = ">";
    arrowNext.setAttribute("data-type", "next");
    arrowNext.setAttribute("tabindex", "0");

    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container");

    modal.append(imgScore, closeButton, arrowPrev, arrowNext, mediaContainer);

    let clonedMediaItem = null;

    //////// LISTERNERS //////////
    const getPrev = () => {
      const index = currentIndex === 0 ? mediaArr.length - 1 : currentIndex - 1;
      cycleThumbs(index);
    };
    const getNext = () => {
      const index = currentIndex === mediaArr.length - 1 ? 0 : currentIndex + 1;
      cycleThumbs(index);
    };

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

    modal.addEventListener("swiped-left", getPrev);

    modal.addEventListener("swiped-right", getNext);


    return (clickedIndex) => {
      if (!document.body.contains(modal)) {
        document.body.appendChild(modal); // добавляем в body
      }
      //document.body.appendChild(modal);

      cycleThumbs(clickedIndex);
      //adding document listener on each runThumbs, removing document listener on modal.remove()
      document.addEventListener("keydown", handleKey);

    };

    function cycleThumbs(clickedIndex) {
      //the first or next cycle of thumbs...
      if (clickedIndex !== currentIndex) {
        currentIndex = clickedIndex;
        const clickedElem = mediaArr[clickedIndex];
        let imgAlt = null;
        const clonedElem = clickedElem.cloneNode(true);

        if (clonedMediaItem) {
          mediaContainer.removeChild(clonedMediaItem);
        }

        clonedMediaItem = clonedElem;
        clonedMediaItem.classList.add("picture-item");

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

        mediaContainer.appendChild(clonedMediaItem);

        setTimeout(() => {
          clonedMediaItem.style.opacity = "1";
        }, 0);
      }
      else {
        clonedMediaItem.style.opacity = "0";

        setTimeout(() => {
          clonedMediaItem.style.opacity = "1";
        }, 0);
      }

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
    }

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
  }
}


/////// DEV
function log(it, text = "value: ") {
  console.log(text, it);
}