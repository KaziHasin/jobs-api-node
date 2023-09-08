const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
require("./db/connect");
const { logout } = require("./controllers/auth");

// route
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// middleware
const authorization = require("./middleware/authorization");
const notFound = require("./middleware/not-found");
const errorHandling = require("./middleware/error-handling");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Job API`);
});

app.use("/api/v1/auth", authRouter);
app.post("/api/v1/auth/logout", authorization, logout);
app.use("/api/v1/jobs", authorization, jobsRouter);

// not found
app.use(notFound);
app.use(errorHandling);
app.listen(port, console.log(`Jobs api listening port number ${port}`));
