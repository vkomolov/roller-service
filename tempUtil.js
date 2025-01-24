"use strict";

import { setFileIncludeSettings } from "./gulp/settings.js";
import { getFilesEntries } from "./gulp/utilFuncs.js";

//const {context} = setFileIncludeSettings("ru");
//console.log("setFileIncludeSettings: ", setFileIncludeSettings("ru"));
console.log(getFilesEntries("dist/html/ru", "html"));