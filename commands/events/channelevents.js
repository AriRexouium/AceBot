const { Command } = require('discord.js-commando')

module.exports = class ChannelEventsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'channelevents',
      memberName: 'channelevents',
      group: 'events',
      description: 'Displays all the events on a channel.',
      aliases: [
        'cevents'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'channel',
          label: 'voice channel/text channel',
          prompt: 'What channel would you like to lookup?',
          type: 'channel'
        }
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    var target = args.channel

    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }
    var events
    var info = []

    if (target.type === 'voice') {
      events = [
        'channelUpdate',
        'voiceStateUpdate'
      ]
      events.forEach(event => {
        info.push({ type: event, count: this.client.provider.get(target.id, event, 0) })
      })
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: `Events for ${target.name}`,
        description: info.map(event => `${event.type}: **${event.count}**`).join('\n'),
        color: clientColor
      })
    } else if (target.type === 'text') {
      events = [
        'channelPinsUpdate',
        'channelUpdate',
        'commandBlocked',
        'commandError',
        'commandRun',
        'message',
        'messageDelete',
        'messageDeleteBulk',
        'messageReactionAdd',
        'messageReactionRemove',
        'messageReactionRemoveAll',
        'messageUpdate',
        'typingStart',
        'typingStop',
        'unknownCommand'
      ]
      events.forEach(event => {
        info.push({ type: event, count: this.client.provider.get(target.id, event, 0) })
      })
      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: `Events for #${target.name} (Data is delayed.)`,
        description: info.map(event => `${event.type}: **${event.count}**`).join('\n'),
        color: clientColor
      })
    } else {
      return message.reply('please choose a valid voice or text channel.')
    }
  }
}
