const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config({ path: ".././src/config/config.env" });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  description: String,
  phoneNumber: {
    type: String,
  },

  prefix: {
    type: String,
  },

  password: {
    type: String,
    required: true,
    //validation will be before saving to db
  },
  photo: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  longitude: String,
  latitude: String,

  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: Number,
  },
  emailVerificationTokenExpires: {
    type: Date,
  },
  passwordResetToken: {
    type: Number,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  blockStatus: { type: Boolean, default: false },
  city: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  // distance: {
  //   type: Number,
  //   default: 10,
  // },
  gender: {
    type: String,
    default: "female",
  },
  hourly: [Number],
  hostavailable: {
    type: Boolean,
    default: false,
  },
  sexualOrientation: {
    type: String,
    // enum: ["straight", "gay", "trans", "bisexual"],
    // default: "straight",
  },
  selectedEthnicities: {
    type: String,
    // enum: ["white", "ebony", "Hispanic", "Asian", "middle eastern", "European", "German", "Indian"],
  },
  bodyRating: {
    type: Number,
    // enum: [1, 2, 3, 4, 5],
  },
  assSize:{
    type: String,
    // enum: ["small", "medium", "large"],
  },
  bodyType: {
    type: String,
    // enum: ["slim", "athletic", "average", "curvy", "bbw"],
  },
  breastCupSize: {
    type: String,
    // enum: ["A", "B", "C", "D", "E", "F", "G"],
  },
  languages: {
    type: [String],
    // enum: ["English", "Spanish", "French", "German", "Italian", "Russian", "Arabic", "Hindi", "Chinese", "Japanese", "Korean", "Portuguese"],
  },
  hairColor :{
    type:String,
  },
  feet:{
    type:Number,
  },
  inches:{
    type:Number,
  },
  weight:{
    type:Number,
  },
  penisSize:{
    type:Number,
  },
  penisGirth:{
    type:Number,
  },
  threesome:{
    type:Boolean,
  },
  orgies:{
    type:Boolean
  },
  useToys:{
    type:Boolean
  },
  footjob:{
    type:Boolean
  },
  roleplay:{
    type:Boolean
  },
  events:{
    type:Boolean
  },
  doublePenetration:{
    type:Boolean
  },
  oral:{
    type:Boolean
  },
  bondage:{
    type:Boolean
  }
});

userSchema.index({ location: "2dsphere" });

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//jwtToken
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { _id: this._id, emailVerified: this.emailVerified },
    process.env.JWT_SECRET
  );
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const user = mongoose.model("user", userSchema);

module.exports = user;
