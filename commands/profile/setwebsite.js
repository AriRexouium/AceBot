const { Command } = require('discord.js-commando')
const urlRegex = require('url-regex')

module.exports = class SetWebsiteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setwebsite',
      memberName: 'setwebsite',
      group: 'profile',
      description: 'Set your profile website.',
      details: 'Set your website on your profile.',
      aliases: [
        'setws',
        'seturl'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'website',
          prompt: 'Please enter your website. (Type "none" to leave blank.)',
          type: 'string',
          validate: value => {
            if (value === 'none' || urlRegex({ exact: true, strict: true }).test(value)) {
              return true
            } else {
              return 'That is not a valid URL. (Type "none" to leave blank.)'
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'website', args.website === 'none' ? '' : args.website)
    message.reply(`successfully set your website to \`${args.website}\`!`)
  }
}
