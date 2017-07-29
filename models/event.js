const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CATEGORIES = require("./food-categories");

const EventSchema = new Schema({
  name: {
    type: String,
    required: [true, "You need a name for your Event"]
  },
  categories: [{
    type: String,
    enum: CATEGORIES,
    required: true
  }],
  eventDate: {
    type: Date
  },
  numberPeople: {
    type: Number,
    required: true
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _favorites: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _requests: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _assistants: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  }],
  price: {
    type: Number,
    required: true
  },
  location: Schema.Types.GeoJSON
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

EventSchema.index({
  location: "2dsphere"
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;