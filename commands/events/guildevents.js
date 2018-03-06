const { Command } = require('discord.js-commando')

module.exports = class GuildEventsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'guildevents',
      memberName: 'guildevents',
      group: 'events',
      description: 'Displays all the events on the current guild.',
      aliases: [
        'serverevents'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      guildOnly: true
    })
  }

  run (message, args) {
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }
    var info = []
    var events = [
      'channelCreate',
      'channelDelete',
      'channelPinsUpdate',
      'channelUpdate',
      'commandBlocked',
      'commandError',
      'commandPrefixChange',
      'commandRun',
      'commandStatusChange',
      'emojiCreate',
      'emojiDelete',
      'emojiUpdate',
      'groupStatusChange',
      'guildBanAdd',
      'guildBanRemove',
      'guildCreate',
      'guildDelete',
      'guildMemberAdd',
      'guildMemberRemove',
      'guildMembersChunk',
      'guildMemberSpeaking',
      'guildMemberUpdate',
      'guildUpdate',
      'message',
      'messageDelete',
      'messageDeleteBulk',
      'messageReactionAdd',
      'messageReactionRemove',
      'messageReactionRemoveAll',
      'messageUpdate',
      'presenceUpdate',
      'roleCreate',
      'roleDelete',
      'roleUpdate',
      'typingStart',
      'typingStop',
      'unknownCommand'
    ]
    events.forEach(event => {
      info.push({ type: event, count: this.client.provider.get(message.guild.id, event, 0) })
    })
    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `Events for #${message.guild.name} (Data is delayed.)`,
      description: info.map(event => `${event.type}: **${event.count}**`).join('\n'),
      color: clientColor
    })
  }
}
