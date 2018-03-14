const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLineCommaListsAnd, stripIndents } = require('common-tags')
const si = require('systeminformation')
const moment = require('moment')
require('moment-duration-format')

module.exports = class ServerInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'serverinfo',
      memberName: 'serverinfo',
      group: 'information',
      description: 'Displays info about the current guild.',
      aliases: [
        'guildinfo'
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

  run (message) {
    var guild = message.guild
    var ownerInfo = message.guild.members.find('id', guild.ownerID)

    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }

    var verificationLevel = [
      '**None**\n(Unrestricted)',
      '**Low**\n(Must have verified email on account)',
      '**Medium**\n(Must be registered on Discord for longer than 5 minutes)',
      '**High**\n(Must be a member of the server for longer than 10 minutes)',
      '**Very High**\n(Must have a verified phone number)'
    ]
    var explicitContentFilter = [
      '**Level 1**\n(Don\'t scan any messages)',
      '**Level 2**\n(Scan messages from members without a role)',
      '**Level 3**\n(Scan all messages.)'
    ]

    var totalUsers = guild.members.filter(s => s.user.bot !== true)
    var totalBots = guild.members.filter(s => s.user.bot !== false)

    var guildRoles
    if (guild.roles.size > 1) {
      guildRoles = oneLineCommaListsAnd`${guild.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `**\`${role.name}\`**`)}`
    } else {
      guildRoles = 'N/A'
    }

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `${guild.name} - (${guild.region})`,
      description: `Since ${moment(guild.createdAt).format('llll')} ${si.time().timezone})`,
      thumbnail: { url: guild.iconURL() !== null ? guild.iconURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
      fields: [
        {
          'name': '🔧 Owner',
          'value': stripIndents`
            **Name:** ${escapeMarkdown(ownerInfo.user.tag)}
            **ID:** ${ownerInfo.user.id}
            **Status:** ${ownerInfo.user.presence.status}
          `,
          'inline': true
        },
        {
          'name': `📋 Members - (${guild.members.size})`,
          'value': stripIndents`
            **Online:** ${guild.members.filter(s => s.user.presence.status === 'online').size} | **Offline:** ${guild.members.filter(s => s.user.presence.status === 'offline').size}
            **Idle:** ${guild.members.filter(s => s.user.presence.status === 'idle').size} | **DND:** ${guild.members.filter(s => s.user.presence.status === 'dnd').size}
          `,
          'inline': true
        },
        {
          'name': `🕵 Users - (${totalUsers.size})`,
          'value': stripIndents`
            **Online:** ${totalUsers.filter(s => s.user.presence.status === 'online').size} | **Offline:** ${totalUsers.filter(s => s.user.presence.status === 'offline').size}
            **Idle:** ${totalUsers.filter(s => s.user.presence.status === 'idle').size} | **DND:** ${totalUsers.filter(s => s.user.presence.status === 'dnd').size}
          `,
          'inline': true
        },
        {
          'name': `🤖 Bots - (${totalBots.size})`,
          'value': stripIndents`
            **Online:** ${totalBots.filter(s => s.user.presence.status === 'online').size} | **Offline:** ${totalBots.filter(s => s.user.presence.status === 'offline').size}
            **Idle:** ${totalBots.filter(s => s.user.presence.status === 'idle').size} | **DND:** ${totalBots.filter(s => s.user.presence.status === 'dnd').size}

          `,
          'inline': true
        },
        {
          'name': '💤 AFK Channel',
          'value': guild.afkChannelID !== null
            ? stripIndents`
            **Name:** ${guild.afkChannel.name}
            **ID:** ${guild.afkChannel.id}
            **Timeout:** ${guild.afkTimeout} seconds
          `
            : 'N/A',
          'inline': true
        },
        {
          'name': '⚖ Verification Level',
          'value': verificationLevel[guild.verificationLevel],
          'inline': true
        },
        {
          'name': '📰 Explicit Content Filter',
          'value': explicitContentFilter[guild.explicitContentFilter],
          'inline': true
        },
        {
          'name': '🔖 Roles',
          'value': guildRoles,
          'inline': true
        }
      ],
      color: clientColor
    })
  }
}
