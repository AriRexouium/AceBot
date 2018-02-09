const { Command } = require('discord.js-commando')
const pluralize = require('pluralize')

module.exports = class SetStatusCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setstatus',
      memberName: 'setstatus',
      group: 'bot-staff',
      description: 'Changes the bot\'s status.',
      details: 'Only the bot owner(s) may use this command.',
      examples: [
        'setstatus online',
        'setstatus idle',
        'setstatus dnd',
        'setstatus offline'
      ],
      args: [
        {
          key: 'status',
          prompt: 'What would you like to change the status to?',
          type: 'string'
        }
      ],
      ownerOnly: true,
      guarded: true
    })
  }

  run (message, args) {
    var status
    if (args.status === 'online') { status = 'online' } else
    if (args.status === 'idle') { status = 'idle' } else
    if (args.status === 'dnd') { status = 'dnd' } else
    if (args.status === 'invisible') { status = 'invisible' } else { return message.say(`\`${args.status}\` is not a valid status.`) }
    this.client.provider.set('global', 'clientStatus', status)
    this.client.user.setStatus(this.client.provider.get('global', 'clientStatus'))
    .then(
      this.client.user.setActivity(`${this.client.config.startConfig.commandPrefix}help | ${pluralize('Guild', this.client.guilds.size, true)} | ${pluralize('User', this.client.users.size, true)}${this.client.shard ? ` | Shard ID: ${this.client.shard.id}` : ''}`)
    )
    message.say(`Successfully set status to \`${status}\` ${this.client.shard ? `on all shards.\n*(Allow up to 10 minutes for this to take effect on all shards.)*` : ''}`)
  }
}
