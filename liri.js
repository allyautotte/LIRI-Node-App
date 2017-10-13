//Liri should take in the following
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

var dataKeys = require('./keys.js');
var fs = require('fs'); 
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var getMovie = function(movieName) {
	console.log(movieName);
	if (movieName === undefined) {
		movieName = 'Pulp+Fiction';
	}

var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json&apikey=40e9cece";	
request(url, function(error, response, body) {
	if (!error && response.statusCode === 200) {
		var jsonMovieData = JSON.parse(body);
// console.log(jsonMovieData);
var movieData = [];
	  movieData.push({
	  'Title: ' : jsonMovieData.Title,
      'Year: ' : jsonMovieData.Year,
      'Rated: ' : jsonMovieData.Rated,
      'IMDB Rating: ' : jsonMovieData.imdbRating,
      'Country: ' : jsonMovieData.Country,
      'Language: ' : jsonMovieData.Language,
      'Plot: ' : jsonMovieData.Plot,
      'Actors: ' : jsonMovieData.Actors,
      'Rotten Tomatoes Rating: ' : jsonMovieData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonMovieData.tomatoURL,
	});

	  console.log(movieData);
		}
	});
}


var getArtist = function(artist) {
	return artist.name;
};

var spotifyKeys = new Spotify({
  id: '318193bfed8643bf8053799004dd20ee',
  secret: '4d17b8d835d940329862e84aa5e954d6'
});

var getSong = function(songName) {
	if (songName === undefined) {
		songName = 'Ignition';
	};

spotifyKeys.search({ type: 'track', query: songName }, function(error,data) {
	if (error) {
		console.log(error);
		return;
	}

var songs = data.tracks.items;
var info = [];

for (var i = 0; i < songs.length; i++) {
	info.push({
		'artist: ' : songs[i].artists.map(getArtist),
		'song: ' : songs[i].name,
		'preview: ': songs[i].preview_url,
		'album: ' : songs[i].album.name,
	});
}	
	console.log(info);

    });	
};

var getTweets = function() {
	var user = new Twitter(dataKeys);
	var tweeter = { screen_name: 'allyautotte', count: 20 };

	user.get('statuses/user_timeline', tweeter, function(error, tweets, response) {
		if(error) console.log(error);
		if (!error) {
			var data = [];
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				data.push ({
					'created at: ' : tweets[i].created_at,
					'Tweets: ' : tweets[i].text,
				});
			}
			console.log(data);
		};
	});
};


var doWhatItSays = function() {
	fs.readFile('random.txt', 'utf8', function(error, data) {
		console.log(data);
	var commands = data.split(',');
	
	if (commands.length == 2) {
		choose(commands[0], commands[1]);
	} else if (commands.length === 1) {
		choose(commands[0]);
	}

	});
}


var choose = function(data, functionData){
	switch (data) {
		case 'my-tweets':
		getTweets();
		break;
		case 'spotify-this-song':
		getSong(functionData);
		break;
		case 'do-what-it-says':
		doWhatItSays();
		break;
		case 'movie-this':
		getMovie(functionData);
		break;
	}
}


var runThis = function(argOne, argTwo) {
  choose(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);



