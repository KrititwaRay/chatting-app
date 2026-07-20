import { Request, Response } from "express";
import { ChatService } from "../service/chat.service"
import { AuthenticatedRequest } from "../../../helper/common.middleware";

export class ChatController {
    private _chatService = new ChatService()
   

    createNewChat = async (req: Request, res: Response) => {
        try {
              const loginUser = (req as AuthenticatedRequest).user;
            
            let response_data = await this._chatService.createNewChat(req.body, loginUser);

            if (response_data.status) {
                return global.Helpers.successResponse(res, response_data.data_sets, response_data.message);
            } else {
                return global.Helpers.sendBadRequest(res, response_data.message);
            }
        } catch (error) {
            return global.Helpers.sendBadRequest(res, 'Something went wrong. Please try again.')
        }

    }
    getAllChats = async (req: Request, res: Response) => {
        try {
            
            const loginUser = (req as AuthenticatedRequest).user;
    
            const token = req.headers.authorization;

            if (!token || !token.startsWith("Bearer ")) {
                return global.Helpers.notAuthorized(res, "Access denied. Authorization token is missing or invalid. Please login.");
            }

            let response_data = await this._chatService.getAllChats( loginUser, token);

            if (response_data.status) {
                return global.Helpers.successResponse(res, response_data.data_sets, response_data.message);
            } else {
                return global.Helpers.sendBadRequest(res, response_data.message);
            }
        } catch (error) {
            return global.Helpers.sendBadRequest(res, 'Something went wrong. Please try again.')
        }

    }
    sendMessage = async (req: Request, res: Response) => {
        try {
            
            const loginUser = (req as AuthenticatedRequest).user;
    
            // const token = req.headers.authorization;

            // if (!token || !token.startsWith("Bearer ")) {
            //     return global.Helpers.notAuthorized(res, "Access denied. Authorization token is missing or invalid. Please login.");
            // }

            let response_data = await this._chatService.sendMessage( loginUser, req.body,  req.files as Express.Multer.File[] | undefined);

            if (response_data.status) {
                return global.Helpers.successResponse(res, response_data.data_sets, response_data.message);
            } else {
                return global.Helpers.sendBadRequest(res, response_data.message);
            }
        } catch (error) {
            return global.Helpers.sendBadRequest(res, 'Something went wrong. Please try again.')
        }

    }
}