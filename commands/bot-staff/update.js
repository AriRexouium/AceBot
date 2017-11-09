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
      guarded: true
    })
  }
  hasPermission (message) {
    return this.client.isOwner(message.author)
  }
  async run (message) {
    message.say('**Restart requested, please wait.**').then(function (e) {
      var result = childProcess.execSync('git pull').toString()
      message.say('```\n' + result + '\n```')
      if (result.indexOf('Already up-to-date.') > -1) {
        message.say('There was nothing to update!')
      } else {
        message.say('New code successfully pulled!\nRestarting...')
        setTimeout(async function () {
          await this.client.log.info('Restarting!', 'Restart')
          await this.client.destroy()
          await process.exit()
        }, 2000)
      }
    })
  }
}
