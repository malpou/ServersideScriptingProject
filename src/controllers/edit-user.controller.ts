import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import UserRepository from '../data/user.repository';
import * as multer from 'multer';
import { processProfilePicture } from '../utils/imageProcessing';
import { Users } from "@prisma/client";

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
        this.router.post(this.path, upload.single('profile_picture'), this.update);
    }

    /**
     * Renders the edit user page for a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    edit = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id as string);
        const user = await this.userRepo.getUserById(id);

        res.render('edit', { user });
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
        res.redirect('/');
    };
}

export default EditUserController;
