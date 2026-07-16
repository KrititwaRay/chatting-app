import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    text?: string;
    file?: {
        url: string;
        publicId: string;
    };
    messageType: "TEXT" | "FILE";
    seen: boolean;
    seenAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const schema: Schema<IMessage> = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, index: true, ref: "Chat", required: true },

        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },

        text: { type: String, trim: true },

        file: {
            url: { type: String },
            publicId: { type: String },
        },

        messageType: { type: String, enum: ["TEXT", "FILE"], required: true },

        seen: { type: Boolean, default: false },

        seenAt: { type: Date },

        isDeleted: { type: Boolean, default: false, index: true, },
    },
    { timestamps: true, versionKey: false, }



);

export const Messages = mongoose.model<IMessage>("Messages", schema);