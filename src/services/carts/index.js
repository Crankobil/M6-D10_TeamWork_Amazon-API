import express from "express"
import ProductModel from "../products/productSchema.js"
import CartModel from "./schema.js"

const cartRoutes = express.Router()

cartRoutes.post("/:ownerId/addToCart", async (req, res, next) => {
    try {
        const productId = req.body.productId
        const purchasedProduct = await ProductModel.findById(productId)

        if (purchasedProduct) {
            const isProductThere = await CartModel.findOne({ ownerId: req.params.ownerId, status: "active", "products.asin": purchasedProduct.asin })
            if (isProductThere) {
                const cart = await CartModel.findOneAndUpdate(
                    { ownerId: req.params.ownerId, status: "active", "products.asin": purchasedProduct.asin },
                    {
                        $inc: { "products.$.quantity": req.body.quantity },
                    },
                    {
                        new: true,
                    }
                )
                res.send(cart)
            } else {
                const productToInsert = { ...purchasedProduct.toObject(), quantity: req.body.quantity }

                const cart = await CartModel.findOneAndUpdate(
                    { ownerId: req.params.ownerId, status: "active" },
                    {
                        $push: { products: productToInsert }
                    },
                    {
                        new: true,
                        upsert: true,
                    }
                )
                res.send(cart)
            }
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
})

export default cartRoutes