"use strict";

import { replaceFilePath } from "../helpers/funcsDOM.js";

//////// END OF IMPORTS //////////////////

/**
 * Initializes a gallery with thumbnails, allowing users to click on a thumbnail to open a modal with the full-size image.
 *
 * The function listens for clicks on image elements inside the gallery container. When a thumbnail image is clicked,
 * it clones the clicked image (or its parent element) into a modal window, replacing the image source if an auxiliary
 * source is provided. The modal is displayed with smooth transitions, and the user can close it either by clicking
 * outside the image or pressing the "Escape" key.
 *
 * This function requires a valid CSS selector to find the gallery container and optionally allows you to customize
 * the appearance and functionality through an `options` object.
 *
 * @param {string} gallerySelector - The CSS selector for the gallery container.
 * @param {Object} [options={}] - Optional configuration object.
 * @param {string} [options.auxSource=""] - The auxiliary source URL that can be applied to the `src` or `srcset` attributes of the image(s).
 * @param {Object} [options.imageParentStyle={}] - Custom CSS styles to apply to the parent container of the image, such as width, min/max height, opacity, etc.
 *
 * @example
 * // Basic usage with default options
 * initGalleryThumbs('.image-gallery');
 *
 * @example
 * // Usage with custom auxiliary source and styles
 * initGalleryThumbs('.image-gallery', {
 *   auxSource: '/images/full-size/',
 *   imageParentStyle: { width: "70%" }
 * });
 */
