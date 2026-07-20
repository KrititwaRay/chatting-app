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

import { upload } from '../../../configuration/multer';

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


// Need to modify validation. cloudinary
middleware = [
    commonMiddleware.isAuthenticated,
    upload.array("media", 10),
    chatMiddleware.sendMessageRule(),
    commonMiddleware.checkErrors
]
router
    .route('/message')
    .post(middleware, chatController.sendMessage)
    .all(methodNotAllowed)


middleware = [
    commonMiddleware.isAuthenticated,
    chatMiddleware.getMessagesByChatRule(),
    commonMiddleware.checkErrors
]
router
    .route('/message/:chatId')
    .get(middleware, chatController.getMessagesByChat)
    .all(methodNotAllowed)

export const chat_routing = router;