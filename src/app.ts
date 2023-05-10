/**
 * @fileoverview This module defines the App class, which sets up an Express
 * application with configurable middleware, controllers, and assets.
 * @module app
 * @requires express
 * @requires express.Application
 */

import * as express from 'express';
import { Application } from 'express';

/**
 * @class
 * @classdesc The App class sets up an Express application, taking in middleware,
 * controllers, and a port number to listen on.
 */
class App {
    public app: Application;
    public port: number;

    /**
     * @constructor
     * @param {Object} appInit - The configuration object for the application.
     * @param {number} appInit.port - The port number on which the application will listen.
     * @param {Array} appInit.middleWares - An array of middleware functions to be applied to the application.
     * @param {Array} appInit.controllers - An array of controller objects to define routes for the application.
     */
    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express();
        this.port = appInit.port;

        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
        this.assets();
        this.template();
    }

    /**
     * @private
     * @method middlewares - Apply middleware functions to the application.
     * @param {Array} middleWares - An array of middleware functions.
     */
    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }

    /**
     * @private
     * @method routes - Set up routes for the application using the provided controllers.
     * @param {Array} controllers - An array of controller objects.
     */
    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }

    /**
     * @private
     * @method assets - Serve static assets for the application.
     */
    private assets() {
        this.app.use(express.static('public'));
        this.app.use(express.static('views'));
    }

    /**
     * @private
     * @method template - Set the template engine for the application.
     */
    private template() {
        this.app.set('view engine', 'pug');
    }

    /**
     * @public
     * @method listen - Start the application listening on the specified port.
     */
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    }
}

export default App;
