const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class UnloadCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unload',
      memberName: 'unload',
      group: 'bot-staff',
      description: 'Unloads a command.',
      details: oneLine`
        The argument must be the name/ID (partial or whole) of a command.
        Only the bot owner(s) may use this command.
      `,
      aliases: [
        'unload-command'
      ],
      examples: [
        'unload ping'
      ],
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to unload?',
          type: 'command'
        }
      ],
      guarded: true,
      ownerOnly: true
    })
  }

  async run (message, args) {
    args.command.unload()

    if (this.client.shard) {
      try {
        await this.client.shard.broadcastEval(`
          if(this.shard.id !== ${this.client.shard.id}) this.registry.commands.get('${args.command.name}').unload();
        `)
      } catch (err) {
        this.client.emit('warn', `Error when broadcasting command unload to other shards`)
        this.client.emit('error', err)
        await message.reply(`unloaded \`${args.command.name}\` command, but failed to unload on other shards.`)
        return null
      }
    }

    await message.reply(`unloaded \`${args.command.name}\` command${this.client.shard ? ' on all shards' : ''}.`)
    return null
  }
}
