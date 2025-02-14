"use strict";

import TerserPlugin from "terser-webpack-plugin";
import sortMediaQueries from "postcss-sort-media-queries";
import autoprefixer from "autoprefixer";
import discardUnused from "postcss-discard-unused";
import cssnano from "cssnano";
import normalizeWhitespace from "postcss-normalize-whitespace";
import { entries } from "./paths.js";
import { getDataFromJSON, getFilesEntries, getMetaTag } from "./utilFuncs.js";
import { getMatchedFromArray } from "../src/js/helpers/funcs.js";

/////////////// END OF IMPORTS /////////////////////////

////////////// INITIAL SETTINGS ///////////////////////
export const modes = {
    dev: "dev",
    build: "build"
}
const robotsParams = "noindex";
const linkStyles = {
    index: ["./css/index.min.css"],
    gates: ["./css/index.min.css"],
    rollers: ["./css/index.min.css"],
    automation: ["./css/index.min.css"],
    barriers: ["./css/index.min.css"],
    awnings: ["./css/index.min.css"],
    windows: ["./css/index.min.css"],
    security: ["./css/index.min.css"],
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

export const languages = Object.keys(pageJsonEntries);

//what languages are to be canonical... checking if they exist in the const languages...
const metaCanonical = getMatchedFromArray(languages, ["ua", "ru"]);

////////////// END OF INITIAL SETTINGS ///////////////////////

//collecting data from all jsons at 'gulp/pageVersions/'
const processPageHead = (contentVer, pageName, lang) => {
    if (!contentVer[pageName].hasOwnProperty("head") || !linkStyles.hasOwnProperty(pageName) || !Array.isArray(linkStyles[pageName])) {
        console.error(`at contentVer: no "head" found in ${lang}.json at key: ${pageName} or key: ${pageName} is not found in "linkStyles" object...`);
        return;
    }

    Object.assign(contentVer[pageName].head, {
        robots: robotsParams,
        linkStyles: linkStyles[pageName].map(styleHref => {
            return getMetaTag({ type: "stylesheet", dataSrc: styleHref });
        }).join('\n'),
        /*linkStyles: linkStyles[pageName].map(styleHref => {
            return `<link rel="stylesheet" href="${styleHref}">`
        }).join('\n'),*/
    });

    if (linkScripts.hasOwnProperty(pageName) && Array.isArray(linkScripts[pageName])) {
        contentVer[pageName].head["linkScripts"] = linkScripts[pageName].map(scriptObj => {
            const loadMode = scriptObj.loadMode || "";
            return getMetaTag({ type: "script", dataSrc: scriptObj.link, loadMode });
        }).join("\n");
    }

    // for writing canonical meta-links
    if (metaCanonical.length && metaCanonical.includes(lang)) {
        contentVer[pageName].head.canonical = `<link rel="canonical" href="${rootUrl}/${lang}/${pageName}.html">`;
    }

    if (languages.length) {
        contentVer[pageName].head.alternates = languages.map(lang => {
            return `<link rel="alternate" href="${rootUrl}/${lang}/${pageName}.html" hreflang="${lang}">`;
        }).join("\n");
    }
};
const processPageHeader = () => {};
const processPageMain = () => {};
const processPageFooter = () => {};

const pagesContent = Object.keys(pageJsonEntries).reduce((acc, lang) => {
    const contentVer = getDataFromJSON(pageJsonEntries[lang]);

    Object.keys(contentVer).forEach(pageName => {
        processPageHead(contentVer, pageName, lang);
    });

    acc[lang] = contentVer;
    return acc;
}, {});

//it returns the page`s data context with the language version for the gulp-file-include settings
export const setFileIncludeSettings = (lang) => {
    return {
        prefix: "@@",
        basepath: "@file",
        context: {
            data: pagesContent[lang],
        }
    }
}
export const beautifySettings = {
    html: {
        //indent_size: 2,
        //indent_char: ' ',
        indent_with_tabs: true,
        preserve_newlines: false,
        //max_preserve_newlines: 0,
        //wrap_line_length: 80,
        //extra_liners: ['head', 'body', '/html']
    }
}
export const optimizeCss = [
    sortMediaQueries({
        sort: "mobile-first"
    }),
    autoprefixer(),
    discardUnused({}),
    cssnano({
        preset: [
            "default",
            {
                normalizeWhitespace: false //avoiding compressing css file
            }
        ]
    })
];
export const minifyCss = [
    normalizeWhitespace(),
];
export const useGulpSizeConfig = (params = {}) => {
    return Object.assign({
        showFiles: true,
        pretty: true,
        showTotal: false,
        gzip: false,
    }, params);
};
export const webpackConfigJs = {
    dev: {
        mode: "development",
        devtool: 'source-map',
        entry: {
            ...entries.js,
        },
        output: {
            filename: "[name].bundle.js",
            //path: pathData.build.js,  //will be piped to gulp.dest with the path: pathData.build.js
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        { "modules": false, }
                                    ]
                                ],
                                plugins: [
                                    "@babel/plugin-transform-runtime",
                                    "@babel/plugin-transform-classes",
                                ],
                            },
                        },
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader"
                    ],
                },
            ],
        },
    },
    build: {
        mode: "production",
        entry: {
            ...entries.js,
        },
        output: {
            filename: "[name].bundle.js",
            //path: pathData.build.js,  //will be piped to gulp.dest with the path: pathData.build.js
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        { "modules": false, }
                                    ]
                                ],
                                plugins: [
                                    "@babel/plugin-transform-runtime",
                                    "@babel/plugin-transform-classes",
                                ],
                            },
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader"
                    ],
                },
            ],
        },
    }
}
export const svgoSpriteOptions = {
    mono: {
        plugins: [
            {
                name: "removeAttrs",
                params: {
                    attrs: ["class", "pagesVersions-name", "fill", "stroke.*"], //"stroke.*" removing all stroke-related attributes
                },
            },
            {
                name: "removeDimensions", // it removes width and height
            }
        ]
    },
    multi: {
        plugins: [
            {
                name: "removeAttrs",
                params: {
                    attrs: ["class", "pagesVersions-name"],
                },
            },
            {
                name: "removeDimensions", // it removes width and height
            },
            {
                name: "removeUselessStrokeAndFill",
                active: false,
            },
            {
                name: "inlineStyles",
                active: true,
            }
        ]
    }
};



