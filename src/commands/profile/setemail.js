const { Command } = require('discord.js-commando')

module.exports = class SetEmailCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setemail',
      memberName: 'setemail',
      group: 'profile',
      description: 'Set your email on your profile.',
      aliases: [
        'setmailto'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'email',
          prompt: 'Please enter your email.',
          type: 'string',
          validate: value => {
            if (value.length > 32) {
              return 'Must be less than 32 characters in length.'
            } else {
              if (value.match(/^([\w_.\-+])+@([\w-]+\.)+([\w]{2,10})+$/)) {
                return true
              } else {
                return 'That is not a valid email.'
              }
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'email', args.email)
    message.reply(`successfully set your email to \`${args.email}\`!`)
  }
}
