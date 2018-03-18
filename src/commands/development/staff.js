const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class StaffCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'staff',
      memberName: 'staff',
      group: 'development',
      description: 'Add or remove staff from the bot.',
      args: [
        {
          key: 'query',
          label: 'add/remove',
          prompt: 'What would you like to do (add, remove)?',
          type: 'string',
          parse: value => value.toLowerCase(),
          validate: value => ['add', 'remove'].includes(value)
        },
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
    this.client.fetchApplication().then(app => {
      var ownerID = app.owner.id

      var staffList = this.client.provider.get('global', 'staff', [])
      var developerList = this.client.provider.get('global', 'developer', [])

      /* **************************************************************************************************** *\
        Staff
      \* **************************************************************************************************** */
      if (args.level === 'staff') {
      /*
        Add
      */
        if (args.query === 'add') {
          if (args.user.id === ownerID) return message.say('You can\'t add yourself as staff, you own the bot.')
          if (staffList.includes(args.user.id)) return message.say('That user is already a staff member.')
          staffList.push(args.user.id)
          this.client.provider.set('global', 'staff', staffList)
          return message.reply(`Added **${escapeMarkdown(args.user.tag)}** as a staff member.`)
        /*
          Remove
        */
        } else {
          if (args.user.id === ownerID) return message.say('You can\'t remove yourself as staff, you own the bot.')
          if (!staffList.includes(args.user.id)) return message.say('That user is not a staff member.')
          var developerIndex = staffList.indexOf(args.user.id)
          staffList.splice(developerIndex, 1)
          if (staffList.length === 0) {
            this.client.provider.remove('global', 'staff')
          } else {
            this.client.provider.set('global', 'staff', staffList)
          }
          return message.reply(`Removed **${escapeMarkdown(args.user.tag)}** from staff.`)
        }
        /* **************************************************************************************************** *\
          Developer
        \* **************************************************************************************************** */
      } else if (args.level === 'developer') {
        /*
          Add
        */
        if (args.query === 'add') {
          if (args.user.id === ownerID) return message.say('You can\'t add yourself as a developer, you own the bot.')
          if (developerList.includes(args.user.id)) return message.say('That user is already a developer.')
          developerList.push(args.user.id)
          this.client.provider.set('global', 'developer', developerList)
          return message.reply(`Added **${escapeMarkdown(args.user.tag)}** as a developer.`)
        /*
          Remove
        */
        } else {
          if (args.user.id === ownerID) return message.say('You can\'t remove yourself as a developer, you own the bot.')
          if (!developerList.includes(args.user.id)) return message.say('That user is not a developer.')
          var staffIndex = developerList.indexOf(args.user.id)
          developerList.splice(staffIndex, 1)
          if (developerList.length === 0) {
            this.client.provider.remove('global', 'developer')
          } else {
            this.client.provider.set('global', 'developer', developerList)
          }
          return message.reply(`Removed **${escapeMarkdown(args.user.tag)}** from developer.`)
        }
      }
    })
  }
}
