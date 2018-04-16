// NOTE: This command only works if Git is installed on the host system.

const { Command } = require('discord.js-commando')
const exec = require('child_process').execSync

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
    message.say('**Checking for updates...**').then(() => {
      try {
        var gitPull = exec('git pull --all').toString()
        message.say({
          content: gitPull,
          code: '',
          split: true
        })
        if (gitPull.indexOf('Already up-to-date.') > -1 || gitPull.indexOf('Already up to date.') > -1) {
          message.say('**There was nothing to update!**')
        } else {
          message.say('*Successfully updated code! Now updating node modules, this might take a while.**').then(() => {
            var npmUpdate = exec('npm install').toString()
            message.say({
              content: npmUpdate,
              code: '',
              split: true
            }).then(message.say(`**Successfully updated everything! Awaiting next restart.**`))
          })
        }
      } catch (error) {
        message.say({
          content: `'**An error has occurred.**'\n${error.stack}`,
          code: '',
          split: true
        }).then(message.say())
      }
    })
  }
}
