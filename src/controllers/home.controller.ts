import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from 'interfaces/IControllerBase.interface';
import UserRepository from '../data/user.repository';

/**
 * HomeController class for handling the homepage requests and rendering the index page.
 * @implements {IControllerBase}
 */
class HomeController implements IControllerBase {
    public path = '/';
    public router = express.Router();
    private userRepo: UserRepository;

    /**
     * Initializes a new instance of the HomeController class.
     */
    constructor() {
        this.initRoutes();
        this.userRepo = new UserRepository();
    }

    /**
     * Initializes the routes for the HomeController.
     */
    public initRoutes() {
        this.router.get(this.path, this.index);
        this.router.post('/delete/user', this.delete);
    }

    /**
     * Renders the index page with a list of all users.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    index = async (req: Request, res: Response) => {
        const users = await this.userRepo.getAllUsers();

        res.render('index', { users });
    };

    /**
     * Deletes a user from the database and redirects to the home page.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    delete = async (req: Request, res: Response) => {
        if (req.body._method && req.body._method === 'delete') {
            const id = parseInt(req.body.id);
            await this.userRepo.deleteUser(id);
        }
        res.redirect('/');
    };
}

export default HomeController;
