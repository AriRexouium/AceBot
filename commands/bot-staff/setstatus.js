const { Command } = require('discord.js-commando')
const pluralize = require('pluralize')

module.exports = class SetstatusCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setstatus',
      group: 'bot-staff',
      memberName: 'setstatus',
      description: 'Changes the bot\'s/shard\'s status.',
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          key: 'status',
          prompt: 'What would you like to change the status to?',
          type: 'string'
        }
      ],
      guarded: true
    })
  }
  hasPermission (message) {
    return this.client.isOwner(message.author)
  }
  async run (message, args) {
    var status
    if (args.status === 'online') { status = 'online' } else
    if (args.status === 'idle') { status = 'idle' } else
    if (args.status === 'dnd') { status = 'dnd' } else
    if (args.status === 'invisible') { status = 'invisible' } else { return message.say('Error, invalid status.') }
    this.client.user.setStatus(status).then(
      this.client.user.setActivity(`${this.client.config.startSettings.commandPrefix}help | ${pluralize('Guild', this.client.guilds.size, true)} | ${pluralize('User', this.client.users.size, true)}${this.client.shard ? ` | Shard ID: ${this.client.shard.id}/${this.client.shard.count - 1}` : ''}`)
    )
  }
}
