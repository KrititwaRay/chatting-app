import mongoose, { Document, Schema } from "mongoose";

export interface IUSer extends Document {
    name: string;
    email: string;
    image: string;
    instagram: string;
    meta: string;
    linkedin: string;
    bio: string;
    isDeleted: boolean;
}

const schema: Schema<IUSer> = new Schema({

    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, unique: true, index: true },
    image: { type: String, trim: true },
    instagram: { type: String, trim: true },
    meta: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    bio: { type: String, trim: true },
    isDeleted: { type: Boolean, index: true }

}, { timestamps: true, versionKey: false })

export const User = mongoose.model<IUSer>('User', schema);

// export default User