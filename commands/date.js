const cmd = require("./commands.js");
const Command = cmd.Command;
const config = require("../config.json");
this.commands = [];
this.commands.push(new Command(`date`, `Prints out the date.`, function(input){
  input.msg.channel.sendMessage(`${new Date()}`);
}));
