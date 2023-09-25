import { Router } from "express";
// import ProductManager from "../dao/managers/ProductsManager.js";
import productsManagerDB from "../dao/models/products.manager.js";
import CartManagerDB from '../dao/models/carts.manager.js';
import productsModel from "../dao/schemas/products.schema.js";

const router = Router();

const productManager = new productsManagerDB();


router.get("/", async (req, res) => {
    const { page, query, limit, order } = req.query;
    let sortBy;
    if(order === "desc") {
        sortBy = -1;
    } else if (order === "asc"){
        sortBy = 1;
    }
    let products;
    if (!query) {
        products = await productsModel.paginate(
            {},
            {
                limit: limit ?? 3,
                lean: true,
                page: page ?? 1,
                sort: { price: sortBy },
            }
        );
    } else {
        products = await productsModel.paginate(
            { category: query},
            {
                limit: limit ?? 3,
                lean: true,
                page: page ?? 1,
                sort: { price: sortBy },
            }
        );
    }
    const cartManager = new CartManagerDB;
    res.render("products", { products, query, order,  user: req.session.user });
});

router.get("/:pid", async (req, res) => {
    try {
        const pID = req.params.pid;
        const pFound = await productManager.getProductById(pID);
        res.send(pFound);
    } catch (error) {
        res.status(500).send("Error");
    }
});

router.post("/", (req, res) => {
    const product = req.body;
    productManager.addProduct(product);
    res.send({ status: "success" });
});

router.put("/:pid", async (req, res) => {
    const prodID = req.params.pid;
    const prodToAdd = req.body;
    const prodToUpdate = await productManager.updateProduct(prodID, prodToAdd);
    res.send(prodToUpdate);
});

router.delete("/:pid", async (req, res) => {
    try {
        const prodID = req.params.pid;
        const productToDelete = await productManager.deleteProduct(prodID);
        res.send(productToDelete);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting data.");
    }
});

export default router;
