# carrito-fajitas

## Introduction

Carrito-fajitas is a web application built with Node, Express and Mongo. It allows users to create events where they invite others to have a meal with them. The events have the recipes that will be cooked, the location and date of the event, the number of people that can assist and the price per person. Users can also add, edit and search recipes, apart from using them for an event. 

## Main technologies and libraries used
* Jquery
* Bootstrap
* Moment
* Amazon S3

## Main functionalities implemented

* Signup: the signup is done with passport-facebook library.
* Google Maps API: 
 * Show the locations in a map.
 * Get coordinates from addresses.
 * Set coordinates from putting markers.
* Profile: view and edit profile details

## Bugs


## Next steps

* Use google maps autofill?
* Publish on facebook
* Fix date and time to be printed properly for update
* Redirect to home when there is no user
* Add small map to events show and list view 
* Max width for inside events 
* Search by location
* List of assistants

## Fixed bugs

* The session breaks too quickly -> Change parameters for session in app.js