"use strict";

import { createElementWithClass, replaceFilePath } from "../../helpers/funcsDOM.js";

//////// END OF IMPORTS //////////////////

/**
 * Initializes a thumbnail gallery with modal functionality.
 * @param {string} gallerySelector - Selector for the gallery container.
 * @param {string|null} [originPath=null] - Base path for media files.
 * @throws {Error} If the gallery container or media elements are not found.
 */
export function initThumbs(gallerySelector, originPath = null) {
	const galleryBlock = document.querySelector(gallerySelector);
	if (!galleryBlock) {
		throw new Error("at initGalleryThumbs: The given 'galleryContainer' is not in the DOM...");
	}

	//for checking media tags
	const queryTags = ["picture", "img", "video", "audio", "object"];
	const mediaArr = Array.from(galleryBlock.querySelectorAll(queryTags.join(", ")));

	//TODO: to use Array.from(galleryBlock.querySelectorAll(queryTags.join(", ")))

	if (!mediaArr.length) {
		console.warn(`at initThumbs: the found mediaArr is empty: ${mediaArr.length}... `);
		return;
	}

	const runThumbs = initModal(mediaArr, originPath);

	galleryBlock.addEventListener("click", ({ target }) => {
		const foundIndex = mediaArr.findIndex(item => item === target.parentElement || item === target);
		if (foundIndex === -1) {
			console.error("at initThumbs: the clicked element is not found in the gallery... omitting click...");
		}
		else {
			document.body.style.overflow = "hidden";
			runThumbs(foundIndex);
		}
	});
}

/**
 * Initializes the modal for the gallery.
 * @param {HTMLElement[]} mediaArr - Array of media elements.
 * @param {string} [originPath=null] - Base path for media files.
 * @returns {Function} Function to run the modal with the clicked index.
 */
function initModal(mediaArr, originPath = null) {
	let currentIndex = null;
	const modalObj = createModal();
	const {
		element,
		mediaContainer,
		imgScore,
	} = modalObj;

	const actions = {
		close: handleEscape,
		prev: getPrev,
		next: getNext,
		Escape: handleEscape,
		ArrowLeft: getPrev,
		ArrowRight: getNext,
	};

	element.addEventListener("click", ({ target }) => {
		const { type } = target.dataset;
		if (type && actions[type]) {
			actions[type]();
		}
	});
	element.addEventListener("swiped-left", getPrev);
	element.addEventListener("swiped-right", getNext);

	return (clickedIndex) => {
		if (!document.body.contains(element)) {
			document.body.appendChild(element);
		}
		cycleThumbs(clickedIndex);
		document.addEventListener("keydown", handleKey);
	};

	function getPrev() {
		const index = currentIndex === 0 ? mediaArr.length - 1 : currentIndex - 1;
		cycleThumbs(index);
	}

	function getNext() {
		const index = currentIndex === mediaArr.length - 1 ? 0 : currentIndex + 1;
		cycleThumbs(index);
	}

	function handleKey(event) {
		if (event.key in actions) {
			actions[event.key]();
		}
	}

	function handleEscape() {
		element.remove();
		document.removeEventListener("keydown", handleKey);
		document.body.style.overflow = "auto";
	}

	function cycleThumbs(clickedIndex) {
		if (clickedIndex === currentIndex) return;

		currentIndex = clickedIndex;
		const clickedElem = mediaArr[clickedIndex];
		const clonedElem = clickedElem.cloneNode(true);
		const imgAlt = getAltText(clickedElem);

		if (modalObj.clonedMediaItem) {
			mediaContainer.removeChild(modalObj.clonedMediaItem);
		}

		modalObj.clonedMediaItem = clonedElem;
		modalObj.clonedMediaItem.classList.add("picture-item");

		updateMediaSources(clickedElem, clonedElem, originPath);

		imgScore.textContent = `${clickedIndex + 1} / ${mediaArr.length}${imgAlt ? `: ${imgAlt}` : ""}`;
		mediaContainer.appendChild(clonedElem);

		setTimeout(() => {
			clonedElem.style.opacity = "1";
		}, 0);
	}
}

function getAltText(element) {
	if (element.hasAttribute("alt")) {
		return element.getAttribute("alt");
	}

	if (element.children.length) {
		for (const child of element.children) {
			if (child.hasAttribute("alt")) {
				//returning the first alt value from a child
				return child.getAttribute("alt");
			}
		}
	}

	return null;
}

function updateMediaSources(sourceElem, targetElem, originPath) {
	const attrMap = {
		IMG: "src",
		SOURCE: "srcset",
		OBJECT: "data",
	};

	const attr = attrMap[sourceElem.tagName];
	if (attr && sourceElem.hasAttribute(attr)) {
		const newSrc = originPath
			? replaceFilePath(sourceElem.getAttribute(attr), originPath)
			: sourceElem.getAttribute(attr);
		targetElem.setAttribute(attr, newSrc);
	}
}

/**
 * Creates a modal element with all necessary child elements.
 * @returns {Object} An object containing the modal element and its children.
 */
function createModal() {
	const modal = createElementWithClass("div", "modal");
	const scoreBar = createElementWithClass("div", "modal__bar");
	const arrowBar = createElementWithClass("div", "modal__bar", "modal__bar--arrow");
	const imgScore = createElementWithClass("span", "modal-score");
	const closeButton = createButton("X", "close");
	const arrowPrev = createButton("<", "prev");
	const arrowNext = createButton(">", "next");
	const mediaContainer = createElementWithClass("div", "media-container");

	scoreBar.append(imgScore, closeButton);
	arrowBar.append(arrowPrev, arrowNext);
	modal.append(scoreBar, arrowBar, mediaContainer);

	return {
		element: modal,
		mediaContainer,
		imgScore,
		clonedMediaItem: null,
	};
}

/**
 * Creates a button element with the specified text and type.
 * @param {string} text - The text content of the button.
 * @param {string} type - The type of the button (e.g., 'close', 'prev', 'next').
 * @returns {HTMLElement} The created button element.
 */
function createButton(text, type) {
	const button = createElementWithClass("span", 'thumb-arrow', type);
	button.textContent = text;
	button.dataset.type = type;
	button.tabIndex = 0;
	return button;
}
