const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class SetGenderCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setgender',
      memberName: 'setgender',
      group: 'profile',
      description: 'Set your gender on your profile.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'gender',
          prompt: 'Please enter your gender.',
          type: 'string',
          validate: value => {
            if (value.length > 18 || value.length < 2) {
              return 'Must be between 2 and 18 characters in length.'
            } else {
              return true
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'gender', args.gender)
    message.reply(`successfully set your gender to \`${escapeMarkdown(args.gender)}\`!`)
  }
}
