require("dotenv").config();

// Include request npm package
const request = require('request');
// Include fs core Node package for read and write
const fs = require('fs');
// Include request Spotify api package
const Spotify = require('node-spotify-api');
// Include request Twitter api package
var Twitter = require('twitter');

const keys = require('./keys');


let liriCommand = (process.argv[2]);

// Grab or assemble the subject of the request and store it
let commandWords = (process.argv.slice(3));
let commandSubject = commandWords.join('+');

// console.log("liriCommand= " + liriCommand);
// console.log("commandSubject= " + commandSubject);

liriSwitcher(liriCommand, commandSubject);

function liriSwitcher(command, subject) {

    switch (command) {
        case "movie-this":
            queryOMDB(subject);
            break;
        case "do-what-it-says":
            queryRandom(subject);
            break;
        case "spotify-this-song":
            querySpotify(subject);
            break;
        case "my-tweets":
            queryTwitter();
            break;
        default:
            console.log("--------------------------");
            console.log("--------------------------");
            break;
    }
}

function queryOMDB(movieName) {

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    // Then run a request to the OMDB API with the movie specified
    request(queryUrl, function(e, r, b) {

        var titleTest = JSON.parse(b).Title;
        // redundant with the parsing below, but need it i think, to get the array length to test if RottenTom rating is there
        var bObject = JSON.parse(b);

        // console.log(b);

        if (e) {
            return console.log(error);
        }

        // If the request is successful (i.e. if the response status code is 200)
        if (!e && r.statusCode === 200 && typeof titleTest !== 'undefined') {

            // Parse the body of the site and display just the imdbRating property
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            // console.log(r.statusCode);
            console.log("--------------------------");
            console.log(`* Title: ${JSON.parse(b).Title}`);
            console.log(`* Year: ${JSON.parse(b).Year}`);
            console.log(`* Rating: ${JSON.parse(b).imdbRating}`);

            // check if array is large enough to have a RottenTomato rating. If not, skip
            if (1 < bObject.Ratings.length) {
                console.log(`* RottenTom: ${JSON.parse(b).Ratings[1].Value}`);
            }

            console.log(`* Country: ${JSON.parse(b).Country}`);
            console.log(`* Language: ${JSON.parse(b).Language}`);
            console.log(`* Plot: ${JSON.parse(b).Plot}`);
            console.log(`* Actors: ${JSON.parse(b).Actors}`);
            console.log("--------------------------\n");

        } else {

            console.log("...er, watch this instead:\n");
            liriSwitcher('movie-this', 'Mr+Nobody');

        }


    });
}



function queryTwitter(commandSubject) {

    var client = new Twitter(keys.twitter);


    // var userName = "p2bilt"
    // var queryUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + userName + "&count=20";

    // https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline
var params = {screen_name: 'p2bilt'};
    client.get('statuses/user_timeline', params,  function(error, tweets, response) {
  if(error) throw error;
  // console.log("Tweets:");


for (var i = 0, l = tweets.length; i < l; i++) {
var obj = tweets[i];

// console.log(obj);

console.log("--------------------------");
  console.log(obj.created_at); 
  console.log(obj.text); 
console.log("--------------------------\n");

}
   // The favorites. 
  // console.log("Response:");
  // console.log(response);  // Raw response object. 
});



}



function querySpotify(songName) {

    // var queryUrl = "https://api.spotify.com/v1/search?q=" + commandSubject + "&type=track";

    var spotify = new Spotify(keys.spotify);

    if (songName) {

        spotify.search({ type: 'track', query: songName, limit: 5 }, function(err, data) {

            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // console.log(data);

            for (var i = 0, l = data.tracks.items.length; i < l; i++) {
                var obj = data.tracks.items[i];

                // need to fix this to loop thru artists array, it only gets first artist
                console.log("--------------------------");
                console.log("* Artist: " + obj.artists[0].name);
                console.log("* Song: " + obj.name);
                console.log("* Link: " + obj.external_urls.spotify);
                console.log("* Album: " + obj.album.name);
                console.log("--------------------------\n");
            }

        });

    } else {

        console.log("...er, listen to this instead:\n");
        liriSwitcher("spotify-this-song", "never+gonna+give+you+up");

    }


}



function queryRandom(commandSubject) {

    fs.readFile('random.txt', 'utf8', function(error, data) {

        // If there's an error log it and return
        if (error) {
            return console.log(error);
        }

        console.log("...imma read that text file, do what it says!\n");

        // split data by CSV, put in array
        var dataArr = data.split(",");

        // call switch function with values from array
        liriSwitcher(dataArr[0], dataArr[1]);

    });

}
