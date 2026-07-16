import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => globalThis.Helpers.methodNotAllowed(res, 'Method not allowed');


import { ChatMiddleware } from "../middleware/chat.middleware";
const chatMiddleware = new ChatMiddleware();


import { CommonMiddleware } from '../../../helper/common.middleware'; 
const commonMiddleware = new CommonMiddleware();

let middleware: any[] = [];


import { ChatController } from "../controller/chat.controller";
const chatController = new ChatController();

middleware = [
    commonMiddleware.isAuthenticated,
    chatMiddleware.createNewChatRule(),
    commonMiddleware.checkErrors
]
router
    .route('/new')
    .post(middleware, chatController.createNewChat)
    .all(methodNotAllowed)


middleware = [
    commonMiddleware.isAuthenticated,
    commonMiddleware.checkErrors
]
router
    .route('/all')
    .get(middleware, chatController.getAllChats)
    .all(methodNotAllowed)

export const chat_routing = router;