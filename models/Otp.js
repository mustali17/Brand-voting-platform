import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 },
});

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);