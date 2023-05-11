import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import UserRepository from '../data/user.repository';
import * as multer from 'multer';
import {processProfilePicture} from '../utils/imageProcessing';
import {Users} from "@prisma/client";
import authenticationMiddleware from "../middleware/authentication";
import {setAndGetServerHash} from "../utils/setAndGetServerHash";
import {isValidEmail} from "../utils/validation";

const upload = multer();

/**
 * EditUserController class for handling user edit requests and rendering the edit user page.
 * @implements {IControllerBase}
 */
class EditUserController implements IControllerBase {
    public path = '/edit/user';
    public router = express.Router();
    private userRepo: UserRepository;

    /**
     * Initializes a new instance of the EditUserController class.
     */
    constructor() {
        this.initRoutes();
        this.userRepo = new UserRepository();
    }

    /**
     * Initializes the routes for the EditUserController.
     */
    public initRoutes() {
        this.router.get(this.path, this.edit);
        this.router.post(this.path, upload.single('profile_picture'), this.validateUserUpdate, authenticationMiddleware, this.update);
    }

    /**
     * Renders the edit user page for a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    edit = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id as string);
        const errorMessage = req.query.errorMessage as string;
        const user = await this.userRepo.getUserById(id);

        res.render('edit', {user, errorMessage, serverHash: setAndGetServerHash(req)});
    };

    /**
     * Updates a user in the database with the provided data and redirects to the home page.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    update = async (req: Request, res: Response) => {
        const id = parseInt(req.body.id);

        const userData: Partial<Users> = {
            username: req.body.username,
            email: req.body.email,
        };

        if (req.file) {
            userData.profile_picture = await processProfilePicture(req.file.buffer);
        }

        await this.userRepo.updateUser(id, userData);
        res.render('confirmation', {message: 'User has been successfully updated'});
    };

    /**
     * Middleware function to validate user update data.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function in the middleware chain.
     */
    private validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
        const {username, email, id} = req.body;
        let errorMessage;

        if (!username || username.length < 3 || username.length > 20) {
            errorMessage = 'Invalid username: must be between 3 and 20 characters';
        }

        if (!isValidEmail(email)) {
            errorMessage = 'Invalid email: must be a valid email address';
        }

        if (errorMessage) {
            return res.redirect('/edit/user?id=' + id + '&errorMessage=' + errorMessage);
        }

        next();
    };
}

export default EditUserController;
