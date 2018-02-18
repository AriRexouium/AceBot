const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class ReloadCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'reload',
      aliases: [
        'reload-command'
      ],
      group: 'bot-staff',
      memberName: 'reload',
      description: 'Reloads a command or command group.',
      details: oneLine`
        The argument must be the name/ID (partial or whole) of a command or command group.
        Providing a command group will reload all of the commands in that group.
        Only the bot owner(s) may use this command.
      `,
      examples: [
        'reload ping'
      ],
      args: [
        {
          key: 'cmdOrGrp',
          label: 'command/group',
          prompt: 'Which command or group would you like to reload?',
          type: 'command-or-group'
        }
      ],
      ownerOnly: true,
      guarded: true
    })
  }

  async run (message, args) {
    const { cmdOrGrp } = args
    const isCmd = Boolean(cmdOrGrp.groupID)
    cmdOrGrp.reload()

    if (this.client.shard) {
      try {
        await this.client.shard.broadcastEval(`
          if(this.shard.id !== ${this.client.shard.id}) {
            this.registry.${isCmd ? 'commands' : 'groups'}.get('${isCmd ? cmdOrGrp.name : cmdOrGrp.id}').reload();
          }
        `)
      } catch (err) {
        this.client.emit('warn', `Error when broadcasting command reload to other shards`)
        this.client.emit('error', err)
        if (isCmd) {
          await message.reply(`reloaded \`${cmdOrGrp.name}\` command, but failed to reload on other shards.`)
        } else {
          await message.reply(
            `reloaded all of the commands in the \`${cmdOrGrp.name}\` group, but failed to reload on other shards.`
          )
        }
        return null
      }
    }

    if (isCmd) {
      await message.reply(`reloaded \`${cmdOrGrp.name}\` command${this.client.shard ? ' on all shards' : ''}.`)
    } else {
      await message.reply(
        `reloaded all of the commands in the \`${cmdOrGrp.name}\` group${this.client.shard ? ' on all shards' : ''}.`
      )
    }
    return null
  }
}
