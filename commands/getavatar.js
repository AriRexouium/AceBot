const cmd = require('./commands.js')
const Command = cmd.Command
this.commands = []
this.commands.push(new Command(`getavatar`, `Gives you your avatar.`, function (input) {
  input.msg.reply(input.msg.author.avatarURL)
}))
