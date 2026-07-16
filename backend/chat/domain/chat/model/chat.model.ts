import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChat extends Document {
    users: Types.ObjectId[];
    latestMessage: {
        text: string;
        sender: Types.ObjectId;
    };
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const schema: Schema<IChat> = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: "User", required: true } ],
        latestMessage: {
            text: { type: String },
            sender: { type: Schema.Types.ObjectId, ref: "User" },
        },
        isDeleted: { type: Boolean, default: false, index: true },
    },
    { timestamps: true, versionKey: false }
);

export const Chat = mongoose.model<IChat>("Chat", schema);