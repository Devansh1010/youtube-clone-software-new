import { asyncHandler } from '../uitls/asyncHandler.js'
import User from '../models/user.model.js'
import { ApiError } from '../uitls/ApiError.js'
import { ApiResponse } from '../uitls/ApiResponse.js'
import { uploadFileOnCloudinary } from '../uitls/cloudinary.js'

export const registerUser = asyncHandler(async (req, res) => {

    const { username, fullname, password, email, } = await req.json()

    // Validation data

    //check user exist or not
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existUser) {
        throw new ApiError(409, "Username and email already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log("file of multer: ", req.files)


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required")
    }

    //upload to cloudinary
    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar image is required")
    }

    const User = await User.create({
        fullname,
        username: username.toLowercase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password
    })

    const userCreated = User.findById(User._id).select('-password -refreshToken')

    if (!userCreated) {
        throw new ApiError(504, "Something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(200, userCreated, "User registerd successfully")
    )
})