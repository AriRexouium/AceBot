const { Command } = require('discord.js-commando')

module.exports = class TraceBackCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'traceback',
      memberName: 'traceback',
      group: 'bot-staff',
      description: 'Get the most recent error.',
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
    if (this.client.temp.error) {
      var error = this.client.temp.error
      error = error && error.stack ? error.stack : error
      message.say({
        content: error.toString(),
        code: 'js',
        split: true
      })
    } else {
      message.reply('an error has not ocurred yet.')
    }
  }
}
