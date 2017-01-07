const cmd = require("./commands.js");
const Command = cmd.Command;
const config = require("../config.json");
this.commands = [];
this.commands.push(new Command(`news`, `Prints out the news.`, function(input){
  input.msg.channel.sendMessage(`\`\`\`News:\n${config.news}\`\`\``);
}));
