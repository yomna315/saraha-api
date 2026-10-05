import express from "express";
import ConnectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/user/user.controller.js";
import cors from "cors";
const app = express();
const port = 3000;
const bootstrap = async () => {
  app.use(
    cors({
      origin: "*",
    }),
  );
  app.use(express.json());

  await ConnectionDB();
  app.get("/", (req, res) =>
    res.status(200).json({ message: "wellcome to saraha app...." }),
  );
  app.use("/users", userRouter);
  app.use("{/*demo}", (req, res, next) => {
    throw new Error(
      `${req.originalUrl} with method ${req.method} not found....😭😭😭`,
      { cause: 404 },
    );
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(statusCode).json({ message: err.message, stack: err.stack });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

export default bootstrap;
