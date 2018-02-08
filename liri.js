require("dotenv").config();

// Include request npm package
const request = require('request');

let liriCommand = (process.argv[2]);

// Grab or assemble the subject of the request and store it
let commandSubject = (process.argv[3]);

// console.log("liriCommand= " + liriCommand);
// console.log("commandSubject= " + commandSubject);


switch (liriCommand) {
    case "movie-this":
        // console.log("movies suck");
        queryOMDB (commandSubject);
        break;
    case "do-what-it-says":
        console.log("doit sucks");
        break;
    case "spotify-this-song":
        console.log("spotify sucks");
        break;
    case "my-tweets":
        console.log("tweets suck");
        break;
    default:
        console.log("--------------------------");
        console.log("--------------------------");
        break;
}


function queryOMDB (commandSubject) {

// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + commandSubject + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
// console.log(queryUrl);

// Then run a request to the OMDB API with the movie specified
request(queryUrl, function(e, r, b) {

	if (e) {
    return console.log(error);
  }

  // If the request is successful (i.e. if the response status code is 200)
  if (!e && r.statusCode === 200) {

    // Parse the body of the site and display just the imdbRating property
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log(r.statusCode);
    console.log(`* Title: ${JSON.parse(b).Title}`);
    console.log(`* Year: ${JSON.parse(b).Year}`);
    console.log(`* Rating: ${JSON.parse(b).imdbRating}`);
    console.log(`* RottenTom: ${JSON.parse(b).Ratings[1].Value}`);
    console.log(`* Country: ${JSON.parse(b).Country}`);
    console.log(`* Language: ${JSON.parse(b).Language}`);
    console.log(`* Plot: ${JSON.parse(b).Plot}`);
    console.log(`* Actors: ${JSON.parse(b).Actors}`);


  }


  });
}



function queryTwitter (commandSubject) {

var userName = "p2bilt"	
var queryUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + userName + "&count=20";

// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline



}


function querySpotify(commandSubject) {
	
}


function queryRandom (commandSubject) {
	
}