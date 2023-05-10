import * as express from 'express'
import {Application} from 'express'
import session = require("express-session");

/**
 * The main application class that initializes and configures an Express app.
 */
class App {
    public app: Application
    public port: number

    /**
     * Constructs a new App instance.
     * @param {Object} appInit - The initialization configuration object.
     * @param {number} appInit.port - The port number to listen on.
     * @param {Array} appInit.middleWares - The array of middleware functions to use.
     * @param {Array} appInit.controllers - The array of controller instances to use.
     */
    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.assets()
        this.template()
    }

    /**
     * Registers the middleware functions and initializes session middleware.
     * @param {Array} middleWares - The array of middleware functions to use.
     */
    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });

        this.app.use(
            session({
                secret: process.env.SESSION_SECRET || 'unsafe-secret',
                resave: false,
                saveUninitialized: true,
            }),
        );
    }

    /**
     * Registers the routes and controllers.
     * @param {Array} controllers - The array of controller instances to use.
     */
    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    /**
     * Configures the static assets directories.
     */
    private assets() {
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))
    }

    /**
     * Sets up the template engine.
     */
    private template() {
        this.app.set('view engine', 'pug')
    }

    /**
     * Starts the Express app and listens for incoming connections on the specified port.
     */
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default App
