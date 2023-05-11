import * as express from 'express';
import {Prisma} from '@prisma/client';
import {NextFunction, Request, Response} from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import UserRepository from '../data/user.repository';
import * as multer from 'multer';
import {processProfilePicture} from '../utils/imageProcessing';
import authenticationMiddleware from "../middleware/authentication";
import {setAndGetServerHash} from "../utils/setAndGetServerHash";
import {isValidEmail} from "../utils/validation";

const upload = multer();

/**
 * CreateUserController class for handling user creation requests and rendering the create user page.
 * @implements {IControllerBase}
 */
class CreateUserController implements IControllerBase {
    public path = '/create/user';
    public router = express.Router();
    private userRepo: UserRepository;

    /**
     * Initializes a new instance of the CreateUserController class.
     */
    constructor() {
        this.initRoutes();
        this.userRepo = new UserRepository();
    }

    /**
     * Initializes the routes for the CreateUserController.
     */
    public initRoutes() {
        this.router.get(this.path, this.create);
        this.router.post(this.path, upload.single('profile_picture'), this.validateUserCreation, authenticationMiddleware, this.store);
    }

    /**
     * Renders the create user page.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    create = (req: Request, res: Response) => {
        const errorMessage = req.query.errorMessage as string;
        const oldUsername = req.query.username as string;
        const oldEmail = req.query.email as string;

        res.render('create', {errorMessage, oldUsername, oldEmail, serverHash: setAndGetServerHash(req)});
    };

    /**
     * Stores a new user in the database and redirects to the home page.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    store = async (req: Request, res: Response) => {
        const profilePicture = req.file ? await processProfilePicture(req.file.buffer) : null;

        const userData: Prisma.UsersCreateInput = {
            username: req.body.username,
            email: req.body.email,
            profile_picture: profilePicture,
            id: await this.userRepo.getNextId(),
        };

        await this.userRepo.createUser(userData);
        res.render('confirmation', {message: 'User created successfully'});
    };

    /**
     * Middleware function to validate user creation data.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function in the middleware chain.
     */
    private validateUserCreation = (req: Request, res: Response, next: NextFunction) => {
        const {username, email} = req.body;
        const profilePicture = req.file;
        let errorMessage;

        if (!username || username.length < 3 || username.length > 20) {
            errorMessage = 'Invalid username: must be between 3 and 20 characters';
        }

        if (!isValidEmail(email)) {
            errorMessage = 'Invalid email: must be a valid email address';
        }

        if (!profilePicture) {
            errorMessage = 'Invalid profile picture: must be provided';
        }

        if (errorMessage) {
            return res.redirect(`/create/user?errorMessage=${errorMessage}&username=${username}&email=${email}`);
        }

        next();
    };
}

export default CreateUserController;
