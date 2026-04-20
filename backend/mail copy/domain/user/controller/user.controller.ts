import { Request, Response } from "express";
import { UserService } from "../service/user.service"

export class UserController {
    private _userService = new UserService()
   

    signup = async (req: Request, res: Response) => {
        try {
            let response_data = await this._userService.signupService(req.body);

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