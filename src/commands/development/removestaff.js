const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLine } = require('common-tags')

module.exports = class RemoveStaffCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'removestaff',
      memberName: 'removestaff',
      group: 'development',
      description: 'Remove staff or developers from the bot.',
      args: [
        {
          key: 'user',
          prompt: 'Who would you like to remove?',
          type: 'user'
        }
      ],
      guarded: true,
      ownerOnly: true
    })
  }

  async run (message, args) {
    var query = args.level === 'staff' ? 1 : 2
    if (args.user.id === await this.client.fetchApplication().then(app => app.owner.id)) {
      return message.reply('You can\'t remove yourself if you already own the bot.')
    }
    var staff = this.client.provider.get('global', 'staff', {})
    if (staff[args.user.id] !== query) {
      return message.say(`**${escapeMarkdown(args.user.tag)}** is not a staff member or developer.`)
    }
    try {
      await this.client.staff('remove', args.user.id)
      return message.say(oneLine`
        Successfully removed **${escapeMarkdown(args.user.tag)}**
        as ${staff[args.user.id] === 1 ? 'staff' : 'a developer'}.
      `)
    } catch (e) {
      return message.say(oneLine`
        There was an error while adding **${escapeMarkdown(args.user.tag)}**
        as ${staff[args.user.id] === 1 ? 'staff' : 'a developer'}.
      `)
    }
  }
}
