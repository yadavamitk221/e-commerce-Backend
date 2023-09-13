const express  = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require("cors");

// File imports
const createProductController = require("./controllers/ProductController");
const productsRouters = require("./routers/Products");
const brandsRouter = require("./routers/Brands");
const categoriesRouter = require("./routers/Categories");
const userRouter = require("./routers/User");
const authRouter = require("./routers/Auth");
const cartRouter = require('./routers/Cart');
const orderRouter = require('./routers/Order');

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");
  console.log("connected to Database");
}

// middlewares
// cors is use to call server from current server.
server.use(express.json());
server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
server.use("/products", productsRouters.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);



server.listen(8080, () => {
    console.log('Server is up and running on port 8080');
});