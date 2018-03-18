// NOTE: This command only works if Git is installed on the host system.

const { Command } = require('discord.js-commando')
const childProcess = require('child_process')
const { stripIndents } = require('common-tags')

module.exports = class UpdateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'update',
      memberName: 'update',
      group: 'development',
      description: 'Updates the bot.',
      details: 'Pulls code from GitHub.',
      aliases: [
        'upgrade'
      ],
      guarded: true
    })
  }

  hasPermission (message) {
    if (
      this.client.provider.get('global', 'developer', []).includes(message.author.id) ||
      this.client.isOwner(message.author.id)
    ) {
      return true
    } else {
      return 'only bot developers can run this command.'
    }
  }

  run (message) {
    message.say('**Update requested, please wait.**').then(() => {
      try {
        var codeResult = childProcess.execSync('git pull --all').toString()
        if (codeResult.length > 1950) {
          this.client.hastebin(codeResult).then(link => {
            message.say('```\n' + `<${link}>` + '\n```')
          })
        } else {
          message.say('```\n' + codeResult + '\n```')
        }
        if (codeResult.indexOf('Already up-to-date.') > -1 || codeResult.indexOf('Already up to date.') > -1) {
          message.say('**There was nothing to update!**')
        } else {
          message.say(stripIndents`
            **Successfully updated code! Now updating node modules, this might take a while.**
            *(The bot will not work while updating the node modules.)*
          `).then(() => {
            var npmResult = childProcess.execSync('npm i').toString()
            if (npmResult.length > 1950) {
              this.client.hastebin(npmResult).then(link => {
                message.say('```\n' + `<${link}>` + '\n```').then(message.say(`**Successfully updated everything! Awaiting next restart.**`))
              })
            } else {
              message.say('```\n' + npmResult + '\n```').then(message.say(`**Successfully updated everything! Awaiting next restart.**`))
            }
          })
        }
      } catch (error) {
        message.say('```\n' + error.message + '\n```').then(message.say('**An error has occurred.**'))
      }
    })
  }
}