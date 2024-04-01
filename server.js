const express = require("express")
require("./config/dbConfig")
const cors = require("cors")
const fileUpload = require("express-fileupload");
const userRouter = require("./routers/userRouter")
const hotelRouter = require("./routers/hotelRouter")
const roomRouter = require("./routers/roomRouter")
const bookingRouter = require("./routers/bookingRouter")

const PORT = process.env.port

const app = express()
app.use(express.json())
app.use(cors({origin: "*"}))
// app.use("/uploads", express.static("uploads"))

app.use(fileUpload({
    useTempFiles: true
}));

app.use("/api/v1/users",userRouter)
app.use("/api/v1/users",hotelRouter)
app.use("/api/v1/users",roomRouter)
app.use("/api/v1/users",bookingRouter)

app.listen(PORT,()=>{
    console.log(`SERVER ON PORT: ${PORT}`);
})
