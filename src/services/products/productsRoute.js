import express from "express"
import createHttpError from "http-errors"
import productModel from "./productSchema.js"
import q2m from "query-to-mongo"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new productModel(req.body) 
    const { _id } = await newProduct.save() 

    res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query)

    const { total, products } = await productModel.findProductswithReviews(mongoQuery)
    res.send({ links: mongoQuery.links("/products", total), total, products })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productsId", async (req, res, next) => {
  try {
    const productsId = req.params.productsId

    const products = await productModel.findById(productsId) // similar to findOne, but findOne expects to receive a query as parameter

    if (products) {
      res.send(products)
    } else {
      next(createHttpError(404, `products with id ${productsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productsId", async (req, res, next) => {
  try {
    const productsId = req.params.productsId
    const modifiedproducts = await productModel.findByIdAndUpdate(productsId, req.body, {
      new: true, // returns the modified products
    })

    if (modifiedproducts) {
      res.send(modifiedproducts)
    } else {
      next(createHttpError(404, `products with id ${productsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productsId", async (req, res, next) => {
  try {
    const productsId = req.params.productsId

    const deletedproducts = await productModel.findByIdAndDelete(productsId)

    if (deletedproducts) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `products with id ${productsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/:productId/review" , async (req,res,next) => {
    try{
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.productId,
            { $push:{review :req.body}},
            {new:true}
            );
        if(updatedProduct){
            res.send(updatedProduct);
            next(createHttpError(404, `product with id ${req.params.productId} not found`))
        }
    }catch(error){
        next(error);
    }
})

productsRouter.get("/:productId/review", async (req, res, next) => {
    try {
      const products = await productModel.findById(req.params.productId)
      if (products) {
        res.send(products.review)
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

  productsRouter.get("/:productId/review/:reviewId", async (req, res, next) => {
    try {
      const product = await productModel.findById(req.params.productId)
      if (product) {
        const reviewedProduct = product.review.find(r => r._id.toString() === req.params.reviewId) // I CANNOT compare an ObjectId (_id) with a string, _id needs to be converted into a string
        if (reviewedProduct) {
          res.send(reviewedProduct)
        } else {
          next(createHttpError(404, `review with id ${req.params.reviewId} not found!`))
        }
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

  productsRouter.delete("/:productId/review/:reviewId", async (req, res, next) => {
    try {
      const product = await productModel.findByIdAndUpdate(
        req.params.productId, 
        { $pull: { review: { _id: req.params.reviewId } } }, 
        { new: true }
      )
      if (product) {
        res.send(product)
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  productsRouter.put("/:productId/review/:reviewId", async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId) 

    if (product) {
      const index = product.review.findIndex(r => r._id.toString() === req.params.reviewId)

      if (index !== -1) {
        product.review[index] = { ...product.review[index].toObject(), ...req.body }
        await product.save()
        res.send(product)
      } else {
        next(createHttpError(404, `review with id ${req.params.reviewId} not found in purchase history!`))
      }
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter