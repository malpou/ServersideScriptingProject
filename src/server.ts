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

// DONE 1: Styling the app
// DONE 2: Add server-side validation
// DONE 3: Add client-side validation
// DONE 4: Add error handling
// TODO 5: Add controller tests
// DONE 6: Add authentication
// DONE 7: Add typedoc documentation
// DONE 8: Deploy to render.com
// TODO 9: Add authentication with passport.js
// DONE 10: Alert users when they are deleting a user
// DONE 11: Add a confirmation page when a user is deleted that redirects to the home page after 5 seconds
// DONE 12: Add image preview when creating a user
// DONE 13: Fix bug that chrashes the app then email witout .dk is entered on edit user page
// TODO 14: On edit user page, if the user does not exist, redirect to the home page
// TODO 15: Persist data when editing or creating a user and the validation fails
