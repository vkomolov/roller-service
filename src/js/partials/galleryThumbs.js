"use strict";

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
export function initGalleryThumbs(gallerySelector, options = {}) {
  const container = document.querySelector(gallerySelector);
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error("at initGalleryThumbs: The given 'galleryContainer' is not in the DOM...");
  }

  const auxOptions = {
    auxSource: options.auxSource || "",
    imageParentStyle: {
      width: "50%",
      minWidth: "250px",
      maxHeight: "80%",
      boxSizing: "border-box",
      overflow: "hidden",
      opacity: 0,
      transition: "opacity 1.5s ease",
      ...options.imageParentStyle,
    },
  };

  const pictureStyles = {
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
    objectPosition: "50% 50%",
    verticalAlign: "center",
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
    overflow: "hidden",
  };

  let imageParentElem = null;
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
    const child = modal.children[0];

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

  /**
   * Checks if the given element is a graphic element (either <img> or <source>).
   *
   * @param {HTMLElement} el - The element to check.
   * @returns {boolean} True if the element is a graphic element, false otherwise.
   */
  function isGraphicElement(el) {
    return graphicTags.includes(el.tagName);
  }

  /**
   * Replaces the file path of the given URL with a new base path.
   *
   * @param {string} url - The original URL (either `src` or `srcset`).
   * @param {string} newBase - The new base URL to prepend.
   * @returns {string} The updated URL with the new base path.
   */
  function replaceFilePath(url, newBase) {
    const match = url.match(/([^/]+\.\w+(\s\d+x)?)$/); // Find the file name with extension and parameters (if any)

    if (match) {
      const fileNameWithExt = match[0]; // File name with extension (and possible parameters)
      const cleanBase = newBase.replace(/^\/+|\/+$/g, ''); // Removing leading and trailing slashes

      return `${cleanBase}/${fileNameWithExt}`;
    }

    return url; // If no match is found, return the original URL
  }
}

/////// DEV
function log(it, text = "value: ") {
  console.log(text, it);
}