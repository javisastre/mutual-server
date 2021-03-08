const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alertSchema = new Schema(
  {
    person: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true },
    location: { type: [], default: [41.39, 2.15] },
    publish: { type: Boolean, default: false },
    category: { type: [] },
    story: { type: String, default: "" },
    hour: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;
