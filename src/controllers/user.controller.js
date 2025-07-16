import { asyncHandler } from '../uitls/asyncHandler'

export const registerUser = asyncHandler( async (req, res)=> {
    res.status(200).json({
        message: "Success"
    })
})