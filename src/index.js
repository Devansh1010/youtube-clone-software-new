import app from "./app.js";
import dbConnet from "./db/index.js";


dbConnet()
    .then(() => {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`app is listing on the port ${process.env.PORT} `)
        })
    })
    .catch((error) => {
        console.log(`MongoDB connection failed!: ${error}`)
    })

