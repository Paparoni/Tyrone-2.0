// Tyrone by Aj
// See how long it takes Tyrone to come online. Timer
var loading = new Date().getTime(),
    load_time;


// create a spawn child process to run python script
const spawn = require("child_process").spawn;

const pythonSetup = spawn('python',["Python/setup.py"]);

pythonSetup.stdout.on('data', (data) => {
    console.log(data)
});

const Discord = require('discord.js');
const Tyrone = new Discord.Client();
// Define Constants
const insults = require("./insults.js").insults;
const styles = require("./styles.js").styles;

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
    console.log('%c Tyrone Online! Connected in ' + load_time + ' seconds. v1.0', styles);

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
        var commandinit = message.content.toLowerCase().replace("$" + command + " ", "").split(" / ", 2);
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
                        message.channel.send(commanddata + "'s latest tweet says: \"" + tweets[0].text + " \" with " + tweets[0].favorite_count + " likes and " + tweets[0].retweet_count + " retweets.");
                    } else {
                        message.reply("I'm sorry, what?")
                    }
                });
                break;
            case 'join':
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                        .then(connection => {
                            message.reply('Yo i\'m here.');
                        })
                        .catch(console.log);
                } else {
                    message.reply('You\'re not even in a voice channel :/');
                }
                break;
            case 'leave':
                   if (message.member.voiceChannel) {
                    message.member.voiceChannel.leave();
                } else {
                    message.reply('How you gonna tell me to leave a voice channel you\'re not even in?');
                }
                break;
            case 'soundboard':
                var sound_name = commanddata;
                var soundFile;
                console.log(sound_name.length);
                switch (sound_name) {

                    case 'bruh':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/269/original/bruh?1469744327'
                        break;
                    case 'skinnypenis':
                        soundFile = 'https://sound.peal.io/ps/audios/000/002/147/original/youtube.mp3?1493768525'
                        break;
                    case 'crackkid':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/271/original/crack_kid?1469744465'
                        break;
                    case 'apotato':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/262/original/a_potato_flew_around_my_room?1469744409'
                        break;
                    case 'aladdin':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/009/original/show-the-world.wav?1469744355'
                        break;
                    case 'deeznuts':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/385/original/deeznuts.wav?1469744459'
                        break;
                    case 'cantbelieve':
                        soundFile = 'https://sound.peal.io/ps/audios/000/005/317/original/youtube.mp3?1511269037'
                        break;
                    case 'hellnaw':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/375/original/When_your_ex_texts_34__Do_you_miss_me_34_.mp3?1469744407'
                        break;
                    case 'iwannadie':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/713/original/If_I_were_to_die.mp3?1469744405'
                        break;
                    case 'beakfast':
                        soundFile = 'https://sound.peal.io/ps/audios/000/001/342/original/youtube.mp3?1485216239';
                        break;
                    case 'jamaican':
                        soundFile = 'https://sound.peal.io/ps/audios/000/006/352/original/youtube.mp3?1513925197'
                        break;
                    case 'churchgirl':
                        soundFile = 'https://sound.peal.io/ps/audios/000/006/353/original/youtube.mp3?1513925346'
                        break;
                    case 'dudewtf':
                        soundFile = 'https://sound.peal.io/ps/audios/000/006/354/original/youtube.mp3?1513925423'
                        break;
                    case 'kamehameha':
                        soundFile = 'https://sound.peal.io/ps/audios/000/000/027/original/kamehameha.wav?1469744249'
                        break;
                    default:
                        message.reply('Tf is that?');
                }
                message.member.voiceChannel.join()
                    .then(connection => {
                        const dispatcher = connection.playArbitraryInput(soundFile);
                    })
                    .catch(console.log);
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
/* @BREAK
app.listen(port, () => {
    console.log('Tyrone is running on http://localhost:' + port);
});
*/
setInterval(() => {
    http.get('https://tyroneload.herokuapp.com');
    console.log("Server pinged");
}, 900000);
