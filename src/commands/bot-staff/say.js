const { Command } = require('discord.js-commando')

module.exports = class SayCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'say',
      memberName: 'say',
      group: 'bot-staff',
      description: 'Has the bot repeat what you say.',
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: [
        'MANAGE_MESSAGES'
      ],
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
    await message.delete().catch()
    await message.say(args.text)
  }
}
