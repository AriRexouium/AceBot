const { Command } = require('discord.js-commando')

require('moment-duration-format')

module.exports = class SayCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'say',
      group: 'bot-staff',
      memberName: 'say',
      description: 'Has the bot repeat what you say.',
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          key: 'text',
          prompt: 'What text would you like to say?',
          type: 'string'
        }
      ],
      guarded: true
    })
  }
  hasPermission (message) {
    return this.client.isOwner(message.author)
  }
  async run (message, args) {
    await message.delete()
    await message.say(args.text)
  }
}
