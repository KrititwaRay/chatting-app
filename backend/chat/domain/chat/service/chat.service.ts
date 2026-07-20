import { ILoggedInUser } from "../../../helper/common_interface"
import mongoose from "mongoose";
import { Chat } from "../model/chat.model"
import { IMessage, Messages } from "../model/messages.model";
import axios from "axios";

export class ChatService {
    constructor() { }

    createNewChat = async (reqBody: any, loggedInUser: ILoggedInUser): Promise<any> => {
        try {

            const loggedInUserId = loggedInUser._id;
            const { otherUserId } = reqBody;

            const exixtingChat = await Chat.findOne({
                users: { $all: [new mongoose.Types.ObjectId(loggedInUserId), new mongoose.Types.ObjectId(otherUserId)], $size: 2 },
                isDeleted: false
            });
        

            if (exixtingChat) {
                return global.Helpers.successFromService("Chat already exists.", {
                    chatid: exixtingChat._id
                })
            }

            const newChat = await Chat.create({
                users: [new mongoose.Types.ObjectId(loggedInUserId), new mongoose.Types.ObjectId(otherUserId)]
            })

            return global.Helpers.successFromService("Chat created successfully.", {
                chatid: newChat._id
            })

        } catch (error) {
            return global.Helpers.errorFromService("Something went wrong, please try again later.")

        }
    }


    getAllChats = async  (loggedInUser: ILoggedInUser, token: string):Promise<any> =>{
        try {


            const loggedInUserId = new mongoose.Types.ObjectId(loggedInUser._id);
            

            const chats = await Chat.find({ users: new mongoose.Types.ObjectId(loggedInUser._id), isDeleted: false }).sort({ updatedAt: -1 });

            const chatWithUserData = await Promise.all(
                chats.map(async (chat) => {
                    const otherUserId = chat.users.find((id) => id.toString() != loggedInUserId.toString());
                    console.log("otherUserId ", otherUserId)

                    const unseenCount = await Messages.countDocuments({
                        chatId: new mongoose.Types.ObjectId(chat._id),
                        sender: { $ne: loggedInUserId },
                        seen: false,
                        isDeleted: false
                    })
                    try {

                        const { data } = await axios.get(`${process.env.USER_SERVICE
                            }/v1/user/${otherUserId}`,
                            {
                                headers: {
                                    Authorization: token.toString()
                                }
                            });
    
                        return {
                            user: data,
                            chat: {
                                ...chat.toObject(),
                                latestMessage: chat.latestMessage || null,
                                unseenCount: unseenCount
    
                            }
                        }
                    } catch (error: any) {
                       console.log(error)
                        return {
                            user: { _id: otherUserId, name: "Unknown User!" },
                            chat: {
                                ...chat.toObject(),
                                latestMessage: chat.latestMessage || null,
                                unseenCount: unseenCount

                            }
                        }
                    }
                })
            )

            return global.Helpers.successFromService("Data fetched successfully.", {
                chats: chatWithUserData
            })

           

        } catch (error) {

            return global.Helpers.errorFromService("Something went wrong, please try again later.")

        }
    }

    // sendMessage = async (loggedInUser: ILoggedInUser, reqBody: any, files?: Express.Multer.File[]): Promise<any> => {
    //     try {

          
    //         const { chatId, text } = reqBody;

    //         const chat = await Chat.findOne({
    //             _id: new mongoose.Types.ObjectId(chatId),
    //             isDeleted: false
    //         });
    //         if (!chat) {
    //             return global.Helpers.errorFromService("Chat not found.")
    //         }

    //         const isUserInChat = chat.users.some((userId) => userId.toString() === loggedInUser._id.toString());
    //         if(!isUserInChat){
    //               return global.Helpers.errorFromService("You are not a participant of this chat.")
    //         }

    //         const otherUserId = chat.users.find((userId) => userId.toString() != loggedInUser._id.toString());

    //         if(!otherUserId){
    //              return global.Helpers.errorFromService("No other User")
    //         }


    //         // socket setup later


    //        let messageData = {
    //         chatId: chat._id,
    //         sender: loggedInUser._id,
    //         seen: false,
    //     };
    //      // Text message
    //     if (text) {
    //         messageData.text = text;
    //     }

    //      // File message
    //     if (files && files.length > 0) {

    //         const uploadedFile = files[0];

    //         messageData.file = {
    //             url: uploadedFile.path,
    //             publicId: uploadedFile.filename,
    //         };

    //     }

    //     } catch (error) {
    //         return global.Helpers.errorFromService("Something went wrong, please try again later.")
    //     }
    // }


    sendMessage = async (
        loggedInUser: ILoggedInUser,
        reqBody: any,
        files?: Express.Multer.File[]
    ): Promise<any> => {
        try {
            const { chatId, text } = reqBody;
            console.log(files)
            /* 
            [
      {
        fieldname: 'media',
        originalname: 'Screenshot 2026-03-01 213552.png',
        encoding: '7bit',
        mimetype: 'image/png',
        path: 'https://res.cloudinary.com/dizwhybrr/image/upload/v1784528104/chat-images/vkjntmtisczabsbxzeqf.png',
        size: 7938,
        filename: 'chat-images/vkjntmtisczabsbxzeqf'
      }
    ]
            
            */

            const chat = await Chat.findOne({
                _id: new mongoose.Types.ObjectId(chatId),
                isDeleted: false,
            });

            if (!chat) {
                return global.Helpers.errorFromService("Chat not found.");
            }


            const isUserInChat = chat.users.some(
                (userId) =>
                    userId.toString() === loggedInUser._id.toString()
            );

            if (!isUserInChat) {
                return global.Helpers.errorFromService(
                    "You are not a participant of this chat."
                );
            }


            const otherUserId = chat.users.find(
                (userId) =>
                    userId.toString() !== loggedInUser._id.toString()
            );

            if (!otherUserId) {
                return global.Helpers.errorFromService(
                    "No other user found."
                );
            }


            let uploadedFiles: any = [];


            if (files && files.length > 0) {

                uploadedFiles = files.map((file) => {

                    let type = "DOCUMENT";

                    if (file.mimetype.startsWith("image/")) {
                        type = "IMAGE";
                    }
                    else if (file.mimetype.startsWith("video/")) {
                        type = "VIDEO";
                    }


                    return {
                        url: file.path,
                        publicId: file.filename,
                        mimetype: file.mimetype,
                        type,
                    };
                });

            }


            const messageData: Partial<IMessage> = {
                chatId: chat._id,
                sender: new mongoose.Types.ObjectId(loggedInUser._id),
                text: text || undefined,
                files: uploadedFiles,
                messageType:
                    uploadedFiles.length > 0
                        ? "FILE"
                        : "TEXT",
                seen: false,
            };


            const message = await Messages.create(messageData);


            const latestMessageText = uploadedFiles.length > 0 ? "📂" : text

            await Chat.findByIdAndUpdate(
                chat._id,
                {
                    latestMessage: {
                        text: latestMessageText,
                        sender: new mongoose.Types.ObjectId(loggedInUser._id)
                    },
                    updatedAt: new Date()
                }, { new: true })

            // emit to socket

            return global.Helpers.successFromService("Message sent successfully", {
                message: message
            }
            )

        } catch (error) {

            console.log(error);

            return global.Helpers.errorFromService(
                "Something went wrong, please try again later."
            );
        }
    };

}