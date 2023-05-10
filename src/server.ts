import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

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
    ],
});

app.listen();

// TODO 1: Styling the app
// DONE 2: Add server-side validation
// DONE 3: Add client-side validation
// TODO 4: Add error handling
// TODO 5: Add tests
// DONE 6: Add authentication
// TODO 7: Add typedoc documentation
// TODO 8: Deploy to render.com
// TODO 9: Add authentication with passport.js
