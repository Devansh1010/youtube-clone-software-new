import { asyncHandler } from '../uitls/asyncHandler.js'
import User from '../models/user.model.js'
import { ApiError } from '../uitls/ApiError.js'
import { ApiResponse } from '../uitls/ApiResponse.js'
import { uploadFileOnCloudinary } from '../uitls/cloudinary.js'

export const registerUser = asyncHandler(async (req, res) => {

    console.log(req.body)
    
    const { fullName, password, email, username } = req.body;


    // Validation data
    if (!username || typeof username !== "string" || username.trim().length < 3) {
        return res.status(400).json({ success: false, message: "Invalid or missing username (min 3 characters)." });
    }

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
        return res.status(400).json({ success: false, message: "Invalid or missing full name (min 3 characters)." });
    }

    if (
        !password ||
        typeof password !== "string" ||
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters, with upper, lower, and number."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }


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
        fullName,
        username: username.toLowerCase(),
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