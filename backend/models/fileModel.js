import mongoose from "mongoose";

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;
