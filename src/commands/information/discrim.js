// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')

module.exports = class DscrimCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'discrim',
      memberName: 'discrim',
      group: 'information',
      description: 'Gets all users with a disciminator.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'discriminator',
          prompt: 'What discriminator would you like to look up?',
          type: 'string'
        }
      ]
    })
  }

  run (message, args) {
    var users = this.client.users.findAll('discriminator', args.discriminator).map(user => `**\`${user.tag}\`**`).join('~')
    if (!users) {
      return message.reply(`there are no users with the discriminator \`${args.discriminator}\``)
    } else {
      return message.say({
        content: users,
        split: true
      })
    }
  }
}
