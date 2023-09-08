const express  = require('express');
const server = express();
const mongoose = require('mongoose');


// File imports
const createProductController = require('./controllers/ProductController');
const productsRouters = require('./routers/Products');
const brandsRouter = require('./routers/Brands');
const categoriesRouter = require('./routers/Categories');
const cors = require('cors');




main().catch(err => console.log(err));
async function main() { 
  await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
    console.log("connected to Database");
}

// middlewares
// cors is use to call server from current server.
server.use(cors(
 { exposedHeaders: ['X-Total-Count']}
));
server.use(express.json());
server.use('/products', productsRouters.router);
server.use('/categories', categoriesRouter.router);
server.use('/brands', brandsRouter.router);
 


server.listen(8080, () => {
    console.log('Server is up and running on port 8080');
});