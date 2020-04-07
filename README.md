# Project 1: Run Wild - Trail Run Finder

[Run Wild - Trail Run Finder](https://emmbra.github.io/project1/)

## Description
Created a Trail Run Finding app with the following features:

* Users can search for trails to run based on the following criteria:
    * City
    * Difficulty: Easy, Medium, Hard.
    * Number of Trails: 1, 5, 10.
    * Minimum Distance: 0-200 miles.
    * Maximum Distance: 0-200 miles.
* Trail results provide the user with the following information:
    * Trail URL for further information.
    * Trail summary.
    * Trail rating.
    * Trail location.
    * Trail length in miles.
* Current weather for the city searched.
* Five day weather forecast for the city searched.


## Technologies

* HTML5
* CSS3
* JavaScript
* Semantic UI CDN
* jQuery CDN
* moment.js CDN
* Google Fonts
* Open Weather API
* Trail Run Project Data API


## Challenges

In total this project took three collaborators about 60 hours to build including all the time put into research and trial & error.

Difficulties included:

* Using Semantic UI as our CSS framework. Previous to this we only used Bootstrap as a CSS framework so there was a learning curve and lots of research put into Semantic UI CSS and how to override CSS styling with our own CSS customizations.
* Using multiple APIs and feeding information from one API to another. We figured out quickly that the Trail Run Project Data API ajax request needs latitude and longitude or the request fails. We looked into geolocation APIs but figured out that the Open Weather API delivers latitude and longitude based on city searched which felt like a more elegant solution than invading someone's privacy by asking for their location.
* Testing the code for edge cases. For input fields, we assume users will enter correct information, but what happens when they do not? A few examples of how we addressed edge cases include:
    * If user enters a city name that contains numbers or special characters an error modal pops up to guide the user.
    * For maximum and minimum distance, we removed the ability for the user to enter a negative number.


## Screenshots

### Start Screen
![Screenshot of Start Screen](https://github.com/emmbra/project1/blob/master/assets/img/01-screenshot-startscreen.png)

### Search Results
![Screenshot of Search Results](https://github.com/emmbra/project1/blob/master/assets/img/02-screenshot-searchresults.png)

### Error Screen
![Screenshot of Error Screen](https://github.com/emmbra/project1/blob/master/assets/img/03-screenshot-error.png)

## Credits

Thank you to Berkeley Coding Bootcamp, our instructor Emmanual Jucaban, and our TAs Musa Akbari and Sergio Di Martino for answering all our questions and helping us along the way.

Collaborators on this project include:
* [Christina Leung](https://github.com/cgleungsf)
* [Tassia Shibuya](https://github.com/Tassim)
* [Emmett Brady](https://github.com/emmbra)

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit).