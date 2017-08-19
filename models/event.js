const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CATEGORIES = require("./food-categories");

const EventSchema = new Schema({
  name: {
    type: String,
    required: [true, "You need a name for your event"]
  },
  eventDate: {
    type: Date
  },
  numberPeople: {
    type: Number,
    required: [true, "Specify how many people your event will be hosting"]
  },
  price: {
    type: Number,
    required: [true, "Specify the price per person"]
  },
  categories: [{
    type: String,
    enum: CATEGORIES
  }],
  location: Schema.Types.GeoJSON,
  _creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _favorites: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  _assistants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  numberAssistants: {
    type: Number,
    default: 0
  },
  isFull: {
    type: Boolean,
    default: false
  },
  _recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}).plugin(function (schema) {
  schema.pre("save", function (next) {
    this.isFull = (this.numberAssistants >= this.numberPeople);

    next();
  });
});

EventSchema.index({
  location: "2dsphere"
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;