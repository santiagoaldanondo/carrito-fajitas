const mongoose = require("mongoose");
const GeoJSON = require("mongoose-geojson-schema");
const Schema = mongoose.Schema;
const CATEGORIES = require("./food-categories");

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "You need a username"],
    unique: [true, "That name already exists"]
  },
  facebookID: String,
  _recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  _events: [{
    type: Schema.Types.ObjectId,
    ref: "Event"
  }],
  address: String,
  picturePath: String,
  location: Schema.Types.GeoJSON
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

UserSchema.index({
  location: "2dsphere"
});

const User = mongoose.model("User", UserSchema);
module.exports = User;