//Constants
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const chalk = require('chalk');
const hook = new Discord.WebhookClient(`${config.webhookid}`, `${config.webhooktoken}`);

//Boot message and dividers
let line = chalk.red(`----------------------------------------------------------------------------------------------------`);
console.log(line);
console.log(chalk.bgRed.black(`BOOT`));

//Bot Ready And Information
bot.on('ready', () => {
    //Logging in
    console.log(chalk.green(`[${new Date()}] Logged in as "${bot.user.username} (${bot.user.id})"`));
    console.log(chalk.green(`[${new Date()}] Bot is now online!`));
    //Line
    console.log(line);
    //Guilds Avaliable
    console.log(chalk.gray(`Guilds Avaliable: ${bot.guilds.size}`));
    console.log(chalk.magenta(bot.guilds.map(g => g.name).join("\n")));
    //Set game
    bot.user.setGame(config.prefix + `help | ${bot.guilds.size} servers`);
    //Line
    console.log(line);
});

//Debug Messages
bot.on('debug', e => {
    console.log(chalk.blue(`[${new Date()}] ${e}`));
});

//Warn Messages
bot.on('warn', e => {
    console.log(chalk.yellow(`[${new Date()}] ${e}`));
});

//Error Messages
bot.on('error', e => {
    console.log(chalk.red(`[${new Date()}] ${e}`));
});

//Bot Reconnect / Disconnect Messages
bot.on('reconnect', () => {
    console.log(chalk.bgYellow.black(`Reconnecting at ${new Date()}!`));
});

bot.on('disconnect', () => {
    console.log(chalk.bgYellow.black(`Bot Disconnected at ${new Date()}!`));
});

//Client Server Join / Leave Messages
bot.on("guildMemberAdd", member => {
    let guild = member.guild;
    guild.defaultChannel.sendMessage(`Welcome ${member.user} to the server!`);
});

bot.on("guildMemberRemove", member => {
    let guild = member.guild;
    guild.defaultChannel.sendMessage(`${member.user.username} left the server.`);
});

//Client Server Ban / Unban Messages
bot.on('guildBanAdd', (guild, user) => {
    guild.defaultChannel.sendMessage(`${user.username} was banned from the server!`);
});

bot.on('guildBanRemove', (guild, user) => {
    guild.defaultChannel.sendMessage(`${user.username} was unbanned from the server!`);
});

//Bot Join / Leave Alerts
bot.on("guildCreate", guild => {
    guild.defaultChannel.sendMessage(`Hello @everyone! I am an official bot developed by Aceheliflyer!\nJoin our server if you need any help! ${config.discord}`);
    console.log(`I have joined ${guild.name} at ${new Date()}.`);
    bot.user.setGame(`on ${bot.guilds.size} servers`);
});

bot.on("guildDelete", guild => {
    console.log(`I have left ${guild.name} at ${new Date()}.`);
    bot.user.setGame(config.prefix + `help | ${bot.guilds.size} servers`);
});

//Server Pins Update
bot.on('channelPinsUpdate', (channel, time) => {
    channel.guild.defaultChannel.sendMessage(`@everyone The pins for ${channel} have been updated at ${time}!`);
});

//Server Role Create / Delete Messages
bot.on('roleCreate', role => {
    let guild = role.guild;
    guild.defaultChannel.sendMessage(`A role called "${role.name}" has been created!`);
});

bot.on('roleDelete', role => {
    let guild = role.guild;
    guild.defaultChannel.sendMessage(`A role called "${role.name}" has been deleted!`);
});

//Beginning of Commands
//Messaging IF
bot.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    //Messaging LET
    let command = message.content.split(" ")[0];
    let args = message.content.split(" ").slice(1);
    let version = (config.version);
    let owner = (config.owner);
    //Prefix Slice

    command = command.slice(config.prefix.length);

    //Commands
    if (command === "test") {
        message.channel.sendMessage(`Response with \`${Date.now() - message.createdTimestamp}ms\``);
    }
    if (command === "version") {
        message.channel.sendMessage(`Current Running Version: ${version}`);
    }
    if (command === "changelog") {
        message.channel.sendMessage(`\`\`\`Change log for version: ${version}\n${config.change}\nPlease report any bugs!\`\`\``);
    }
    if (command === "news") {
        message.channel.sendMessage(`\`\`\`News:\n${config.news}\`\`\``);
    }
    if (command === "dev") {
        if (message.author.id !== (config.owner)) return;
        message.channel.sendMessage(`\`\`\`Change log for version: ${version}\n${config.change}\nPlease report any bugs!\`\`\``);
        message.channel.sendMessage(`\`\`\`News:\n${config.news}\`\`\``);
        message.delete()
    }
    if (command === "lsay") {
        if (message.author.id !== (config.owner)) return;
        message.channel.sendMessage(args.join(" "));
        message.delete();
    }
    if (command === "csay") {
        if (message.author.id !== (config.owner)) return;
        //Break up message.
        let text = message.content.split(" ");
        //Get the channel from which the user typed.
        let chl = text[1];
        //Adding the rest of the users words as a variable.
        let msg = "";
        for (let i = 2; i < text.length; i++) {
            msg += text[i]+" ";
        }
        //looks through channels to find one that matches, if it is true it sends the message.
        for (const channel of message.guild.channels.values()) {
            if (channel == chl) {
                channel.sendMessage(msg);
            }
        }
    }
    if (command === "setgame") {
        if (message.author.id !== (config.owner)) return;
        bot.user.setGame(args.join(" "));
    }
    if (command === "setstatus") {
        if (message.author.id !== (config.owner)) return;
        bot.user.setStatus(args.join(" "));
    }
    if (command === "serverlist") {
        message.channel.sendMessage(`Guilds Avaliable: \`${bot.guilds.size}\`\n\`\`\`${bot.guilds.map(g=>g.name).join("\n")}\`\`\``);
    }
    if (command === "add") {
        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce((p, c) => p + c);
        message.channel.sendMessage(total);
    }
    if (command === "hi") {
        message.channel.sendMessage("Hi there " + message.author + "!");
    }
    if (command === "date") {
        message.channel.sendMessage(new Date());
    }
    if (command === "getid") {
        message.channel.sendMessage(`Your ID is: \\${message.author}`);
    }
    if (command === "getavatar") {
        message.reply(message.author.avatarURL);
    }
    if (command === "hook") {
        if (message.author.id !== (config.owner)) return;
        hook.sendMessage(args.join(" "));
        message.delete();
    }
    if (command === "discord") {
        message.channel.sendMessage(`Join our official Discord Server! ${config.discord}`)
    }
    if (command === "messages") {
        message.channel.fetchMessages({
            limit: 100
        }).then(messages => {
            message.channel.sendMessage(`${messages.size} messages found! (If it is 100, it can be more.)`);
        });
    }
    if (command === "help") {
        message.channel.sendMessage(`\`\`\`This has been removed and will be readded soon.\`\`\``);
    }
});
//Bot Login
bot.login(config.token);
console.log(chalk.green(`[${new Date()}] Bot Logged In!`));
