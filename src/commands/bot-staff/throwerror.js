const { Command } = require('discord.js-commando')

module.exports = class ThrowErrorCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'throwerror',
      memberName: 'throwerror',
      group: 'bot-staff',
      description: 'Throw an error.',
      guarded: true
    })
  }

  async run (message, args) {
    throw new Error(`Error invoked by ${message.author.tag} (${message.author.id}).`)
  }
}
