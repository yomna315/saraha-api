import { Router } from "express";
import * as US from "./user.service.js";
import { multerLocal } from "../../common/middleware/multer.js";
const userRouter = Router();
const s = ";";

userRouter.post(
  "/signup",
  multerLocal({
    customTypes: ["image/png", "image/jpeg"],
  }).fields([
    { name: "attachments", maxCount: 2 },
    { name: "attachment", maxCount: 1 },
  ]),
  US.signUp,
);
userRouter.post("/signup/gmail", US.signUpWithGmail);
userRouter.post("/signin", US.signIn);
userRouter.get("/profile", US.getProfile);
export default userRouter;