/*export function initGalleryThumbs(gallerySelector, options = {}) {
  const container = document.querySelector(gallerySelector);
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error("at initGalleryThumbs: The given 'galleryContainer' is not in the DOM...");
  }

  const auxOptions = {
    auxSource: options.auxSource || "",
    imageParentStyle: {
      boxSizing: "border-box",
      //width: "max(250px, 80%)",
      maxWidth: "100%",
      maxHeight: "100%",
      overflow: "hidden",
      opacity: 0,
      transition: "opacity 1.5s ease",
      ...options.imageParentStyle,
    },
  };

  const pictureStyles = {
    width: "100%",
    //maxWidth: "100%",
    //height: "auto",
    //objectFit: "contain",
    //objectPosition: "top center",
  };

  const modalStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 200,
    padding: "3em 4em",
  };

  let imageParentElem = null;
  //SOURCE implies that the parent element has a tag PICTURE...
  const graphicTags = ["SOURCE", "IMG"];

  container.addEventListener("click", ({ target }) => {
    const parentElement = target.parentElement;

    // Cloning the parent element to preserve the structure of the thumbnail
    const clonedParent = parentElement.cloneNode(true);

    if (clonedParent.tagName === "PICTURE") {
      imageParentElem = document.createElement("div");
      Object.assign(imageParentElem.style, auxOptions.imageParentStyle);
      Object.assign(clonedParent.style, pictureStyles);
      imageParentElem.appendChild(clonedParent);
    } else {
      // If the parent is not a <picture>, then the parent element contains the <img> element
      Object.assign(clonedParent.style, auxOptions.imageParentStyle);
    }

    const graphicsInParent = Array.from(clonedParent.children).filter(isGraphicElement);

    // Iterating over all graphic elements (images or sources) inside the cloned parent element
    graphicsInParent.forEach(child => {
      Object.assign(child.style, pictureStyles);

      // Checking if auxSource is provided, otherwise fallback to the current source
      if (auxOptions.auxSource === "") {
        console.warn('No auxSource provided, falling back to default source.');
      }

      // Replacing the src or srcset with the new base path (if any)
      if (child.srcset) {
        child.srcset = replaceFilePath(child.srcset, auxOptions.auxSource || child.srcset);
      } else if (child.src) {
        child.src = replaceFilePath(child.src, auxOptions.auxSource || child.src);
      } else {
        console.warn(`The element with tagName: ${child.tagName} does not have "src" or "srcset" attributes...`);
      }
    });

    // Create the modal window and append the cloned image or picture element
    const modal = document.createElement("div");
    Object.assign(modal.style, modalStyles);
    modal.appendChild(imageParentElem || clonedParent);

    // Disabling scrolling when modal is open
    document.body.style.overflow = "hidden";

    // Add the modal to the body
    document.body.appendChild(modal);
    const child = modal.firstElementChild;

    setTimeout(() => {
      child.style.opacity = "1";
    }, 0);

    // Cleanup function to remove modal and restore scrolling
    const cleanup = () => {
      modal.remove();
      document.body.style.overflow = "auto";
      document.removeEventListener("click", onCloseModal);
      document.removeEventListener("keydown", onEscape);
    };

    // Close the modal when "Escape" key is pressed
    const onEscape = (e) => {
      if (e.key === "Escape") cleanup();
    };

    // Close the modal when the background (modal itself) is clicked
    const onCloseModal = (e) => {
      if (e.target === modal) cleanup();
    };

    modal.addEventListener("click", onCloseModal);
    document.addEventListener("keydown", onEscape);
  });

  /!**
   * Checks if the given element is a graphic element (either <img> or <source>).
   *
   * @param {HTMLElement} el - The element to check.
   * @returns {boolean} True if the element is a graphic element, false otherwise.
   *!/
  function isGraphicElement(el) {
    return graphicTags.includes(el.tagName);
  }
}*/

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

  const initThumbs = initModal(mediaArr, originPath);

  galleryBlock.addEventListener("click", ({ target }) => {
    const foundIndex = mediaArr.findIndex(item => item === target.parentElement || item === target);
    if (foundIndex === -1) {
      console.warn("at initThumbs: the clicked element is not found in the gallery... omitting click...");
    }
    else {
      initThumbs(foundIndex);
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
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 200,
      padding: "3em 5em",
      overflow: "hidden",
    };
    const containerStyle = {
      boxSizing: "border-box",
      maxWidth: "100%",
      maxHeight: "100%",
      overflow: "hidden",
      opacity: "0",
      transition: "opacity 0.3s ease",
    };
    const pictureStyle = {
      width: "100%",
      //maxWidth: "100%",
    }
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
      width: "2em",
      height: "2em",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      lineHeight: 1,
      backgroundColor: "rgba(255, 255, 255, .4)",
      color: "rgba(255, 255, 255, 1)",
    };
    //clicked index of the media array
    let currentIndex = null;

    //creating modal container
    const modal = document.createElement("div");

    const imgScore = document.createElement("span");
    imgScore.setAttribute("data-type", "imgScore");
    imgScore.setAttribute("tabindex", "0");

    const arrowPrev = document.createElement("span");
    arrowPrev.textContent = "<";
    arrowPrev.setAttribute("data-type", "prev");
    arrowPrev.setAttribute("tabindex", "0");

    const arrowNext = document.createElement("span");
    arrowNext.textContent = ">";
    arrowNext.setAttribute("data-type", "next");
    arrowNext.setAttribute("tabindex", "0");

    const mediaContainer = document.createElement("div");

    Object.assign(modal.style, modalStyle);
    Object.assign(imgScore.style, imgScoreStyle);
    Object.assign(arrowPrev.style, arrowStyle, { left: "0.5em" });
    Object.assign(arrowNext.style, arrowStyle, { right: "0.5em" });
    Object.assign(mediaContainer.style, containerStyle);

    modal.append(imgScore, arrowPrev, arrowNext, mediaContainer);

    let clonedMediaItem = null;

    const runThumbs = (clickedIndex) => {
      if (clickedIndex !== currentIndex) {
        currentIndex = clickedIndex;
        const clickedElem = mediaArr[clickedIndex];

        if (!clonedMediaItem) {
          log("creating and appending the clicked cloneNode...");
          clonedMediaItem = clickedElem.cloneNode(true);
          Object.assign(clonedMediaItem.style, pictureStyle);
          mediaContainer.appendChild(clonedMediaItem);
        }
        else {
          //checking the clonedMediaItem to have the same tagName and the same children structure...
          if (clonedMediaItem.tagName !== clickedElem.tagName || clonedMediaItem.childElementCount !== clickedElem.childElementCount) {
            log("overwriting the clonedNode...");
            //overwriting the appended media item...
            clonedMediaItem = clickedElem.cloneNode(true);
          }
          log("the clicked has the same tag name...");
        }

        if (clickedElem.tagName === "IMG") {
          if (clickedElem.src && clickedElem.src !== "") {
            if (!originPath) {
              console.warn('at initThumbs: No origin path to media is provided, falling back to default source...');
              clonedMediaItem.src = clickedElem.src;
            }
            else {
              clonedMediaItem.src = replaceFilePath(clickedElem.src, originPath);
            }
          }
          else {
            console.warn(`the clicked elem "IMG" at index: ${clickedIndex} has no "src" attribute or it is empty... omitting thumbs...`);
          }
        }
        else if (clickedElem.tagName === "OBJECT") {
          if (clickedElem.hasAttribute("data") && clickedElem.getAttribute("data") !== "") {
            if (!originPath) {
              console.warn('at initThumbs: No origin path to media is provided, falling back to default source...');
              clonedMediaItem.setAttribute("data", clickedElem.getAttribute("data"));
            }
            else {
              const newPath = replaceFilePath(clickedElem.getAttribute("data"), originPath);
              clonedMediaItem.setAttribute("data", newPath);
            }
          }
          else {
            console.warn(`the clicked elem "OBJECT" at index: ${clickedIndex} has no "data" attribute or it is empty... omitting thumbs...`);
          }
        }
        /// processing rest PICTURE, VIDEO, AUDIO elems
        else {
          const children = clickedElem.children;
          const childrenCloned = clonedMediaItem.children;
          if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
              if (children[i].hasAttribute("srcset")) {
                if (children[i].srcset !== "") {
                  if (!originPath) {
                    console.warn('at initThumbs: No origin path to media is provided, falling back to default source...');
                    childrenCloned[i].srcset = children[i].srcset;
                  }
                  else {
                    childrenCloned[i].srcset = replaceFilePath(children[i].srcset, originPath);
                  }
                }
                else {
                  console.warn(`the clicked elem ${clickedElem.tagName} at index: ${clickedIndex} has the child 
                  ${children[i].tagName} at index ${i} with empty "src"...`);
                }
              }
              else if (children[i].hasAttribute("src")) {
                if (children[i].src !== "") {
                  if (!originPath) {
                    console.warn('at initThumbs: No origin path to media is provided, falling back to default source...');
                    childrenCloned[i].src = children[i].src;
                  }
                  else {
                    childrenCloned[i].src = replaceFilePath(children[i].src, originPath);
                  }
                }
                else {
                  console.warn(`the clicked elem ${clickedElem.tagName} at index: ${clickedIndex} has the child 
                  ${children[i].tagName} at index ${i} with empty "src"...`);
                }
              }
              else {
                console.warn(`the clicked elem ${clickedElem.tagName} at index: ${clickedIndex} has the child 
                  ${children[i].tagName} at index ${i} with no "src" or "srcset...`);
              }
            }
          }
          else {
            console.warn(`at initThumbs: the clicked element ${clickedElem.tagName} at index: ${clickedIndex} 
            has no media children... Elements: "PICTURE", "VIDEO", "AUDIO" must have children... omitting thumbs...`);
          }
        }

        //giving the count of the image
        imgScore.textContent = `${clickedIndex + 1} / ${mediaArr.length}`;

        // Disabling scrolling when modal is open
        document.body.style.overflow = "hidden";

        // Add the modal to the body
        document.body.appendChild(modal);

        setTimeout(() => {
          mediaContainer.style.opacity = "1";
        }, 0);
      }
      else {
        log("repeated index...");
        // Disabling scrolling when modal is open
        document.body.style.overflow = "hidden";

        // Add the modal to the body
        document.body.appendChild(modal);

        setTimeout(() => {
          mediaContainer.style.opacity = "1";
        }, 0);
      }
    };

    return runThumbs;
  }
}


/////// DEV
function log(it, text = "value: ") {
  console.log(text, it);
}