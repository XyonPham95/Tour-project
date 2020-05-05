const mongoose = require("mongoose");
const User = require("./user");
const Category = require("./category");
const Review = require("./review");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter Tour title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Enter Tour description"],
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "Tour must include 1 category"],
      },
    ],
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Tour must include organizer"],
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 0"],
      max: [5, "Rating must be below 5.0"],
      set: (value) => Math.round(value * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "Please include duration"],
    },
    price: {
      type: Number,
      required: [true, "Please include price"],
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre("save", async function (next) {
  if (!this.isModified("guides")) return next();
  const found = await User.find({ _id: { $in: this.guides } }).select("_id");
  if (found.length !== this.guides.length)
    throw new Error("guide(s) doesn't exist");

  const guideArray = this.guides.map(
    async (guide) => await User.findById(guide)
  );
  const categoryArray = this.categories.map(
    async (category) => await Category.findById(category)
  );

  this.guides = await Promise.all(guideArray);
  this.categories = await Promise.all(categoryArray);
  console.log("categoryArray", categoryArray);
  this.organizer = await User.findById(this.organizer);

  next();
});

tourSchema.post("findOneAndDelete", async function (next) {
  await Review.deleteMany({ tour: this._conditions._id });
});

tourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
});

tourSchema.pre(/^find/, async function (next) {
  this.populate("organizer guides", "_id name email").populate("categories");
  next();
});

tourSchema.methods.toJSON = function () {
  const tour = this;
  const tourObject = tour.toObject();
  delete tourObject.createdAt;
  delete tourObject.updatedAt;
  delete tourObject.__v;
  delete tourObject.organizer.password;
  delete tourObject.organizer.__v;
  delete tourObject.organizer.tokens;
  tourObject.guides.map((el) => delete el.tokens);
  tourObject.categories.map((el) => delete el.__v);
  tourObject.guides.map((guide) => {
    delete guide.password;
    delete guide.__v;
  });
  return tourObject;
};

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
