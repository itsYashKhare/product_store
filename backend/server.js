import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/api/products", async (req,res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products})
    } catch (error) {
        console.log("error in fetching products:" , error.message);
        res.status(500).json({ success: false , message: "Server Error" });
    }
});

app.post("/api/products" , async (req,res) => {
    // res.send("Server is ready to start");

    const product = req.body;

    if(!product.name || !product.price || !product.image) {
        return res.status(400).json({ success:false, message: "Please provide all fields"});
    }

    const newProduct  = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct});
    } catch (error) {
        console.error("Error in Create product:", error.message);
        res.status(500).json({ success: false, message: "Server Error"})
    } 

});


app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product Id" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// console.log(process.env.MONGO_URI)

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
          await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true , message: "Product deleted"});
    } catch (error) {
        console.log("error in deleting products:" , error.message);
        res.status(404).json({ success: false , message: "Product not found" })
    }
});

 app.listen(4000, () => {
    connectDB();
    console.log("Server started at http://localhost:4000");
 });

// yhWogjJz0lAXNTY2