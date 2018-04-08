// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLine, stripIndents } = require('common-tags')
const pluralize = require('pluralize')

module.exports = class DiscrimCommand extends Command {
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
    var availableUsers = this.client.users.findAll('discriminator', args.discriminator)
    var userStore = []
    var users = []
    availableUsers.forEach(user => {
      users.push(`**${escapeMarkdown(user.tag)}**`)
    })

    while (users.length > 0) {
      userStore.push(users.splice(0, 4).join(' | '))
    }

    if (userStore.length > 0) {
      return message.say({
        content: stripIndents`
          ${oneLine`There is
          **${userStore.length.toLocaleString()}
          ${pluralize('user', userStore.length, false)}**
          with the discriminator **${args.discriminator}**.`}
          ${userStore.join('\n')}
        `,
        split: true
      })
    } else {
      return message.reply(`there are no users with the discriminator \`${args.discriminator}\``)
    }
  }
}
