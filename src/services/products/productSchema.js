import mongoose from "mongoose"

const { Schema, model } = mongoose

const productSchema = new Schema(

  {
    name: { type: String, required: true },
	description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },  
    review: [{
        comment :{type: String, required: true},
        rate :{type: Number,required: true},
        /* productId : [{type: Schema.type.ObjectId, ref:"products"}], */
    },
    {
        timestamps: true,
    }
  ]

},
{
  timestamps: true, 
},
)

productSchema.static("findProductswithReviews", async function (mongoQuery) {
    const total = await this.countDocuments(mongoQuery.criteria)
    const products = await this.find(mongoQuery.criteria, mongoQuery.options.fields)
      .limit(mongoQuery.options.limit || 10)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort) 
      
  
    return { total, products }
  })



export default model("Product", productSchema) 