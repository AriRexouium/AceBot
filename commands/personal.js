const cmd = require("./commands.js");
const Command = cmd.Command;
const config = require("../config.json");
this.commands = [];

this.commands.push(new Command(`setgame`, `Sets the bot game.`, function(input){
  if (input.msg.author.id !== (config.owner)) return;
  //Break up message.
  let text = input.msg.content.split(" ");
  //Adding the rest of the users words as a variable.
  let msg = "";
  for (let i = 1; i < text.length; i++) {
      msg += text[i]+" ";
  }
  input.bot.user.setGame(msg);
}));

this.commands.push(new Command(`setstatus`, `Sets the bot status.`, function(input){
  if (input.msg.author.id !== (config.owner)) return;
  //Break up message.
  let text = input.msg.content.split(" ");

  input.bot.user.setStatus(text[1].trim());
  //should work
}));
