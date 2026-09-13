import mongoose from "mongoose";

const momentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    name: { type: String, trim: true, default: "A Brew Lover", maxlength: 60 },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Moment", momentSchema);
