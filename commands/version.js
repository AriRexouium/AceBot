const cmd = require("./commands.js");
const Command = cmd.Command;
const config = require("../config.json");
this.commands = [];
this.commands.push(new Command(`version`, `Prints out current running version.`, function(input){
  input.msg.channel.sendMessage(`Current Running Version: ${config.version}`);
}));
