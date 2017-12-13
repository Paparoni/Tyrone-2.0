// Discord.js bot
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
            if(message.author == Tyrone.user){
                
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
        // gets the user input after the command or gets all the text after the first space.
        var commanddata = message.content.substring(message.content.indexOf(" ") + 1);
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
                message.channel.send("test");
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

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
 http.get('http://discordjs-heroku.herokuapp.com');
}, 900000);
