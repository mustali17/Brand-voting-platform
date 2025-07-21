import mongoose from "mongoose";

const { Schema } = mongoose;

const BrandSchema = new Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    website: { type: String, required: false },
    description: { type: String },
    isVerified: { type: Boolean, default: false },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  }, { timestamps: true });

  BrandSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
