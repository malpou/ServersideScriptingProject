/**
 * Interface for defining the base structure of controllers in the application.
 * @interface
 */
interface IControllerBase {
    /**
     * Initializes the routes for the controller.
     * @returns {any} The result of the route initialization.
     */
    initRoutes(): any
}

export default IControllerBase;
