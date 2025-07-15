import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'

const dbConnet = async () => {

    try {
        const res = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`\n MogoDB connected! DB HOST: ${res.connection.host}`);
        console.log(`Connection responce: ${res}`)
        
    } catch (error) {
        console.log("Error while conneting MONGODB: ", error)
        process.exit(1)
    }
}

export default dbConnet