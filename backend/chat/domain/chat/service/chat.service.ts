import { ILoggedInUser } from "../../../helper/common_interface"
import mongoose from "mongoose";
import { Chat } from "../model/chat.model"
import { Messages } from "../model/messages.model";
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

}