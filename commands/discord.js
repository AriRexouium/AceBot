const cmd = require('./commands.js')
const Command = cmd.Command
this.commands = []
this.commands.push(new Command(`discord`, `Prints out the link to our Discord server.`, function (input) {
  input.msg.channel.sendMessage(`Join our official Discord Server! http://discord.gg/Y6Vgfyd`)
}))
