const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const profileValues = ['about', 'age', 'color', 'email', 'flag', 'gender', 'job', 'firstname', 'lastname', 'timezone', 'website']

module.exports = class ClearCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'clear',
      memberName: 'clear',
      group: 'profile',
      description: 'Clear something from your profile.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'query',
          prompt: stripIndents`
            What would you like to clear from your profile?
            Choices include the following: ${profileValues.join(' / ')}
          `,
          type: 'string',
          validate: value => {
            if (profileValues.includes(value)) {
              return true
            } else {
              return stripIndents`
                That is not a valid value.
                Choices include the following: ${profileValues.join(' / ')}
              `
            }
          }
        }
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    try {
      this.client.provider.remove(message.author.id, args.query)
      return message.reply(`successfully removed your \`${args.query}\`!`)
    } catch (error) {
      return message.reply(`there was an error processing your request: \`${error.name}: ${error.message}\``)
    }
  }
}
