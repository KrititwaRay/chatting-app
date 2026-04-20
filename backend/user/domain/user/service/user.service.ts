import { ILogin } from "../interface/user_interface";
import { User } from "../model/user.model";
import jwt, { SignOptions } from "jsonwebtoken";
import { redisClient } from "../../../src/app"; 
export class UserService {


    loginService = async (reqBody: ILogin): Promise<any> => {
        try {

            const { email } = reqBody;


            const rateLimitKey = `otp:ratelimit: ${email}`
            const rateLimit = await redisClient.get(rateLimitKey);

            if (rateLimit) {
                return global.Helpers.rateLimitError(
                    "Too many OTP requests. Please wait before trying again."
                );
            }

            const otp = global.Helpers.generate6digitOtp();
            const otpKey = `otp:${email}`;
            await redisClient.set(otpKey, otp, {
                EX:300
            } )
            await redisClient.set(rateLimitKey, "true", {
                EX: 60
            })

            let user = await User.findOne({ email, isDeleted: false });

            if (!user) {
                user = await User.create({
                    email,
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


}






/* 



 updateProfileDetailsService = async (reqBody: IUpdateProfileDetailsService, loginUser: ILoggedInUser, params: IParamsWithId): Promise<any> => {

        try {

            if (loginUser._id.toString() !== params.id) {
                return global.Helpers.errorFromService("Unauthorized profile update attempt.")
            }

            let updated_data = await User.findByIdAndUpdate(loginUser._id, reqBody, { new: true });

            if (!updated_data) {
                return global.Helpers.errorFromService(
                    "Profile update failed. Please try again later."
                );
            }

            return global.Helpers.successFromService("Data updated successfully.", { updated_data })

        } catch (error) {
            console.log(error)
            return global.Helpers.errorFromService("Something went wrong, please try again later.")
        }
    }


      if (!user) {
                return global.Helpers.notFoundResponse("User not found.")
            }
*/