import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  subcategories: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
