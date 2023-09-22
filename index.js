const express  = require('express');
const server = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const SECRET_KEY = "SECRET_KEY";

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
const { isAuth, sanitizeUser } = require("./services/common");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");
  console.log("connected to Database");
}

// JWT option
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

// middlewares
// cors is use to call server from current server.
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(express.json());

server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
server.use("/products", productsRouters.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/users", isAuth, userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy(
    {usernameField: 'email'},
    async function (email, password, done) {
    try {
      console.log(email, password);
      const user = await User.findOne({ email: email}).exec();
      console.log("user", user);
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        31000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            done(null, token); //This calls serializer
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
    console.log("jwt_payload", jwt_payload);
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(err, false);
    }
  })
);

// this creates session variables req.user on being called from callback
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variables req.user when called from authorized user
passport.deserializeUser(function (user, cb) {
  console.log("deserializeUser", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

server.listen(8080, () => {
  console.log("Server is up and running on port 8080");
});  