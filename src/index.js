import app from "./app.js";
import dbConnet from "./db/index.js";
import 'dotenv/config'
import cors from 'cors'
import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(express.cookieParser())

dbConnet()
    .then(() => {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`app is listing on the port ${process.env.PORT} `)
        })
    })
    .catch((error) => {
        console.log(`MongoDB connection failed!: ${error}`)
    })

