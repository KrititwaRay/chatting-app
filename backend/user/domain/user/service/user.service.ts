import { ILogin } from "../interface/user_interface";
import { User } from "../model/user.model";
import jwt, { SignOptions } from "jsonwebtoken";

export class UserService {


    loginService = async (reqBody: ILogin): Promise<any> => {
        try {

            const { email, name, image } = reqBody;

            let user = await User.findOne({ email, isDeleted: false });

            if (!user) {
                user = await User.create({
                    email,
                    name,
                    image,
                    isDeleted: false

                })
            }

            let token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN as string
                } as SignOptions
            );

            return global.Helpers.successFromService("User loggedin successfully.", {
                user,
                token
            })
        } catch (error) {

            return global.Helpers.errorFromService("Something went wrong, please try again later.")

        }
    }

    profileDetailsService = async (reqBody: any): Promise<any> => {

        try {
            const user = await User.findOne({
                _id: reqBody._id,
                isDeleted: false
            }).select("-createdAt -updatedAt");

            if (!user) {
                return global.Helpers.notFoundResponse("User not found.")
            }
            return global.Helpers.successFromService("Data fetched successfully.", user)

        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")
        }
    }

}