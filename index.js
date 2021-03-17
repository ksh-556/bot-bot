const Discord = require('discord.js');
const client = new Discord.Client();
let fs = require('fs');
const { get } = require("snekfetch"); 

const { prefix, token, color, ver} = require('./config.json');

client.on('ready',() => {
  console.log(`Bot tag: ${client.user.tag}`);
  console.log(`Guilds: ${client.guilds.cache.size}`);
  
  client.user.setActivity(`with ${prefix}giveaway & ${prefix}help`, { type: 'PLAYING' });
});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on('message', async message => {
  if (message.content.startsWith(`${prefix}`)) {
    let file_name = `${message.content.split(' ')[0].replace(prefix, '')}.js`;
    if(!fs.existsSync('./commands/' + file_name)) return undefined;
    if(fs.existsSync('./commands/' + file_name)) {
      client.commands.get(file_name.replace('.js', '')).execute(client, message);
    }
  }
});


let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));


client.on("message", message => {
    if (message.author.bot) return; // ignore bots

    // if the user is not on db add the user and change his values to 0
    if (!db[message.author.id]) db[message.author.id] = {
        xp: 0,
        level: 0
      };
    db[message.author.id].xp++;
    let userInfo = db[message.author.id];
    if(userInfo.xp > 100) {
        userInfo.level++
        userInfo.xp = 0
        message.reply(`bravo vous avez augmenter de 1 level maintenant vous êtes a ${userInfo.level}`)
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (message.content.startsWith(prefix + "rank")) {
        let userInfo = db[message.author.id];
        let member = message.mentions.members.first();
        let embed = new Discord.MessageEmbed()
        .setColor(color)
        .addField("Level", userInfo.level, true)
        .addField("XP", userInfo.xp+"/100", true);
        if(!member) return message.channel.send(embed)
        let memberInfo = db[member.id]
        let embed2 = new Discord.MessageEmbed()
        .setColor("FF00FF")
        .addField("Level", memberInfo.level)
        .addField("XP", memberInfo.xp+"/100")
        message.channel.send(embed2)
    }
    fs.writeFile("./database.json", JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
})


           
 

       client.on("message", message => {
	if (message.content.startsWith(prefix + "giveaway")) {

message.delete()
}
});


client.on("message",  message => {
	const args = message.content.slice(prefix).trim().split(/ +/);

const user = message.author;

const say = args.join(" ");
console.log(say)

if(message.content.startsWith(prefix+'av')){
    
        
        if(message.mentions.users.size){
            let member=message.mentions.users.first()
        if(member){
            const emb=new Discord.MessageEmbed().setImage(member.displayAvatarURL() + '?size=4096').setTitle(member.username)
            message.channel.send(emb)
            
        }
        else{
            message.channel.send("Sorry none found with that name")

        }
        }else{
        	let size = '?size=4096'
            const emb=new Discord.MessageEmbed().setImage(message.author.displayAvatarURL() + "?size=4096").setTitle(message.author.username)
            message.channel.send(emb)
        }
}

  });
  
  client.on("message", message => {
  const args = message.content.split(" ").slice(1);
  
  const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}








 
  if (message.content.startsWith(prefix + "eval")) {
  	function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
    if(message.author.id != 740811728593616980) return message.channel.send("bonne tentative")
    try {
      const code = args.join(" ");
      let evaled = eval(code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`css\n${clean(err)}\n\`\`\``);
    }
  }
  });
  
  
  
  //débute//
  
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Client on Message
client.on('message', msg => {

	// Quits the Bot
	if (msg.content === '!quitbot' && msg.author.id === '740811728593616980') {
		msg.reply('Goodbye!');
		client.destroy();
		console.log('Disconnected...');
		process.exit();

	// Reminds the User
	} else if (msg.content.toLowerCase().startsWith('!remindme')) {
		var message = msg;
		try {
			
			// Variables
			var returntime;
			var timemeasure;
			msg = msg.content.split(' ');
			console.log('Message recieved from ' + message.author.id + ' at ' + Date.now().toString());

			// Sets the return time
			timemeasure = msg[1].substring((msg[1].length - 1), (msg[1].length))
			returntime = msg[1].substring(0, (msg[1].length - 1))

			// Based off the delimiter, sets the time
			switch (timemeasure) {
				case 's':
					returntime = returntime * 1000;
					break;

				case 'm':
					returntime = returntime * 1000 * 60;
					break;

				case 'h':
					returntime = returntime * 1000 * 60 * 60;
					break;

				case 'd':
					returntime = returntime * 1000 * 60 * 60 * 24;
					break;

				default:
					returntime = returntime * 1000;
					break;
			}

			// Returns the Message
			client.setTimeout(function () {
				// Removes the first 2 array items
				msg.shift();
				msg.shift();

				// Creates the message
				var content = msg.join();
				content = content.replaceAll(',', ' ');
				message.reply(content);
				console.log('Message sent to ' + message.author.id + ' at ' + Date.now().toString());
			}, returntime)
		} catch (e) {
			message.reply("An error has occured, please make sure the command has a time delimiter and message");
			console.error(e.toString());
		}

	// List of commands
	}else if (msg.content.toLowerCase() === "!reminderbot") {
		msg.channel.send("Hello I am reminder bot:\n\n!reminderbot \t\tList of all Commands\n!quit \t\tTurns off the bot\n!remindme \t\t {time} {message}\n\t{time} Please have the amount of time be denoted by a time character.\n\t\tm - minutes, s - seconds, d - days.\n!remind {@User} {time} {message}\n\t{time} Please have the amount of time be denoted by a time character.\n\t\tm - minutes, s - seconds, d - days.\n\t{@User} So far you can use the user's name with the @ symbol.\n\n--- Created and Managed by pixlbreaker ---");
	
	// Reminds a specific user
	} else if (msg.content.toLowerCase().startsWith('!remind')) {
		var message = msg;
		try {
			
			// Variables
			var returntime;
			var timemeasure;
			var userid;
			msg = msg.content.split(' ');
			console.log('Message recieved from ' + message.author.id + ' at ' + Date.now().toString());

			// Sets the userid for the recipiant
			userid = client.users.get(msg[1].replace('<@!', '').slice(0, -1))
			
			// Sets the return time
			timemeasure = msg[2].substring((msg[2].length - 1), (msg[2].length))
			returntime = msg[2].substring(0, (msg[2].length - 1))

			// Based off the delimiter, sets the time
			switch (timemeasure) {
				case 's':
					returntime = returntime * 1000;
					break;

				case 'm':
					returntime = returntime * 1000 * 60;
					break;

				case 'h':
					returntime = returntime * 1000 * 60 * 60;
					break;

				case 'd':
					returntime = returntime * 1000 * 60 * 60 * 24;
					break;

				default:
					returntime = returntime * 1000;
					break;
			}

			// Returns the Message
			client.setTimeout(function () {
				// Removes the first 2 array items
				msg.shift();
				msg.shift();
				msg.shift();

				// Creates the message
				var content = msg.join();
				content = content.replaceAll(',', ' ');
				message.channel.send(userid + content);
				console.log('Message sent to ' + userid + ' at ' + Date.now().toString());
			}, returntime)
		} catch (e) {
			message.reply("An error has occured, please make sure the command has a time delimiter and message");
			console.error(e.toString());
		}

	// List of Commands
	} 

});

//fin//

//début de la réaction//
client.on("message", async message => {
	if(message.content === prefix + "rec") {

message.react('👍').then(() => message.react('👎'));

const filter = (reaction, user) => {
	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
};

  	message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first();

		if (reaction.emoji.name === '👍') {
			message.reply('you reacted with a thumbs up.');
		} else {
			message.reply('you reacted with a thumbs down.');
		}
	})
	.catch(collected => {
		message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
});
}
});


client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

//fin de la réaction//
client.login(process.env.TOKEN);