import express from 'express';
import mongoose from 'mongoose';


const app = express();

app.use(express.json());


mongoose.connect('mongodb://root:root@localhost:27017/admin?authSource=admin');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    specs: Object,
});

const Product = mongoose.model('Product', productSchema, 'node_cache.products');


app.get('/api/products', async (req, res) => {
   


    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }

    const products = await Product.find(query);
 
    

    res.json(products);
});



app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true }
    );

    if (!updatedProduct) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    res.json({
        success: true,
        message: 'Product updated successfully',
    });
});



app.listen(4000, () => console.log('Server listening on port 4000'));