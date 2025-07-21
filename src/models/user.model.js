import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],

    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
        lowercase: true,
        index: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
    },

    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
        lowercase: true,
    },

    avatar: {
        type: String,
        required: [true, "Avatar is required"]
    },

    coverImage: {
        type: String,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    refreshToken: {
        type: String
    }

}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt(this.password, 10)
        next()
    }
})

userSchema.methods.isPasswordCorrect = async function () {
    return await bcrypt.compare(password.this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this._email
    },
        process.env.ACCESS_TOKEN_SERCRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshtoken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', userSchema)
export default User