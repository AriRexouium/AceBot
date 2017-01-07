const cmd = require("./commands.js");
const Command = cmd.Command;
const config = require("../config.json");
this.commands = [];
this.commands.push(new Command(`lsay`, `${config.prefix}lsay [message]`, function(input){
  if (!input.msg.content.startsWith(config.prefix)) return;
  let command = input.msg.content.split(" ")[0];
  let args = input.msg.content.split(" ").slice(1);
  if (input.msg.author.id !== (config.owner)) return;
  input.msg.channel.sendMessage(args.join(" "));

  module.exports.hasPerm = function hasPerm(input, perm){
  if(input.msg.channel.permissionsFor(bot.user).hasPermission(perm))
    return true;
  return false;
}
module.exports.removeCommand = function removeCommand(input){
  if(module.exports.hasPerm(input, "MANAGE_MESSAGES"))
    input.msg.delete();
}
}));
