import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';
import errorHandler from "./middleware/error";

import HomeController from './controllers/home.controller';
import EditUserController from "./controllers/edit-user.controller";
import CreateUserController from "./controllers/create-user.controller";

const app = new App({
    port: 5000,
    controllers: [
        new HomeController(),
        new EditUserController(),
        new CreateUserController(),
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({extended: true}),
        loggerMiddleware,
        errorHandler,
    ],
});

app.listen();
