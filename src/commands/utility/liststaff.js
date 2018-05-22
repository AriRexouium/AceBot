const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class ListStaffCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'liststaff',
      memberName: 'liststaff',
      group: 'utility',
      description: 'Show\'s all the bot staff.',
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  run (message, args) {
    var emojiList = {}
    if (this.client.guilds.get('110373943822540800')) {
      var validEmojis = [
        { name: 'online', id: '313956277808005120' },
        { name: 'idle', id: '313956277220802560' },
        { name: 'dnd', id: '313956276893646850' },
        { name: 'offline', id: '313956277107556352' },
        { name: 'streaming', id: '313956277132853248' }
      ]
      validEmojis.forEach(emoji => {
        emojiList[emoji.name] = this.client.emojis.get(emoji.id)
      })
    } else {
      validEmojis = ['online', 'idle', 'dnd', 'offline', 'streaming']
      validEmojis.forEach(emoji => {
        emojiList[emoji] = `(${emoji})`
      })
    }

    var text = ''
    var appOwner = this.client.users.get(this.client.options.owner[0])

    var staff = this.client.provider.get('global', 'staff', {})
    var staffKeys = Object.keys(staff)
    var staffValues = Object.values(staff)
    staff = []
    staffKeys.forEach((value, index) => {
      staff.push({ id: value, pos: staffValues[index] })
    })
    var staffList = staff.filter(u => u.pos === 1)
    var developerList = staff.filter(u => u.pos === 2)

    text += '__**Application Owner**__\n'
    text += `${emojiList[appOwner.presence.status]}** ${escapeMarkdown(appOwner.tag)}** (\`${appOwner.id}\`)`

    if (developerList.length > 0) {
      text += '\n\n__**Developers**__\n'
      developerList.forEach(dev => {
        var user = this.client.users.get(dev.id)
        text += `${emojiList[user.presence.status]}** ${escapeMarkdown(user.tag)}** (\`${user.id}\`)\n`
      })
    }

    if (staffList.length > 0) {
      text += `\n${developerList.length === 0 ? '\n' : ''}__**Staff**__\n`
      staffList.forEach(stf => {
        var user = this.client.users.get(stf.id)
        text += `${emojiList[user.presence.status]}** ${escapeMarkdown(user.tag)}** (\`${user.id}\`)\n`
      })
      message.say(text)
    }
  }
}
