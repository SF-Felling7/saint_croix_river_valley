# St Croix Valley Regional Tourism Alliance Interactive Map #

## About the Application
**St Croix Valley Regional Tourism Alliance Interactive Map** is a full-stack web application that complements the St Croix Valley Regional Tourism Alliance's existing website and print visitor guide.  The map allows users to view featured places by category (Dining, Shopping, Nature, Lodging) or view suggested trips including driving directions from the user's current location.

Administrator privileges allow the staff at St Croix Valley Regional Tourism Alliance to add, edit or delete featured places on the map.  Administrator can also add, edit or delete suggested trips with name, trip description and trip stops selected from featured places.  Administrator can also add, edit or delete other administrators.  This administrator functionality provides the Alliance to update information easily and more frequently; their print publication is produced once/year.  The website does not offer a dynamic or interactive user experience in planning a trip.  

This project was built over a three week period during our time at Prime Digital Academy.


## Getting Started
### Clone and npm install
In order to get this application up and running on your local host you will need to have all of the dependencies installed.  To do so, you'll simply get into the cloned folder via terminal.  Once there, you can type the command: `npm install`.

### SQL database
This application was built with a SQL database, so you will need to see the queries.sql file in order to set up the database.  In there you will find the queries to create the tables in the database.  You will have to add your own data to the database either through the admin page or database administrator tool (e.g. Postico).

### Google Maps API Key
The application uses a google maps API key.  In order to get your own key you will need to follow the steps below:
* Visit the APIs Console at https://code.google.com/apis/console and log in with your Google Account.
* Click the Services link from the left-hand menu.
* Activate the Google Maps API v3 service.
* Click the API Access link from the left-hand menu.  Your API key is available from the   API Access page, in the Simple API Access section.  Maps API applications use the Key for browser apps.

### Firebase Key
The application uses google firebase for authentication that includes a specific key. To get a firebase key and use it your project follow these steps:

* click getting started at https://firebase.google.com/
* click create a project - and give it an appropriate title
* in authentication tab enable sign in with google and email/password
* in the settings page menu click on service accounts which will take you to a new window where you can click generate new private key
* copy your key and paste it into decoder.js
* in config.js add your own var = config generated from the new projected you created


## Image of Application on Laptop and Mobile
![image](<img width="860" alt="group" src="https://user-images.githubusercontent.com/25421749/28001109-c6950afc-64ef-11e7-8bae-6885bca50ebe.png">)

## Built by
* Amal Ali https://github.com/aali05
* Colin Wymore https://github.com/cwymore
* Neota Moe https://github.com/neotamoe
* Sean Felling https://github.com/SF-Felling7/


## Built With
* Express
* AngularJS
* Node.js
* PostgreSQL
* Firebase authentication
* Bootstrap
* Bootstrap UI
* ng-map
* Google Maps API
* Google Places API


## Acknowledgements
* Instructors and staff at Prime Digital Academy
* Rosemary Mansfield at St Croix Valley Regional Tourism Alliance
