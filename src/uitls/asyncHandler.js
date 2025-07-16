const asyncHandler = (requestHandler) => {

    //? Calling function inside function 
    //? Wraper
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }

}

export { asyncHandler }