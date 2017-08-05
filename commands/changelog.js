const cmd = require('./commands.js')
const Command = cmd.Command
const config = require('../config.json')
this.commands = []
this.commands.push(new Command(`changelog`, `Prints out update changelog.`, function (input) {
  input.msg.channel.sendMessage(`\`\`\`Change log for version: ${config.version}\n${config.change}\nPlease report any bugs!\`\`\``)
}))
