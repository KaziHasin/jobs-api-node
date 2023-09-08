const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      minlength: 3,
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["interview", "decline", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
