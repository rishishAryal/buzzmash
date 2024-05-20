const mongoose = require("mongoose");

const { Schema } = mongoose;

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,

      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,

      required: true,
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

followSchema.pre("save", function (next) {
  if (this.follower.equals(this.following)) {
    return next(new Error("Users cannot follow themselves"));
  }
  next();
});

module.exports = mongoose.model("Follow", followSchema);
