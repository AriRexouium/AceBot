const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class SetNameCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setname',
      memberName: 'setname',
      group: 'profile',
      description: 'Set your profile name.',
      details: 'Set your first and last name on your profile.',
      aliases: [
        'setn'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'firstname',
          prompt: 'Please enter your first name. (Type "none" to leave blank.)',
          type: 'string',
          validate: value => {
            if (value.length > 12 || value.length < 2) {
              return 'Must be between 2 and 12 characters in length. (Type "none" to leave blank.)'
            } else {
              return true
            }
          }
        },
        {
          key: 'lastname',
          prompt: 'Please enter your lastname name. (Type "none" to leave blank.)',
          type: 'string',
          validate: value => {
            if (value.length > 12 || value.length < 2) {
              return 'Must be between 2 and 12 characters in length. (Type "none" to leave blank.)'
            } else {
              return true
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    var firstname; var lastname
    args.firstname === 'none' ? firstname = '' : firstname = args.firstname
    args.lastname === 'none' ? lastname = '' : lastname = args.lastname
    this.client.provider.set(message.author.id, 'firstname', firstname)
    this.client.provider.set(message.author.id, 'lastname', lastname)
    message.reply(`successfully set your name to \`${escapeMarkdown(firstname)}${lastname ? ` ${escapeMarkdown(lastname)}` : ''}\`!`)
  }
}
