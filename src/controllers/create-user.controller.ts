import * as express from 'express';
import {Prisma} from '@prisma/client';
import {Request, Response} from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import UserRepository from '../data/user.repository';
import * as multer from 'multer';
import {processProfilePicture} from '../utils/imageProcessing';

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
        this.router.post(this.path, upload.single('profile_picture'), this.store);
    }

    /**
     * Renders the create user page.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    create = (req: Request, res: Response) => {
        res.render('create');
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
        res.redirect('/');
    };
}

export default CreateUserController;
