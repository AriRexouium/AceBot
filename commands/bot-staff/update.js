const { Command } = require('discord.js-commando')
const childProcess = require('child_process')

require('moment-duration-format')

module.exports = class UpdateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'update',
      group: 'bot-staff',
      memberName: 'update',
      description: 'Updates the bot.',
      details: 'Only the bot owner(s) may use this command.',
      aliases: ['upgrade'],
      ownerOnly: true,
      guarded: true
    })
  }

  async run (message) {
    message.say('**Update requested, please wait.**').then(function (f) {
      try {
        var result = childProcess.execSync('git pull').toString()
        message.say('```\n' + result + '\n```')
        if (result.indexOf('Already up-to-date.') > -1) {
          message.say('**There was nothing to update!**')
        } else {
          message.say(`**Successfully updated code! Awaiting next restart.**`)
        }
      } catch (error) {
        message.say('```\n' + error.message + '\n```')
        .then(message.say('**An error has occurred.**'))
      }
    })
  }
}
