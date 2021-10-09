import mongoose from "mongoose"

const { Schema, model } = mongoose

const cartSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    status: { type: String, enum: ["active", "paid"], default: "active" },
    products: [{ asin: String, title: String, price: Number, quantity: Number }],
})

export default model("Cart", cartSchema)