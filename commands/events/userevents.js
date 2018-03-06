const { Command } = require('discord.js-commando')

module.exports = class UserEventsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'userevents',
      memberName: 'userevents',
      group: 'events',
      description: 'Displays all the events for a user.',
      aliases: [
        'memberevents'
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
          key: 'user',
          prompt: 'What user would you like to lookup?',
          type: 'member'
        }
      ]
    })
  }

  run (message, args) {
    var user = args.user.user
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }
    var info = []
    var events = [
      'commandBlocked',
      'commandError',
      'commandRun',
      'guildBanAdd',
      'guildBanRemove',
      'guildMemberAdd',
      'guildMemberAvailable',
      'guildMemberRemove',
      'guildMembersChunk',
      'guildMemberSpeaking',
      'guildMemberUpdate',
      'message',
      'messageDelete',
      'messageDeleteBulk',
      'messageReactionAdd',
      'messageReactionRemove',
      'messageReactionRemoveAll',
      'messageUpdate',
      'presenceUpdate',
      'typingStart',
      'typingStop',
      'unknownCommand',
      'userUpdate'
    ]
    events.forEach(event => {
      info.push({ type: event, count: this.client.provider.get(user.id, event, 0) })
    })
    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `Events for #${user.tag} (Data is delayed.)`,
      description: info.map(event => `${event.type}: **${event.count}**`).join('\n'),
      color: clientColor
    })
  }
}
