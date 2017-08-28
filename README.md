# carrito-fajitas

## Introduction

Carrito-fajitas is a web application essentially built with Node, Express and Mongo.
It is meant to be a social app that uses facebook for authentication and allows users to share recipes and events from the app directly to facebook.
There are two main sections in the app:
1. Recipes: like many food apps, users can create and search recipes, add them to favorites and also share them in facebook.
2. Events: this is the key difference with most apps and the focus of “carrito-fajitas”. Users will choose the recipes they like from all the existing recipes, they will set a date, a place, the number of people that they can host, the price that assistants will pay and create an event in which they will cook and share with other users. Users can search events based on their preferences and join them.

You can visit the web app in:

https://carrito-fajitas.herokuapp.com/

## Main technologies used
* Node, Express and Mongo: main backend technologies.
* Passport and Passport-facebook: for authentication.
* Mongoose and mongoose-geojson-schema: ODM for Mongo and Node.
* Nodemon, morgan, ejs and some other libraries for express: to make life easier.
* Bower with Jquery, Bootstrap and Moment: main frontend technologies.
* Heroku: hosting the web app.
* Mongolab: hosting the database.
* Amazon S3: hosting the images uploaded by the users.
* Facebook Javascript SDK: sharing recipes and events.
* Google Maps API, Geocoder, Infowindow, Marker, Autocomplete: searching places, picking a place from the map, showing markers, etc.
* AJAX and localStorage: making data available between frontend and backend.

## Installation instructions
* Create an account in facebook developers, in Amazon S3 and in Heroku.
* to deploy it in Heroku, create a database in Mongolab.
* Create a .env file with the enviroment variables and set those variables in Heroku: FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_MAPS_KEY, MONGODB_URI, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET.  
* Run npm-install (assuming you have Node.js and npm installed and mongo installed and running).
* Run npm run start-dev to start it in your localhost or push it to Heroku and have it online.

## Main functionalities and workflow
* A user will login with facebook and go straight to his profile in order to update a picture, change his username and select an address.
* After that the user can jump straight to the recipes section or to the events section.
* Do you like anything of what you see? Just click the like button and save it to your favorites to retrieve it whenever you want. If you want to share it in facebook, click the share button and that's it!
* Do you want to create a new recipe? Go for it.
* Do you want to create a new event? Take a look at the recipes, click the add button and have them prepared to be included in your next event.
* If you need to search recipes or events, you will have plenty of filters to apply and find exactly what you are looking for.
* And don't forget to click the assist button to join the events you like.
* If you make any mistake, you can edit everything, your profile, your recipes and your events. The only thing you can't do is deleting stuff, what would happen to others if you delete their favorite recipe? That wouldn't be nice...

## Next steps

* Notifications: new assistants to your events, modifications in events you want to assist to.
* Instant messages: once you join an event, you will want to talk with other assistants.
* Scores comments, and reviews: how much did you like a recipe or an event? Was the host nice?
* UX/UI: maybe next time
