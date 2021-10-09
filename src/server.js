import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import cartRoutes from "./services/carts/index.js"
import productsRouter from "./services/products/productsRoute.js"
/* import { notFoundHandler, badRequestHandler, genericErrorHandler } from "./errorHandlers.js" */

const server = express()

const port = process.env.PORT || 3003

// ************************* MIDDLEWARES ********************************

server.use(cors())
server.use(express.json())

server.use("/carts", cartRoutes)
// ************************* ROUTES ************************************

server.use("/products", productsRouter)

// ************************** ERROR HANDLERS ***************************

/* server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler) */

mongoose.connect(process.env.MONGO_CONNECTION)


mongoose.connection.on("connected", () => {
    console.log("Successfully connected to Mongo!")
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server running on port ${port}`)
    })
})

mongoose.connection.on("error", err => {
    console.log(err)
})