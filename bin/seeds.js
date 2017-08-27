// const mongoose = require("mongoose");
// mongoose.connect("mongodb://heroku_sw09fgnv:676oa0maoh5ismbmblkq5godda@ds155473.mlab.com:55473/heroku_sw09fgnv");
// const User = require("../models/user");
// const Recipe = require("../models/recipe");
// const Event = require("../models/event");

// const userIds = [];

// User.collection.drop();
// Event.collection.drop();
// Recipe.collection.drop();

// // Iteration #1
// const userData = [{
//   username: "Pepe",
// },
// {
//   username: "Juana",
// },
// {
//   username: "Nico",
// },
// {
//   username: "Dani",
// },
// {
//   username: "Mike",
// },
// {
//   username: "María",
// }
// ];

// User.create(userData, (err, docs) => {
//   if (err) {
//     throw err;
//   }

//   docs.forEach((user) => {
//     user.save((err) => {
//       if (err) {
//         return next(err);
//       }
//     });
//   });
// });

// User.find({}, (err) => {
//   if (err) {
//     throw err;
//   }
// }).then(function (users) {
//   users.forEach(function (user) {
//     userIds.push(user._id);
//   });
// });

// console.log(userIds);


// mongoose.connection.close();