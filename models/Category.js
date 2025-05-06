import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    categoryImageURL: { type: String, required: true },
    subcategories: [subcategorySchema],
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
