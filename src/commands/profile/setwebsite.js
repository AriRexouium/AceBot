const { Command } = require('discord.js-commando')
const urlRegex = require('url-regex')

module.exports = class SetWebsiteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setwebsite',
      memberName: 'setwebsite',
      group: 'profile',
      description: 'Set your website on your profile.',
      aliases: [
        'seturl'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'website',
          prompt: 'Please enter your website.',
          type: 'string',
          validate: value => {
            if (urlRegex({ exact: true, strict: true }).test(value)) {
              return true
            } else {
              return 'That is not a valid URL.'
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'website', args.website)
    message.reply(`successfully set your website to \`${args.website}\`!`)
  }
}
