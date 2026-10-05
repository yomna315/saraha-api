import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 10,
    },
    lname: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 10,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,

      trim: true,
      required: function () {
        return this.provider === "system" ? true : false;
      },
      minlength: 6,
    },
    age: {
      type: Number,
      required: function () {
        return this.provider === "system" ? true : false;
      },
      min: 19,
      max: 60,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    profileImage: String,
    phone: String,
    provider: {
      type: String,
      enum: ["system", "google"],
      default: "system",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
