const cmd = require('./commands.js')
const Command = cmd.Command
const config = require('../config.json')
this.commands = []
this.commands.push(new Command(`dev`, `Owner use only.`, function (input) {
  if (input.msg.author.id !== (config.owner)) return
  input.msg.channel.sendMessage(`\`\`\`Change log for version: ${config.version}\n${config.change}\nPlease report any bugs!\`\`\``)
  input.msg.channel.sendMessage(`\`\`\`News:\n${config.news}\`\`\``)
}))
