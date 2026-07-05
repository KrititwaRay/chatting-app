import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { AuthenticatedRequest } from "../../../helper/common_middleware";
import { ILoginUser } from "../interface/user_interface";



export class UserController {
    private _userService = new UserService()


    login = async (req: Request, res: Response) => {
        try {

            let response_data = await this._userService.loginService(req.body);

            if (response_data.status) {
                return global.Helpers.successResponse(res, response_data.data_sets, response_data.message);
            } else {
                return global.Helpers.sendBadRequest(res, response_data.message);
            }
        } catch (error) {
            return global.Helpers.sendBadRequest(res, 'Something went wrong. Please try again.')
        }

    }

    verifyUser = async (req: Request, res: Response) => {
        try {
            const response_data = await this._userService.verifyUser(req.body)
            if (response_data.status) {
                return global.Helpers.successResponse(res, response_data.data_sets, response_data.message);
            } else {
                return global.Helpers.sendBadRequest(res, response_data.message);
            }
        } catch (error) {
            return global.Helpers.sendBadRequest(res, 'Something went wrong. Please try again.')
        }
    }
    

    userProfile = async (req: Request, res: Response) => {
        try {

            const loginUser = (req as AuthenticatedRequest).user;

            const response_data = await this._userService.userProfile(loginUser as ILoginUser);

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


