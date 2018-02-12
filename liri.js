require("dotenv").config();
const keys = require('./keys');
// Include request npm package
const request = require('request');
// Include fs core Node package for read and write
const fs = require('fs');
// Include request Spotify api package
const Spotify = require('node-spotify-api');
// Include request Twitter api package
var Twitter = require('twitter');

// grab the liri request
let liriCommand = (process.argv[2]);

// Grab or assemble the subject of the request and store it
let commandWords = (process.argv.slice(3));
let commandSubject = commandWords.join('+');



liriSwitcher(liriCommand, commandSubject);

function liriSwitcher(command, subject) {

    switch (command) {
        case "movie-this":
            queryOMDB(subject);
            writeItLogIt("COMMAND: " + command + " / SEARCH: " + subject);
            break;
        case "do-what-it-says":
            queryRandom(subject);
            writeItLogIt("COMMAND: " + command + " / SEARCH: " + subject);
            break;
        case "spotify-this-song":
            querySpotify(subject);
            writeItLogIt("COMMAND: " + command + " / SEARCH: " + subject);
            break;
        case "my-tweets":
            queryTwitter();
            writeItLogIt("COMMAND: " + command + " / SEARCH: " + subject);
            break;
        default:
        writeItLogIt("--------------------------", true);
        writeItLogIt("something is awfully wrong", true);
        writeItLogIt("--------------------------\n", true);
            break;
    }
}


function writeItLogIt(writeIt, logIt) {
 if (logIt) {
    console.log(writeIt);
 }

    fs.appendFile('log.txt', writeIt+'\n', function (err) {
    });

}


function queryOMDB(movieName) {

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // Then run a request to the OMDB API with the movie specified
    request(queryUrl, function (err, r, b) {

        var titleTest = JSON.parse(b).Title;
        // redundant with the parsing below, but need it i think, to get the array length to test if RottenTom rating is there
        var bObject = JSON.parse(b);

        if (err) {
            return writeItLogIt(error, true);
        }

        // If the request is successful (i.e. if the response status code is 200)
        if (!err && r.statusCode === 200 && typeof titleTest !== 'undefined') {

            // Parse the body of the site and display just the imdbRating property
            writeItLogIt("--------------------------", true);
            writeItLogIt(`* Title: ${JSON.parse(b).Title}`, true);
            writeItLogIt(`* Year: ${JSON.parse(b).Year}`, true);
            writeItLogIt(`* Rating: ${JSON.parse(b).imdbRating}`, true);

            // check if array is large enough to have a RottenTomato rating. If not, skip
            if (1 < bObject.Ratings.length) {
                writeItLogIt(`* RottenTom: ${JSON.parse(b).Ratings[1].Value}`, true);
            }

            writeItLogIt(`* Country: ${JSON.parse(b).Country}`, true);
            writeItLogIt(`* Language: ${JSON.parse(b).Language}`, true);
            writeItLogIt(`* Plot: ${JSON.parse(b).Plot}`, true);
            writeItLogIt(`* Actors: ${JSON.parse(b).Actors}`, true);
            writeItLogIt("--------------------------\n", true);

        } else {

            writeItLogIt("...er, watch this instead:\n");
            liriSwitcher('movie-this', 'Mr+Nobody');

        }


    });
}



function queryTwitter(commandSubject) {

    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: 'p2bilt',
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) throw error;

        for (var i = 0, l = tweets.length; i < l; i++) {
            var obj = tweets[i];

            // make date more readable; i could use moment.js to make it even better
            var split = obj.created_at.split(' ');
            var date = split.splice(1, 2);
            var year = split[split.length - 1];
            date.push(year);
            date = date.join(' ');

            writeItLogIt(i + 1, true);
            writeItLogIt("--------------------------", true);
            writeItLogIt("> " + obj.text, true);
            writeItLogIt("--Tweeted on " + date, true);
            writeItLogIt("--------------------------\n", true);

        }

    });



}



function querySpotify(songName) {

    var spotify = new Spotify(keys.spotify);

    if (songName) {

        spotify.search({
            type: 'track',
            query: songName,
            limit: 5
        }, function (err, data) {

            if (err) {
                return writeItLogIt('Error occurred: ' + err, true);
            }

            for (var i = 0, l = data.tracks.items.length; i < l; i++) {
                var obj = data.tracks.items[i];

                // get all artists name from artist array
                var artistes = obj.artists.map(function (item) {
                    return item['name'];
                });
                writeItLogIt(i + 1, true);
                writeItLogIt("--------------------------", true);
                writeItLogIt("* Artist(s): " + artistes.join(', '), true);
                writeItLogIt("* Song: " + obj.name, true);
                writeItLogIt("* Link: " + obj.external_urls.spotify, true);
                writeItLogIt("* Album: " + obj.album.name, true);
                writeItLogIt("--------------------------\n", true);
            }

        });

    } else {

        writeItLogIt("...er, listen to this instead:\n", true);
        liriSwitcher("spotify-this-song", "never+gonna+give+you+up");

    }


}



function queryRandom(commandSubject) {

    fs.readFile('random.txt', 'utf8', function (error, data) {

        // If there's an error log it and return
        if (error) {
            return writeItLogIt(error, true);
        }

        writeItLogIt("...imma read that text file, do what it says!\n", true);

        // split data by CSV, put in array
        var dataArr = data.split(",");

        // call switch function with values from array
        liriSwitcher(dataArr[0], dataArr[1]);

    });

}