const cmd = require('./commands.js')
const Command = cmd.Command
const config = require('../config.json')
this.commands = []
this.commands.push(new Command(`csay`, `${config.prefix}csay <channel> [message]`, function (input) {
  if (input.msg.author.id !== (config.owner)) return
  // Break up message.
  let text = input.msg.content.split(' ')
  // Get the channel from which the user typed.
  let chl = text[1]
  // Adding the rest of the users words as a variable.
  let msg = ''
  for (let i = 2; i < text.length; i++) {
    msg += text[i] + ' '
  }
  // looks through channels to find one that matches, if it is true it sends the message.
  for (const channel of input.msg.guild.channels.values()) {
    if (channel === chl) {
      channel.sendMessage(msg)
    }
  }
}))
