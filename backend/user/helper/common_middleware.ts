import { validationResult } from "express-validator";
import { successResponse } from "./common_interface";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// export interface IJwtPayload {
//     _id: string;
//     iat?: number;
//     exp?: number;
// }

export interface AuthenticatedRequest extends Request {
    user?: object | null
}

export class CommonMiddleware {
    constructor() { }

    isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return global.Helpers.notAuthorized(res, "Access denied. Authorization token is missing or invalid. Please login.");
            }

            const token = authHeader.split(" ")[1];

            const decodedValue = jwt.verify(
                token as string,
                process.env.JWT_SECRET as string  // <-- fix
            ) as JwtPayload;

            if (!decodedValue || !decodedValue._id) {
                return global.Helpers.notAuthorized(res, "Access denied. Please login.");
            }

            req.user = decodedValue;

            next();
             
        } catch (error) {
            return global.Helpers.sendBadRequest(res, 'Something went wrong. Please try again.')
        }
    };


    checkErrors = async (req: object, res: successResponse, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            let response_status: { [key: string]: any } = {};
            let response_dataset = {};
            let response_data: { [key: string]: any } = {};
            let errorVal = errors.array();
            response_dataset = errors.array();

            let msg = errorVal[0]?.msg || '';
            response_status.msg = msg.toLowerCase();
            response_status.msg = response_status.msg.charAt(0).toUpperCase() + response_status.msg.slice(1);

            response_status.action_status = false;
            response_data.data = response_dataset;
            response_data.status = response_status;


            res.send({ response: response_data });
        } else {
            next()
        }
    }
}

