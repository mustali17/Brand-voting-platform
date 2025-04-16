import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: [{ type: String, required: true }],
  description: { type: String },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
