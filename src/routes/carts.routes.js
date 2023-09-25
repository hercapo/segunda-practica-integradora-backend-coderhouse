import { Router } from "express";
// import CartManager from "../dao/managers/CartsManager.js";
import CartManagerDB from "../dao/models/carts.manager.js";
const router = Router();

const cartManager = new CartManagerDB();

router.get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    // carts.forEach(cart => console.log(cart.products))
    res.send(carts);
});

router.post("/", async (req, res) => {
    try {
        const products = req.body;
        const cartAdded = await cartManager.createNewCart(products);
        res.send(cartAdded);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await cartManager.getCartByID(cartID);
        const products = cart.products;
        // res.send({products});
        res.render("cart", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    //TODO: Hacer que se agreguen los productos y se cree el carrito si no existe
    try {
        const cartID = req.params.cid;
        const prodID = req.params.pid;
        const cart = await cartManager.getCartByID(cartID);
        console.log(cart);
        if (cart) {
            const existingProd = cart.products.find(
                (product) => product.product._id.toString() === prodID
            );
            if (existingProd) {
                const quantity = existingProd.quantity + 1;
                await cartManager.updateQuantity(cartID, prodID, quantity);
                return;
            }
        }
        const productAddedToCart = await cartManager.addToCart(cartID, prodID);
        res.send(productAddedToCart);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error, unable to obtain data");
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;
    const deleted = await cartManager.deleteProdFromCart(cartID, prodID);
    res.send(deleted);
});

router.put("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    const prod = req.body;
    console.log(cartID, prod);
    const updatedCart = await cartManager.updateWholeCart(cartID, prod);
    console.log("a ver", updatedCart);
    res.send(updatedCart);
});

router.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await cartManager.updateQuantity(
        cid,
        pid,
        quantity
    );
    res.send(updatedQuantity);
});

router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const deletedCart = await cartManager.emptyCart(cid);
    console.log(deletedCart);
    res.send(deletedCart);
});

export default router;
