import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter)

import accountRouter from "./routes/account.routes.js";
app.use("/api/v1/accounts", accountRouter)

import transactionRouter from "./routes/transaction.routes.js";
app.use("/api/v1/trans", transactionRouter)

import { sendMessage } from "./controllers/chat.controller.js";
app.post("/api/v1/send-message", sendMessage)

export {app}