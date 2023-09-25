import cartModel from "../schemas/carts.schema.js";

class CartManagerDB {
    constructor() {
        this.cartsModel = cartModel;
    }

    async getCarts() {
        try {
            const carts = await this.cartsModel.find().lean();
            return carts;
        } catch (error) {
            // throw new Error("Doesn´t exists a cart with this ID.");
            console.error("Doesn´t exists a cart with this ID.")
        }
    }
    async createNewCart() {
        try {
            const newCart = await this.cartsModel.create({ products: [] });
            return newCart;
        } catch (error) {
            throw new Error("Could not add cart");
        }
    }

    // const cartFound = await this.cartsModel.find({_id: id}).populate("products.product");
    async getCartByID(id) {
        try {
            const cartFound = await this.cartsModel
                .findById(id)
                .populate("products.product")
                .lean();
            if (cartFound) {
                return cartFound;
            } else {
                return "Not Found";
            }
        } catch (error) {
            throw new Error("Could not get cart");
        }
    }

    async addToCart(cartID, prodID) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            if (!cart) {
                throw new Error("Cart not found");
            }

            const prodIndex = cart.products.findIndex(
                (prod) => prod.product === prodID
            );
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++;
            } else {
                const newProduct = { product: prodID, quantity: 1 };
                cart.products.push(newProduct);
            }

            await cart.save();
            return true;
        } catch (error) {
            throw new Error("Could not add products to cart: " + error);
        }
    }
    async deleteProdFromCart(cartID, prodID) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            const prodIndex = cart.products.findIndex(
                (prod) => prod.product === prodID
            );
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++;
            } else {
                const prodToDelete = { product: prodID };
                cart.products.splice(prodToDelete, 1);
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(
                "It doesn´t exists a cart or product with such ID."
            );
        }
    }
    async updateWholeCart(cartID, prods) {
        try {
            // const cartToUpdate = await this.cartsModel.findById(cartID);
            const updatedCart = await this.cartsModel.findOneAndUpdate(
                { _id: cartID },
                { product: prods },
                (err) => {
                    if (err) {
                        console.error(
                            "An error updating the cart has ocurred",
                            err
                        );
                    } else {
                        console.log("Cart has been updated");
                    }
                }
            );
            console.log("updated cart", updatedCart);

            return updatedCart;
        } catch (error) {
            throw new Error("Couldn´t update cart.");
            // console.log("no anda");
        }
    }
    async emptyCart(cartID) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (err) {
            console.error(err);
            // console.log("no se pudo vaciar");
        }
    }
    async updateQuantity(cartID, prodID, quantity) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            // console.log("soy cart", cart.products);
            const prodToUpdate = cart.products.find((prod) => prod.product._id.toString() === prodID);
            // console.log("soy prodToUpdate", prodToUpdate);
            prodToUpdate.quantity = quantity;
            // console.log("soy prodToUpdate despues", prodToUpdate);
            cart.save();
            return cart;
        } catch (err) {
            console.error(err)
        }
    }
}
export default CartManagerDB;
