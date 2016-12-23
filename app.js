//Constants
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const chalk = require('chalk');

//Boot message
let l = chalk.red(`----------------------------------------------------------------------------------------------------`);
console.log(l);
console.log(chalk.bgRed.black(`BOOT`));

//Start of Bot
bot.on('ready', () => {
  console.log(chalk.bgGreen.black(`[${new Date()}] Logged in as "${bot.user.username} (${bot.user.id})"`));
  console.log(chalk.green(`[${new Date()}] Bot is now online!`));
  console.log(`Guilds Avaliable: ${bot.guilds.size}`);
  console.log(bot.guilds.map(g=>g.name).join("\n"));
  console.log(l);
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

//Bot Disconnection / Reconnection Messages
bot.on('disconnect', () => {
  console.log(chalk.bgYellow.black(`Bot Disconnected at ${new Date()}!`));
});
bot.on('reconnect', () => {
  console.log(chalk.bgYellow.black(`Reconnecting at ${new Date()}!`));
});

//Player Join / Leave Messages
bot.on("guildMemberAdd", member => {
  let guild = member.guild;
  guild.defaultChannel.sendMessage(`Welcome ${member.user} to the server!`);
});
bot.on("guildMemberRemove", member => {
    let guild = member.guild;
    guild.defaultChannel.sendMessage(`${member.user.username} disconnected from the server.`);
});

//Player Ban / Unban Messages
bot.on('guildBanAdd', (guild, user) => {
  guild.defaultChannel.sendMessage(`${user.username} was banned from the server!`);
});
bot.on('guildBanRemove', (guild, user) => {
  guild.defaultChannel.sendMessage(`${user.username} was unbanned from the server!`);
});

//Bot Join / Leave Alerts
bot.on("guildDelete", guild => {
  console.log(`I have left ${guild.name} at ${new Date()}.`);
});
bot.on("guildCreate", guild => {
  guild.defaultChannel.sendMessage(`Hello @everyone! I am an official bot developed by Aceheliflyer!\nI'm glad to be here!`);
  console.log(`I have joined ${guild.name} at ${new Date()}.`);
});

//Pin Update
bot.on('channelPinsUpdate', (channel, time) => {
  channel.guild.defaultChannel.sendMessage(`@everyone The pins for ${channel} have been updated at ${time}!`);
});

//Role Create / Delete Messages
bot.on('roleCreate', role => {
  let guild = role.guild;
  guild.defaultChannel.sendMessage(`A role called "${role.name}" has been created!`);
});
bot.on('roleDelete', role => {
  let guild = role.guild;
  guild.defaultChannel.sendMessage(`A role called "${role.name}" has been deleted!`);
});

//Messaging IF
bot.on('message', message => {
  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;
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
    message.delete()
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
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p+c);
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
  if (command === "help") {
    message.channel.sendMessage(`\`\`\`This has been removed and will be readded soon.\`\`\``);
  }
});
//Bot Login
bot.login(config.token);
console.log(chalk.bgGreen.black(`[${new Date()}] Bot Logged In!`));
