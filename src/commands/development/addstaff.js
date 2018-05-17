const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLine } = require('common-tags')

module.exports = class AddStaffCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'addstaff',
      memberName: 'addstaff',
      group: 'development',
      description: 'Add staff or developers to the bot.',
      args: [
        {
          key: 'level',
          prompt: 'What would you like to do (staff, developer)?',
          type: 'string',
          parse: value => value.toLowerCase(),
          validate: value => ['staff', 'developer'].includes(value)
        },
        {
          key: 'user',
          prompt: 'Who would you like to add?',
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
      return message.reply('You can\'t assign yourself if you already own the bot.')
    }
    var staff = this.client.provider.get('global', 'staff', {})
    if (staff[args.user.id] === query) {
      return message.say(oneLine`
        **${escapeMarkdown(args.user.tag)}** is
        already ${staff[args.user.id] === 1 ? 'staff' : 'a developer'}.
      `)
    }
    try {
      await this.client.staff('set', args.user.id, args.level)
      return message.say(oneLine`
        Successfully added **${escapeMarkdown(args.user.tag)}**
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
