require("dotenv").config();
const express = require("express");
const server = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// File imports
const { User } = require("./models/User");
const { createProductController } = require("./controllers/ProductController");
const productsRouters = require("./routers/Products");
const brandsRouter = require("./routers/Brands");
const categoriesRouter = require("./routers/Categories");
const userRouter = require("./routers/User");
const authRouter = require("./routers/Auth"); 
const cartRouter = require("./routers/Cart");
const orderRouter = require("./routers/Order");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require('path');


// webhook

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try { 
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log({paymentIntentSucceeded});
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// JWT option
server.use(cookieParser());
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// middlewares
// cors is use to call server from current server.
server.use(express.static( path.resolve(__dirname,'build')));
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
); 
server.use(express.json());
server.use(passport.authenticate("session"));
server.use(cors({
  origin: 'https://example.com',  // Only allow requests from this origin
  methods: 'GET,POST',   
  exposedHeaders: ["X-Total-Count"] }));
server.use("/products", isAuth(), productsRouters.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
 




// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    console.log("email", email);
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32, 
        "sha256",
        async function (err, hashedPassword) {
          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            const token = jwt.sign(
              sanitizeUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role, token }); //This calls serializer
          } else {
            return done(null, false, { message: "Invalid credentials" });
          }
        }
      );
    } catch (err) {
      // Handle errors here
      done(err);
    }
  })
);

// JWT is used mostly for apis because it dosent create any dependencies on server
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// this creates session variables req.user on being called from callback
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variables req.user when called from authorized user
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log("index deserializer user", user); 
    return cb(null, user);
  });
});

// Payments 

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },   
    metadata: {
      orderId
    }
  });  
    
  res.send({ 
    clientSecret: paymentIntent.client_secret,
  });
}); 


 
const endpointSecret = process.env.ENDPOINT_SECRET;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("connected to Database");
} 

server.listen(process.env.PORT, () => {
  console.log("Server is up and running on port 8080");
});
  