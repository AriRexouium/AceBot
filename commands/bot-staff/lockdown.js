const { Command } = require('discord.js-commando')

module.exports = class LockdownCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lockdown',
      memberName: 'lockdown',
      group: 'bot-staff',
      description: 'Locksdown the bot.',
      details: 'Allows the owners to enable or disable a lockdown.',
      examples: [
        'lockdown enable',
        'lockdown disable'
      ],
      args: [
        {
          key: 'query',
          prompt: 'What would you like to do (enable, disable)?',
          type: 'string',
          parse: value => value.toLowerCase(),
          validate: value => ['enable', 'disable'].includes(value)
        },
        {
          key: 'reason',
          prompt: 'What is the reason for the lockdown?',
          type: 'string',
          default: false
        }
      ],
      ownerOnly: true,
      guarded: true
    })
  }

  run (message, args) {
    // Check if the user wants to enable or disable a lockdown.
    /* Lockdown Enable */
    if (args.query === 'enable') {
      // Check if there is no ongoing lockdown.
      if (this.client.provider.get('global', 'lockdown', false) === true) {
        // Tell the user that there is already a lockdown active.
        return message.reply('you can\'t start a lockdown if one is currently active.')
      }
      // Set the lockdown status to true.
      this.client.provider.set('global', 'lockdown', true)
      // Set the reason for the lockdown.
      this.client.provider.set('global', 'lockdownReason', args.reason === false ? false : args.reason)
      // Tell the user that the lockdown was successfully enabled.
      return message.reply('successfully enabled a lockdown!')
    /* Lockdown Disable */
    } else if (args.query === 'disable') {
      // Check if there is an ongoing lockdown.
      if (this.client.provider.get('global', 'lockdown', true) === false) {
        // Tell the user that there is no active lockdown.
        return message.reply('you can\'t disable a non-existent lockdown.')
      }
      // Set the lockdown status to false.
      this.client.provider.set('global', 'lockdown', false)
      // Remove the lockdown reason.
      this.client.provider.set('global', 'lockdownReason', false)
      // Tell the user that the lockdown was successfully disabled.
      return message.reply('successfully disabled the lockdown!')
    }
  }
}
