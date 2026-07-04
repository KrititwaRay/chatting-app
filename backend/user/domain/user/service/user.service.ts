import { ILogin, IVerifyUser } from "../interface/user_interface";
import { User } from "../model/user.model";
import jwt, { SignOptions } from "jsonwebtoken";
import { redisClient } from "../../../src/app";
import { publishToQueue } from "../../../configuration/rabbitmq";
export class UserService {


    loginService = async (reqBody: ILogin): Promise<any> => {
        try {

            const { email } = reqBody;

            const rateLimitKey = `otp:ratelimit:${email}`
            const rateLimit = await redisClient.get(rateLimitKey);

            if (rateLimit) {
                return global.Helpers.rateLimitError(
                    "Too many OTP requests. Please wait before trying again."
                );
            }

            const otp = global.Helpers.generate6digitOtp();
            const otpKey = `otp:${email}`;
            await redisClient.set(otpKey, otp, {
                EX: 300
            })
            await redisClient.set(rateLimitKey, "true", {
                EX: 60
            })

            const message = {
                to: email,
                subject: "Your OTP Code",
                body: `Your one-time password (OTP) is ${otp}. This code is valid for 5 minutes. Please do not share it with anyone.`
            };

            await publishToQueue('send-otp', message)

            return global.Helpers.successFromService('Please check your email. Your OTP has been sent successfully.', {})

        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")

        }
    }


    verifyUser = async (reqBody: IVerifyUser): Promise<any> => {
        try {
            const { email, otp } = reqBody;

            const otpKey = `otp:${email}`;

            const storedOtp = await redisClient.get(otpKey);

            if (!storedOtp || storedOtp !== otp) {
                return global.Helpers.errorFromService(
                    "The OTP you entered is incorrect or has expired."
                );
            }

            await redisClient.del(otpKey);

            let user = await User.findOne({ email, isDeleted: false });

            if (!user) {

                const saveObj: {
                    name: string;
                    email: string;
                    isDeleted: boolean;
                } = {
                    name: email?.split("@")?.[0] ?? "",
                    email: email ?? "",
                    isDeleted: false,
                };

                user = await User.create(saveObj)
            }

            let token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN as string
                } as SignOptions
            );

            return global.Helpers.successFromService("User verified successfully.", {
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