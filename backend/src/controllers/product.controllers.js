import { Product } from "../models/product.models.js";
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

//Create a product in database

const createProduct = asyncHandler( async (req, res) => {

    const {name, description, price, discount, tag, image } = req.body

    if (
        [name, description, price, discount, tag, image].some((field) => field?.trim() === "")
    ) {
        throw new Apierror(400, "All fields are required")
    }

    const product = await Product.create({
        name,
        description,
        price,
        discount,
        tag,
        image
    })

    const createdProduct = await Product.findById(product._id).select(
        "-description"
    )

    if (!createdProduct) {
        throw new Apierror(500, "Something went wrong while registering the product")
    }

    return res.status(201).json(
        new Apiresponse(200, createdProduct, "Product registered Successfully")
    )

} )

const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find()
        .select("-createdAt -updatedAt")

    if (!products?.length) {
        return res.status(404).json(
            new Apiresponse(404, "No products found")
        )
    }

    return res.status(200).json(
        new Apiresponse(201, products, "Product fetched successfully")
    )
})

const getAllProducts = asyncHandler(async (req, res) => {
    const { sort = "createdAt", page = 1, limit = 10 } = req.query;
 
    const products = await Product.find()
        .sort(sort)
        .skip((page - 1) * limit) 
        .limit(limit)
        .select("-updatedAt");
 
    const totalProducts = await Product.countDocuments();
 
    return res.status(200).json(
        new Apiresponse(200, {
            products,
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts/limit)
        }, "Products fetched successfully")
    );
 });
 
 const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    console.log("ProductId:", productId); // Add this for debugging

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
        throw new Apierror(404, "Product not found");
    }

    return res.status(200).json(
        new Apiresponse(200, {}, "Product deleted successfully")
    );
});
 
 const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const updates = req.body;
 
    const product = await Product.findByIdAndUpdate(
        productId,
        updates,
        { new: true }
    );
 
    if (!product) {
        throw new Apierror(404, "Product not found");
    }
 
    return res.status(200).json(
        new Apiresponse(200, product, "Product updated successfully")
    );
 });

export {
    createProduct,
    getProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
}


