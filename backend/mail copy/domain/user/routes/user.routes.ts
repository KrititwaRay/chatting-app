import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => globalThis.Helpers.methodNotAllowed(res, 'Method not allowed');


import { UserMiddleware } from "../middleware/user.middleware";
const userMiddleware = new UserMiddleware();


import { CommonMiddleware } from '../../../helper/common.middleware'; 
const commonMiddleware = new CommonMiddleware();

let middleware: any[] = [];


import { UserController } from "../controller/user.controller";
const userController = new UserController();

middleware = [
    userMiddleware.signupValidationRule(),
    commonMiddleware.checkErrors
]
router
    .route('/signup')
    .post(middleware, userController.signup)
    .all(methodNotAllowed)

export const user_routing = router;