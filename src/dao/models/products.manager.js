import productsModel from "../schemas/products.schema.js";

class productsManagerDB {
    constructor() {
        this.productsModel = productsModel;
    }
    async getProducts() {
        try {
            // const products = await this.productsModel.find().lean();
            const products = await this.productsModel.aggregate([
                {
                    $match: { category: "electronics" },
                },
                {
                    $sort: {price: -1}
                }
            ]);
            return products;
        } catch (err) {
            throw new Error("Can´t get any product.");
        }
    }
    async addProduct(product) {
        try {
            const addedProduct = await this.productsModel.create(product);
            return addedProduct;
        } catch (err) {
            throw new Error("Product cannot be added.");
        }
    }
    async getProductById(pID) {
        try {
            const productFound = await this.productsModel.findOne({ _id: pID });
            return productFound;
        } catch (error) {
            throw new Error("Doesn´t exists a product with this ID.");
        }
    }
    async updateProduct(pid, prod) {
        try {
            const updatedProduct = await this.productsModel.updateOne(
                { _id: pid },
                prod
            );
            return updatedProduct;
        } catch (error) {
            // console.log("Cannot update");
            throw new Error("Could not update product")
        }
    }
    async deleteProduct(pid) {
        try {
            const deletedProduct = await this.productsModel.deleteOne({
                _id: pid,
            });
            return deletedProduct;
        } catch (error) {
            throw new Error("Can´t delete the product with this id");
        }
    }
}

export default productsManagerDB;
