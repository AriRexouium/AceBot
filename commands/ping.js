const cmd = require('./commands.js')
const Command = cmd.Command
this.commands = []
this.commands.push(new Command(`ping`, `Prints out the time it took to respond.`, function (input) {
  input.msg.channel.sendMessage(`Delay of \`${Date.now() - input.msg.createdTimestamp}ms\``)
}))
