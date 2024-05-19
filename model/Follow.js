const mongoose = require("mongoose");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Ensure a unique follow relationship
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Ensure a user cannot follow themselves
followSchema.pre('save', function(next) {
  if (this.follower.equals(this.following)) {
    return next(new Error('Users cannot follow themselves'));
  }
  next();
});


module.exports = mongoose.model("Follow", followSchema);
