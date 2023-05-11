import * as express from 'express';
import * as session from 'express-session';
import App from "../src/app";

jest.mock('express', () => {
    return Object.assign(() => {
        return {
            use: jest.fn(),
            set: jest.fn(),
            listen: jest.fn()
        };
    }, {
        static: jest.fn(),
    });
});


jest.mock('express-session', () => {
    return jest.fn();
});

describe('App', () => {
    let app: App;
    let middlewares: any[];
    let controllers: any[];
    let expressApp: express.Application;

    beforeEach(() => {
        middlewares = [jest.fn(), jest.fn()];
        controllers = [{router: jest.fn()}, {router: jest.fn()}];
        app = new App({
            port: 3000,
            middleWares: middlewares,
            controllers: controllers,
        });
        expressApp = app.app as jest.Mocked<express.Application>;
    });

    it('should register middlewares', () => {
        expect(expressApp.use).toHaveBeenCalledTimes(middlewares.length + controllers.length + 3);
        middlewares.forEach((middleware, index) => {
            expect(expressApp.use).toHaveBeenNthCalledWith(index + 1, middleware);
        });
        expect(expressApp.use).toHaveBeenNthCalledWith(middlewares.length + 1, session());
        expect(express.static).toHaveBeenCalledTimes(2);
        expect(express.static).toHaveBeenNthCalledWith(1, 'public');
        expect(express.static).toHaveBeenNthCalledWith(2, 'views');
    });


    it('should register controllers', () => {
        controllers.forEach((controller, _) => {
            expect(expressApp.use).toHaveBeenCalledWith('/', controller.router);
        });
    });

    it('should set up the template engine', () => {
        expect(expressApp.set).toHaveBeenCalledWith('view engine', 'pug');
    });
});
