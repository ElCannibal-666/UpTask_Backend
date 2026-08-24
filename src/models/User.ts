import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
    email: string,
    password: string,
    name: string,
    departament: string,
    confirmed: boolean
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    departament: {
        type: String,
        require: true,
    },

    confirmed: {
        type: Boolean,
        default: false,
    },
})

const User = mongoose.model<IUser>("User", userSchema)

export default User;