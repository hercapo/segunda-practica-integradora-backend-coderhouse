import { Router } from 'express';
// import ProductManager from '../dao/managers/ProductsManager.js';
// import productsManagerDB from '../dao/models/products.manager.js';
// const productManager = new productsManagerDB();
import messagesManagerDB from '../dao/models/messages.manager.js';
const messageManager = new messagesManagerDB()

const router = Router();

// router.get("/", async (req, res) => {
//     console.log("estas en /");
//     const products = await productManager.getProducts()
//     console.log("a ver", products);
//     res.render("products", {products})
// })

//middlewares

const isConnected = (req, res, next) => {
    if(req.session.user) return res.redirect("/api/products")
    next();
}

const isDisconnected = (req, res, next) => {
    if(!req.session.user) return res.redirect("/login")
    next();
}

const isAdmin = (req, res, next) => {
    if(req.session.user.role === "Admin") {
        console.log("Es admin");
        //todo: cambiar el email, al email actual mas un tick de admin
        // return req.session.user.email += "V";
    }
    next();
}

router.post("/chat/:user/:message", async(req, res) => {
    let user = req.params.user;
    let message = req.params.message;
    const messages = await messageManager.addMessage(user, message)
    res.send(messages)
})

router.get("/chat", async (req, res) => {
    console.log("estas en el chat");
    const chat = await messageManager.getMessages()
    // res.send(chat)
    res.render("chat", {chat})
})

router.get('/register', isConnected, (req, res) => {
    res.render('register');
})

router.get('/login',isConnected, (req, res) => {
    res.render('login');
})

router.get('/', isDisconnected, isAdmin, (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
})



export default router;