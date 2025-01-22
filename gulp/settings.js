"use strict";

import TerserPlugin from "terser-webpack-plugin";
import sortMediaQueries from "postcss-sort-media-queries";
import autoprefixer from "autoprefixer";
import discardUnused from "postcss-discard-unused";
import cssnano from "cssnano";
import normalizeWhitespace from "postcss-normalize-whitespace";
import { entries } from "./paths.js";
import { getFilesEntries, getDataFromJSON } from "./utilFuncs.js";

/////////////// END OF IMPORTS /////////////////////////
export const modes = {
    dev: "dev",
    build: "build"
}
const robotsParams = "noindex";
const linkStyles = {
    index: "css/index.min.css",
    gates: "css/index.min.css",
    rollers: "css/index.min.css",
    automation: "css/index.min.css",
    barriers: "css/index.min.css",
    awnings: "css/index.min.css",
    windows: "css/index.min.css",
    security: "css/index.min.css",
}

/**
 * the scripts can be written at the end of the tag <body> omitting writing it in the tag <head>
 * In this case the script links can be empty in the lower linkScripts...
 * @type {{}}
 */
const linkScripts = {
/*    index: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    gates: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    rollers: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    automation: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    barriers: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    awnings: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    windows: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
/*    security: {
        link: "js/index.bundle.js", //this property must exist in linkScripts
        loadMode: "async"   //"differ" this property may not exist in linkScripts
    },*/
}

const pageContentEntries = getFilesEntries("gulp/pagesVersions", "json");
//collecting data from all jsons at 'gulp/pageVersions/'
const pagesContent = Object.keys(pageContentEntries).reduce((acc, lang) => {
    const contentVer = getDataFromJSON(pageContentEntries[lang]);
    for (const pageName of Object.keys(contentVer)) {
        if (contentVer[pageName].hasOwnProperty("head") && linkStyles.hasOwnProperty(pageName)) {
            Object.assign(contentVer[pageName].head, {
                robots: robotsParams,
                linkStyles: linkStyles[pageName],
            })

            if (linkScripts.hasOwnProperty(pageName)) {
                contentVer[pageName].head["linkScripts"] = linkScripts[pageName];
            }
        }
        else {
            console.warn(`at contentVer: no "head" found in ${lang}.json at key: ${pageName} or key: ${pageName} is not found in "linkStyles" object...`);
        }
    }

    acc[lang] = contentVer;
    return acc;
}, {});
export const languages = Object.keys(pageContentEntries);

//it returns the page`s data context with the language version for the gulp-file-include settings
export const setFileIncludeSettings = (lang) => {
    return {
        prefix: "@@",
        basepath: "@file",
        context: {
            pageData: pagesContent[lang]
        }
    }
}

//meta-pagesVersions for the tag <head> in fileIncludeSettings with gulp-file-include
const headParams = {
    index: {
        ua: {
            description: "Терміновий ремонт, автоматизація та встановлення ролет, воріт, маркізів, шлагбаумів і відеоспостереження в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт і встановлення ролет, воріт та шлагбаумів в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт, автоматизация и установка роллет, ворот, маркизов, шлагбаумов и видеонаблюдения в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и установка роллет, ворот, шлагбаумов и видеонаблюдения в Киеве и Киевской области",
        },
        robots: robotsParams,
        root: ".", //some *.html can be nested in src/html/en/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        linkStyles: "css/index.min.css",
        /*        linkScripts: {
            link: "js/index.bundle.js", //this property must exist in linkScripts
            //loadMode: "async"   //"differ" this property may not exist in linkScripts
        }*/
    },
    gates: {
        ua: {
            description: "Терміновий ремонт та встановлення воріт в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт та встановлення воріт в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт и установка ворот в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и установка ворот в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    },
    rollers: {
        ua: {
            description: "Терміновий ремонт та встановлення ролет в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт та встановлення ролет в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт и установка ролет в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и установка ролет в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    },
    automation: {
        ua: {
            description: "Встановлення автоматики воріт та ролет в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Встановлення автоматики воріт та ролет в Києві та Київській області",
        },
        ru: {
            description: "Установка автоматики на ворота и ролеты в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Установка автоматики на ворота и ролеты в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    },
    barriers: {
        ua: {
            description: "Терміновий ремонт та встановлення шлагбаумів в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт та встановлення шлагбаумів в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт и установка шлагбаумов в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и установка шлагбаумов в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    },
    awnings: {
        ua: {
            description: "Терміновий ремонт та встановлення маркіз в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт та встановлення маркіз в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт и установка маркиз и навесов в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и установка маркиз и навесов в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    },
    windows: {
        ua: {
            description: "Терміновий ремонт, та бронювання вікон в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт, та бронювання вікон в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт и бронирование окон в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и бронирование окон в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    },
    security: {
        ua: {
            description: "Терміновий ремонт та встановлення відеокамер в Києві та Київській області. Професійна робота та оперативний сервіс. Замовляйте зараз!",
            title: "Терміновий ремонт та встановлення відеокамер в Києві та Київській області",
        },
        ru: {
            description: "Срочный ремонт и установка видеокамер в Киеве и Киевской области. Профессиональная работа и оперативный сервис. Заказывайте сейчас!",
            title: "Срочный ремонт и установка видеокамер в Киеве и Киевской области",
        },
        robots: robotsParams,
        linkStyles: "css/index.min.css",
        root: ".", //some *.html can be nested in src/html/somePages/ which requires correct path to root: "..", "../.." etc...
        //if the scripts are to be written in the end of body, the property linkScripts may not exits
        /*        linkScripts: {
                    link: "js/index.bundle.js", //this property must exist in linkScripts
                    //loadMode: "async"   //"differ" this property may not exist in linkScripts
                }*/
    }
}
export const fileIncludeSettings = {
    prefix: "@@",
    basepath: "@file",
    context: {
        headParams
    }
};
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



