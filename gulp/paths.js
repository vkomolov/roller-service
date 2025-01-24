"use strict";

import path from "path";
import { getFilesEntries } from "./utilFuncs.js";

/**
 * As all *.js files are treated as ES modules (package.json contains "type": "module"),
 * we get the Node current working directory with process.cwd...
 * Finally, we use path.resolve to construct the absolute path of the src and dist directories
 * relative to the current working directory process.cwd.
 * @type {string}
 */
const curWD = process.cwd();
//import * as nodePath from "path";
const rootFolder = path.basename(path.resolve());

const srcPath = path.resolve(curWD, "src");
const distPath = path.resolve(curWD, "dist");
const tempPath = path.resolve(srcPath, "temp");
export const pathData = {
    rootFolder,
    srcPath,
    distPath,
    tempPath,
    ftp: "",
    src: {
        html: `${ srcPath }/html/*.html`,
        styles: `${ srcPath }/scss/*.scss`,   //root *.scss, connected to html (for build tasks)
        js: `${ srcPath }/js/*.js`,
        img: [
            `${ srcPath }/assets/img/**/*.{jpg,jpeg,png,svg,gif,webp,avif,ico}`,
            `!${ srcPath }/assets/img/svgIcons/mono/**/*`,
            `!${ srcPath }/assets/img/svgIcons/multi/**/*`
        ],
        svgIconsMono: [
            `${ srcPath }/assets/img/svgIcons/mono/**/*.svg`
        ],
        svgIconsMulti: [
            `${ srcPath }/assets/img/svgIcons/multi/**/*.svg`
        ],
        fonts: `${ srcPath }/assets/fonts/**/*.{eot,woff,woff2,ttf,otf}`,
        data: `${ srcPath }/assets/data/**/*.{json, pdf, xml}`,
        zipDist: `${ distPath }/**/*.*`,
        zipProject: [
            '!node_modules/**/*',
            '!dist/**/*',
            '**/*.*'
        ]
    },
    build: {
        html: `${ distPath }/html`,
        styles: `${ distPath }/css`,
        js: `${ distPath }/js`,
        img: `${ distPath }/assets/img`,
        svgIcons: `${ distPath }/assets/img/svgIcons`,
        fonts: `${ distPath }/assets/fonts`,
        data: `${ distPath }/assets/data`,
        zipProject: distPath,
        zipDist: "./"
    },
    watch: {
        htmlNested: [
            `${ srcPath }/html/**/*.html`,
        ],
        stylesNested: [
            `${ srcPath }/scss/**/*.scss`,
            `${ srcPath }/js/modulesPack/**/scss/*.scss`,
        ],
        jsNested: [
            `${ srcPath }/js/**/*.js`,
            `${ srcPath }/js/modulesPack/**/*.js`,
        ],
        img: [
            `${ srcPath }/assets/img/**/*.{jpg,jpeg,png,svg,gif,webp,avif,ico}`,
            `!${ srcPath }/assets/img/svgIcons/mono/**/*`,
            `!${ srcPath }/assets/img/svgIcons/multi/**/*`
        ],
        svgIconsMono: [
            `${ srcPath }/assets/img/svgIcons/mono/**/*.svg`
        ],
        svgIconsMulti: [
            `${ srcPath }/assets/img/svgIcons/multi/**/*.svg`
        ],
        fonts: `${ srcPath }/assets/fonts/**/*.{eot,woff,woff2,ttf,otf}`,
        data: `${ srcPath }/assets/data/**/*.{json, pdf, xml}`,
    },
    clean: [
        distPath,
        `./${ rootFolder }.zip`,
        tempPath,
    ],
}
export const entries = {
    js: getFilesEntries(path.resolve(pathData.srcPath, "js"), "js"),
/*    js: {
        index: `${ pathData.srcPath }/js/index.js`,

    },*/
}

/////// DEV
function log(it, text = "value: ") {
    console.log(text, it);
}