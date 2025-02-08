"use strict";

import sync from "browser-sync";

/**
 * @class
 * @classdesc Local server with methods to reload the page or update changes without reloading.
 */
export default class BrowserSync {
    /**
     * @param {Object} options - Server settings
     * @param {string|Array<string>} [options.baseDir="dist/"] - Server root directory
     * @param {string} [options.startPath="index.html"] - Initial path when starting the server
     * @param {boolean} [options.open=true] - Auto open browser
     * @param {boolean} [options.notify=true] - Show BrowserSync notifications
     * @param {boolean} [options.noCacheHeaders=true] - Disable caching
     */
    constructor({
                    baseDir = "dist/",
                    startPath = "index.html",
                    open = true,
                    notify = true,
                    noCacheHeaders = true
                } = {}) {
        this.baseDir = Array.isArray(baseDir) ? baseDir : [baseDir];
        this.startPath = startPath;
        this.open = open;
        this.notify = notify;
        this.middleware = noCacheHeaders ? [this._setNoCacheHeaders] : [];
        this.browserSync = sync.create();
        this.hasStarted = false;

        // Bind methods to the current class context
        this.start = this.start.bind(this);
        this.stream = this.stream.bind(this);
        this.reload = this.reload.bind(this);
    }

    /**
     * Middleware to disable caching
     * @private
     */
    _setNoCacheHeaders(req, res, next) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        next();
    }

    /**
     * Starting BrowserSync
     * @returns {Promise<void>}
     */
    async start() {
        if (!this.hasStarted) {
            await this.browserSync.init({
                server: {
                    baseDir: this.baseDir,
                },
                startPath: this.startPath,
                middleware: this.middleware,
                open: this.open,
                notify: this.notify,
            });
            this.hasStarted = true;
        }
    }

    /**
     * Обновление страницы с перезагрузкой
     * @returns {Promise<void>}
     */
    async reload() {
        if (!this.hasStarted) {
            await this.start();
        }
        this.browserSync.reload();
    }

    /**
     * Обновление страницы без перезагрузки (live reload)
     * @returns {Promise<void>}
     */
    async stream() {
        if (!this.hasStarted) {
            await this.start();
        }
        this.browserSync.stream();
    }
}