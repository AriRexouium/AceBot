const cmd = require('./commands.js')
const Command = cmd.Command
this.commands = []
this.commands.push(new Command(`getid`, `Gives you your id.`, function (input) {
  input.msg.channel.sendMessage(`Your ID is: \\${input.msg.author}`)
}))
