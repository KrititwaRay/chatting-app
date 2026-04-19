import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    isDeleted: boolean;
}

const schema: Schema<IUser> = new Schema({

    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, unique: true, index: true },
    isDeleted: { type: Boolean, index: true }

}, { timestamps: true, versionKey: false })

export const User = mongoose.model<IUser>('User', schema);
