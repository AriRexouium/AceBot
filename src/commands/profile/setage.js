const { Command } = require('discord.js-commando')
const getAge = require('get-age')
module.exports = class SetAgeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setage',
      memberName: 'setage',
      group: 'profile',
      description: 'Set your age on your profile. **(FOR USE IN DM ONLY)**',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'year',
          prompt: 'Please enter the year you were born.',
          type: 'integer',
          max: new Date().getUTCFullYear(),
          min: new Date().getUTCFullYear() - 100
        },
        {
          key: 'month',
          prompt: 'Please enter the month you were born.',
          type: 'integer',
          max: 12,
          min: 1
        },
        {
          key: 'day',
          prompt: 'Please enter the day you were born.',
          type: 'integer',
          max: 30,
          min: 1
        }
      ]
    })
  }

  hasPermission (message) {
    if (message.channel.type !== 'dm') {
      return 'the `setage` command must be used in DM for privacy reasons.'
    } else {
      return true
    }
  }

  run (message, args) {
    var birthDate = `${args.year}-${args.month}-${args.day}`
    this.client.provider.set(message.author.id, 'age', birthDate)
    message.reply(`successfully set your age to \`${getAge(birthDate)}\`!`)
  }
}
