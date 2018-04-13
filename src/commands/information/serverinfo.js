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

  async run (message) {
    var guild = message.guild
    var ownerInfo = guild.owner.user

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

    var guildRegion = await guild.fetchVoiceRegions().then(regions => {
      var name = JSON.stringify(regions.get(guild.region).name)
      return name.replace(/"/g, '')
    })

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
      title: `${guild.name} - (${guildRegion})`,
      description: `Since ${moment(guild.createdAt).format('llll')} ${si.time().timezone})`,
      thumbnail: { url: guild.iconURL() !== null ? guild.iconURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
      fields: [
        {
          'name': '🔧 Owner',
          'value': stripIndents`
            **Name:** ${escapeMarkdown(ownerInfo.tag)}
            **ID:** ${ownerInfo.id}
            **Status:** ${ownerInfo.presence.status}
          `,
          'inline': true
        },
        {
          'name': `📋 Members - (${guild.members.size.toLocaleString()})`,
          'value': stripIndents`
            **Online:** ${guild.members.filter(s => s.user.presence.status === 'online').size.toLocaleString()} | **Offline:** ${guild.members.filter(s => s.user.presence.status === 'offline').size.toLocaleString()}
            **Idle:** ${guild.members.filter(s => s.user.presence.status === 'idle').size.toLocaleString()} | **DND:** ${guild.members.filter(s => s.user.presence.status === 'dnd').size.toLocaleString()}
          `,
          'inline': true
        },
        {
          'name': `🕵 Users - (${totalUsers.size.toLocaleString()})`,
          'value': stripIndents`
            **Online:** ${totalUsers.filter(s => s.user.presence.status === 'online').size.toLocaleString()} | **Offline:** ${totalUsers.filter(s => s.user.presence.status === 'offline').size.toLocaleString()}
            **Idle:** ${totalUsers.filter(s => s.user.presence.status === 'idle').size.toLocaleString()} | **DND:** ${totalUsers.filter(s => s.user.presence.status === 'dnd').size.toLocaleString()}
          `,
          'inline': true
        },
        {
          'name': `🤖 Bots - (${totalBots.size.toLocaleString()})`,
          'value': stripIndents`
            **Online:** ${totalBots.filter(s => s.user.presence.status === 'online').size.toLocaleString()} | **Offline:** ${totalBots.filter(s => s.user.presence.status === 'offline').size.toLocaleString()}
            **Idle:** ${totalBots.filter(s => s.user.presence.status === 'idle').size.toLocaleString()} | **DND:** ${totalBots.filter(s => s.user.presence.status === 'dnd').size.toLocaleString()}
          `,
          'inline': true
        },
        {
          'name': `⌨ Channels - (${guild.channels.size.toLocaleString()})`,
          'value': stripIndents`
            **Category:** ${guild.channels.filter(c => c.type === 'category').size.toLocaleString()}
            **Text:** ${guild.channels.filter(c => c.type === 'text').size.toLocaleString()}
            **Voice:** ${guild.channels.filter(c => c.type === 'voice').size.toLocaleString()}
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
          'name': `🔖 Roles - (${guild.roles.size.toLocaleString()})`,
          'value': guildRoles,
          'inline': true
        }
      ],
      color: clientColor
    })
  }
}
