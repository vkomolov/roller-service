"use strict";

import { getDataFromJSON, getFilesEntries } from "./gulp/utilFuncs.js";
import { getMatchedFromArray } from "./src/js/helpers/funcs.js";

const robotsParams = "noindex";
const linkStyles = {
	index: "./css/index.min.css",
	gates: "./css/index.min.css",
	rollers: "./css/index.min.css",
	automation: "./css/index.min.css",
	barriers: "./css/index.min.css",
	awnings: "./css/index.min.css",
	windows: "./css/index.min.css",
	security: "./css/index.min.css",
}

/**
 * the scripts can be written at the end of the tag <body> omitting writing it in the tag <head>
 * In this case the script links can be empty in the lower linkScripts...
 * @type {{}}
 */
const linkScripts = {
	/*    index: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    gates: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    rollers: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    automation: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    barriers: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    awnings: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    windows: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
	/*    security: [
					{
							link: "./js/index.bundle.js", //this property must exist in linkScripts
							loadMode: "async"   //"differ" this property may not exist in linkScripts
					},
			],*/
}

//base root url at the server... example: "https://example.com"
const rootUrl = "https://example.com"

const pageJsonEntries = getFilesEntries("src/assets/data/pagesVersions", "json");
const languages = Object.keys(pageJsonEntries);

//what languages are to be canonical... checking if they exist in the const languages...
const metaCanonical = getMatchedFromArray(languages, ["ua", "ru"]);

const pagesDataRuVer = getDataFromJSON(pageJsonEntries["ru"]);
const indexDataRuVer = pagesDataRuVer["index"];
const indexHeadData = indexDataRuVer["head"];


/*console.log(getMetaLink({
	type: "script",
	dataSrc: "./js/index.bundle.js",
	loadMode: "async",
	some: "someStr",
	another: "anotherStr"
}))*/

/*const getDataHead = (originHeadData, {
	linkStyles: [],
	linkScripts: [],
	robotsParams: null,
}) => {

};*/

//console.log(indexHeadData);
//console.log("pagesDataRuVer: ", pagesDataRuVer);



/*const pagesData = Object.keys(pageJsonEntries).reduce((acc, lang) => {
	const pagesDataLangVer = getDataFromJSON(pageJsonEntries[lang]);
	console.log("dataLangVer: ", dataLangVer);

	const getDataHead = () => {
		if (!pagesDataLangVer[pageName].hasOwnProperty("head") || !linkStyles.hasOwnProperty(pageName)) {
			console.error(`at contentVer: no "head" found in ${lang}.json at key: ${pageName} or key: ${pageName} is not found in "linkStyles" object...`);
			return;
		}
	};

	Object.keys(pagesDataLangVer).forEach(pageName => {

	});

	const dataHead = getDataHead();
	const dataHeader = {};
	const dataMain = {};
	const dataFooter = {};

	acc[lang] = Object.assign({}, dataHead, dataHeader, dataMain, dataFooter);
	return acc;
}, {});*/

//console.log("pagesData: ", pagesData);