/*
  The following comment examples where taken from the discord.js-commando docs.
  This file is basically an organization sheet for commands.
  This helps keeps commands consistent in organization.
*/

const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class StyleSheetCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'StyleSheet', // Name of this command.
      memberName: 'StyleSheet', // Name of this command.
      group: 'StyleSheet', // The group the command belongs to, assigned upon registration.
      description: 'A short description goes here.', // Short description of the command.
      details: oneLine` // Short description of the command
      A long description for
      your command goes here.
      `,
      aliases: [ // Aliases for this command.
        'SheetStyle',
        'CommandExample'
      ],
      examples: [ // Example usage strings.
        'StyleSheet This is not a command.',
        'StyleSheet There are arguments.',
        'StyleSheet This is just an example.'
      ],
      userPermissions: [ // Permissions required by the user to use the command.
        'SEND_MESSAGES',
        'VIEW_CHANNEL'
      ],
      clientPermissions: [ // Permissions required by the client to use the command.
        'SEND_MESSAGES',
        'VIEW_CHANNEL'
      ],
      throttling: { // Options for throttling command usages.
        usages: 2,
        duration: 10
      },
      format: '[Test/Testing/Testing123]', // Usage format string of the command.
      args: [ // Go here for argument help: https://discord.js.org/#/docs/commando/master/class/Argument
        {
          key: 'message',
          label: 'text',
          prompt: 'What text would you like to provide?',
          type: 'string'
        }
      ],
      guarded: false, // Whether the command is protected from being disabled.
      guildOnly: false, // Whether the command can only be run in a guild channel.
      ownerOnly: false // Whether the command can only be used by an owner.
    })
  }

  async run (message, args) {
    // Code goes here etc.
  }
}
