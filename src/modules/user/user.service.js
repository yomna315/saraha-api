import { Decrypt, Encrypt } from "../../common/security/encrypt.js";
import * as dbservice from "../../DB/db.servise.js";
import UserModel from "../../DB/models/user.model.js";
import { compare, hash } from "../../common/security/hash.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";

export async function signUp(req, res, next) {
  const { email, password, fname, lname, age, gender, phone } = req.body;

  if (await UserModel.findOne({ email: email.toLowerCase() }))
    throw new Error("Email already exists", { cause: 409 });

  // const user = await UserModel.create({
  //   email,
  //   password,
  //   fname,
  //   lname,
  //   age,
  //   gender,
  // });
  const paths = [];
  for (const file of req.files.attachments) {
    paths.push(file.path);
  }

  const user = await dbservice.create({
    model: UserModel,
    data: {
      email,
      password: await hash(password),
      fname,
      lname,
      age,
      gender,
      profileImage: req.files.attachment[0].path,
      coverImages: paths,
      phone: Encrypt(phone),
    },
  });
  return res.status(201).json({ message: "Done", user });
}

export const signUpWithGmail = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const decoded = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { family_name, given_name, picture, email_verified, email } =
      decoded.getPayload();

    let user = await userModel.findOne({
      email: email.toLowerCase(),
    });
    const s = ";";
    if (!user) {
      user = await userModel.create({
        fName: given_name,
        lName: family_name,
        email,
        profileImage: picture,
        isConfirmed: email_verified,
        provider: "google",
      });
    }

    if (user.provider == "system") {
      return res.status(400).json({
        message: "login with system only",
      });
    }

    const access_token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "ahmed123",
      {
        expiresIn: 60 * 5,
      },
    );

    const refresh_token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "ali123",
    );

    return res.status(200).json({
      message: "Done",
      tokens: {
        access_token,
        refresh_token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export async function signIn(req, res, next) {
  const { email, password } = req.body;

  const user = await dbservice.findOne({
    model: UserModel,
    filter: { email: email.toLowerCase() },
  });
  if (!user)
    throw new Error("email not exsit go to signUp frist", { cause: 404 });

  // if (!user.isConfirmed)
  //   return res
  //     .status(400)
  //     .json({ message: "please confirm your email frist" });

  if (!(await compare(password, user.password)))
    throw new Error("invalid password", { cause: 401 });

  const acsess_token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_PASS_VALUE,
    {
      expiresIn: "1h",
      audience: "localhost:4000",
      issuer: "localhost:4000",
      notBefore: "20s",
      noTimestamp: true,
    },
  );
  const refresh_token = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_PASS_VALUE,
    {
      expiresIn: "1h",
    },
  );
  return res.status(200).json({
    message: "Done",
    user: {
      ...user._doc,
      phone: Decrypt(user.phone),
      acsess_token,
      refresh_token,
    },
  });
}

export async function getProfile(req, res, next) {
  const { Authorization } = req.headers;

  if (!Authorization) throw new Error("token is not exists", { cause: 404 });

  const decoded = jwt.verify(Authorization, process.env.TOKEN_PASS_VALUE);

  const user = await dbservice.findOne({
    model: UserModel,
    filter: { email: decoded.email.toLowerCase() },
  });
  if (!user) throw new Error("user is not found", { cause: 404 });

  return res.status(200).json({
    message: "Done",
    user,
  });
}
