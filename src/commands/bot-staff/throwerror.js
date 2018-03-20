const { Command } = require('discord.js-commando')

module.exports = class SayCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'throwerror',
      memberName: 'throwerror',
      group: 'bot-staff',
      description: 'Throw an error.',
      guarded: true
    })
  }

  hasPermission (message) {
    if (
      this.client.provider.get('global', 'developer', []).includes(message.author.id) ||
      this.client.provider.get('global', 'staff', []).includes(message.author.id) ||
      this.client.isOwner(message.author.id)
    ) {
      return true
    } else {
      return 'only bot staff can run this command.'
    }
  }

  async run (message, args) {
    throw new Error(`Error invoked by ${message.author.tag} (message.author.id).`)
  }
}
