import { ILogin, ILoginUser, IUpdateProfile, IVerifyUser } from "../interface/user_interface";
import { User } from "../model/user.model";
import jwt, { SignOptions } from "jsonwebtoken";
import { redisClient } from "../../../src/app";
import { publishToQueue } from "../../../configuration/rabbitmq";
import mongoose from "mongoose";
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

    userProfile = async (reqBody: ILoginUser): Promise<any> => {
        try {
            let user = await User.findOne({
                _id: reqBody._id,
                isDeleted: false
            }, { createdAt: 0, updatedAt: 0 });

            if (!user) {
                return global.Helpers.errorFromService(
                    "Unable to retrieve your profile."
                );
            }

            return global.Helpers.successFromService("Data fetched successfully.", { user })

        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")
        }
    }


    updateProfile = async (loginUser: ILoginUser, reqBody: IUpdateProfile): Promise<any> => {
        try {

            let user = await User.findOneAndUpdate(
                { _id: loginUser._id, isDeleted: false },
                { name: reqBody.name },
                { new: true }
            ).select('-createdAt -updatedAt').lean();

            if (!user) {
                return global.Helpers.errorFromService(
                    "Unable to update your profile."
                );
            }
            return global.Helpers.successFromService("Profile updated successfully.", { user })

        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")
        }
    }


    getAllUsers = async (loginUser: ILoginUser): Promise<any> => {
        try {
            
            let users = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: new mongoose.Types.ObjectId(loginUser._id) },
                        isDeleted: false
                    }
                },
                {
                    $sort: { name: 1 }
                }
            ]);

            return global.Helpers.successFromService("Data fetched successfully.", { users })
            
        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")
        }
    }

    getSingleUser = async (userId: string): Promise<any> => {
        try {
            let user = await User.findOne({
                _id: new mongoose.Types.ObjectId(userId),
                isDeleted: false
            }).select('-createdAt -updatedAt');

            if (!user) {
                return global.Helpers.errorFromService("User not found or has been deleted.")
            }
            return global.Helpers.successFromService("Data fetched successfully.", { user })

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

/* 
gold 1 + 2
pre recorded concept
live: 

*/