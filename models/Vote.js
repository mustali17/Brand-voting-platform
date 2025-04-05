import mongoose from "mongoose";

const { Schema } = mongoose;

const VoteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    votedAt: { type: Date, default: Date.now },
  }, { timestamps: true });

  export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);
  