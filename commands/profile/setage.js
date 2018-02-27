const { Command } = require('discord.js-commando')
const getAge = require('get-age')
module.exports = class SetAgeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setage',
      memberName: 'setage',
      group: 'profile',
      description: 'Set your age. **(FOR USE IN DM ONLY)**',
      details: 'Set your age on your profile. **(FOR USE IN DM ONLY)**',
      aliases: [
        'seta'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'year',
          prompt: 'Please enter the year you were born. (Type "none" to leave blank.)',
          type: 'integer',
          max: new Date().getUTCFullYear(),
          min: 1800
        },
        {
          key: 'month',
          prompt: 'Please enter the month you were born. (Type "none" to leave blank.)',
          type: 'integer',
          max: 12,
          min: 1
        },
        {
          key: 'day',
          prompt: 'Please enter the day you were born. (Type "none" to leave blank.)',
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
    var year
    if (args.year === 'none' || args.month === 'none' || args.day === 'none') {
      year = ''
    } else {
      year = `${args.year}-${args.month}-${args.day}`
    }

    this.client.provider.set(message.author.id, 'age', year)
    message.reply(`successfully set your age to \`${getAge(year)}\`!`)
  }
}
