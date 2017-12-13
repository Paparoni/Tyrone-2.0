// Tyrone by Aj
const Discord = require('discord.js');
const Tyrone = new Discord.Client();
// See how long it takes Tyrone to come online. Timer
var loading = new Date().getTime();
var load_time;

// Define Constants
require("./insults.js");

// Perform a GET request for a JSON api
const getJSON = require('get-json');

const RiveScript = require("rivescript");
const TyroneAI = new RiveScript();

var Twitter = require('twitter');

var TwitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

Tyrone.on('ready', () => {
    var currentMillisecondsPassed = new Date().getTime() - loading;
    // Convert milliseconds to seconds for readibility.
    load_time = currentMillisecondsPassed / 1000;
    // Print to the console when the bot has been loaded.
    console.log('\x1b[32m%s\x1b[0m', 'Tyrone Online! Connected in ' + load_time + ' seconds. v1.0');

});

TyroneAI.loadDirectory("AI", loading_complete, load_error);

function loading_complete(batch_num) {

    TyroneAI.sortReplies();
    Tyrone.on('message', message => {
        if (message.isMentioned(Tyrone.user) == true) {
            if (message.author == Tyrone.user) {

            } else {
                var getreply = TyroneAI.reply("local-user", message.content.toLowerCase().replace(Tyrone.user.toString(), ""));
                message.reply(getreply);
            }
        }
    });
}

function load_error(error) {
    console.log(" Error when loading files: " + error);
}

Tyrone.on('message', message => {
            /*  if (message.content === 'ping') {
                message.reply('pong');
              }
            */
            // Detect if the message is a commmand.
            if (message.content.toLowerCase().charAt(0) == "$") {
                // gets the command used name. For example if the user types $hi this variable will contain "hi"
                var command = message.content.split("$").pop().split(' ').shift();
                // gets the user input after the command
                var commandinit = message.content.toLowerCase().replace("$" + command, "").split(" / ", 2);
                var commanddata = commandinit[0];
                var commanddata2 = commandinit[1];
                // find out witch command is being used and write the code for it
                switch (command) {
                    // begin define command
                    case 'define':
                        var word = commanddata;
                        getJSON("http://api.urbandictionary.com/v0/define?term=" + word, function(error, c) {
                            if (error) {
                                throw Error(error);

                            } else {
                                if (c.list[0] == undefined) {
                                    message.reply("nigga stfu that don't mean shit.");
                                } else {
                                    var getword = c.list[0].word,
                                        word = getword.charAt(0).toUpperCase() + getword.substring(1),
                                        definition = c.list[0].definition,
                                        out = "" + word + ": " + definition;

                                    message.reply(out);
                                }

                            }
                        });
                        break;

                    case 'iplocation':
                        var ipadd = commanddata;
                        getJSON("http://freegeoip.net/json/" + ipadd, function(error, c) {
                            if (error) {
                                message.reply("what fool?");
                            } else {
                                if (c.ip == undefined) {
                                    message.reply("what fool?");
                                } else {
                                    message.reply("Country: " + c.country_name + " City: " + c.city + ", " + c.region_name + " " + c.zip_code);
                                }
                            }
                        });
                        break;
                    case 'insult':
                        var insulteename = commanddata;
                        message.channel.send(insulteename + " " + insults[Math.floor(Math.random() * insults.length)]);

                        break;
                    case 'test':
                        message.channel.send("test command data 1: " + commanddata + " command data 2: " + commanddata2);
                        break;

                    case 'tweet':
                        var params = {
                            screen_name: commanddata
                        };
                        TwitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
                                if (!error) {
                                    message.channel.send(commanddata +"'s latest tweet says: " + tweets[0].text + " with: " + tweets[0].favorite_count + " likes and " + tweets[0].retweet_count + " retweets");
                                    }
                                    else {
                                        message.reply("I'm sorry, what?")
                                    }
                                });
                            break;
                            // if the command isn't listed above return this message 
                            default:
                            message.reply("That command doesn't exist retard");
                        }
                }
            });

        Tyrone.login(process.env.TOKEN);

        // Web app (Express + EJS)
        const http = require('http');
        const express = require('express');
        const app = express();

        const port = process.env.PORT || 5000;

        app.set('view engine', 'ejs');

        app.use(express.static(__dirname + '/public'));

        app.get('/', (request, response) => {
            response.render('index');
        });

        app.listen(port, () => {
            console.log('Tyrone is running on http://localhost:' + port);
        });

        setInterval(() => {
            http.get('https://tyroneload.herokuapp.com');
            console.log("Server pinged");
        }, 900000);
