const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLine } = require('common-tags')

module.exports = class ListStaffCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'liststaff',
      memberName: 'liststaff',
      group: 'utility',
      description: 'Show\'s all the bot staff.'
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
    var ownerInfo = this.client.users.get(this.client.options.owner[0])
    var staff = this.client.provider.get('global', 'staff', [])
    var developer = this.client.provider.get('global', 'developer', [])

    text += '__**Application Owner**__\n'
    text += oneLine`
      ${emojiList[ownerInfo.presence.status]}**
      ${escapeMarkdown(ownerInfo.tag)}**
      (\`${ownerInfo.id}\`)
    `

    if (developer.length > 0) {
      text += '\n\n__**Developers**__\n'
      developer.forEach(developerMember => {
        var user = this.client.users.get(developerMember)
        text += `${emojiList[user.presence.status]}** ${escapeMarkdown(user.tag)}** (\`${user.id}\`)\n`
      })
    }

    if (staff.length > 0) {
      text += `\n${developer.length === 0 ? '\n' : ''}__**Staff**__\n`
      staff.forEach(staffMember => {
        var user = this.client.users.get(staffMember)
        text += `${emojiList[user.presence.status]}** ${escapeMarkdown(user.tag)}** (\`${user.id}\`)\n`
      })
      message.say(text)
    }
  }
}
