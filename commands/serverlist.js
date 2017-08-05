const cmd = require('./commands.js')
const Command = cmd.Command
this.commands = []
this.commands.push(new Command(`serverlist`, `Prints out the serverlist.`, function (input) {
  input.msg.channel.sendMessage(`Guilds Avaliable: \`${input.bot.guilds.size}\`\n\`\`\`${input.bot.guilds.map(g => g.name).join('\n')}\`\`\``)
}))
