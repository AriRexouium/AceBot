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

  async run (message) {
    await message.say('**Checking for updates...**')
    try {
      /* **************************************************************************************************** *\
      Git
      \* **************************************************************************************************** */
      // Pull Code
      var gitPull = exec('git pull --all').toString()
      // Send Git result.
      await message.say({
        content: gitPull,
        code: '',
        split: true
      })
      // Check to see if Git returned an already up to date message.
      if (/Already up-to-date.|Already up to date./.test(gitPull)) {
        await message.say('**There was nothing to update!**')
      } else {
        /* **************************************************************************************************** *\
        NPM
        \* **************************************************************************************************** */
        // Install Node Dependencies
        var npmUpdate = exec('npm install').toString()
        // Send NPM result.
        await message.say({
          content: npmUpdate,
          code: '',
          split: true
        })
        // Let the user know they need to restart the bot.
        await message.say(`**Successfully updated everything! Awaiting next restart.**`)
      }
    } catch (error) {
      // Error Message
      await message.say({
        content: error.stack,
        code: '',
        split: true
      })
      message.say('**An error has occurred.**')
    }
  }
}
