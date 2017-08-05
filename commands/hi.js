const cmd = require('./commands.js')
const Command = cmd.Command
this.commands = []
this.commands.push(new Command(`hi`, `Responds with hi!`, function (input) {
  input.msg.channel.sendMessage(`Hi there ${input.msg.author}!`)
}))
