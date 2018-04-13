const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { oneLineCommaListsAnd, stripIndents } = require('common-tags')
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

    // Embed Color
    var clientColor
    if (message.guild) {
      clientColor = guild.me.displayHexColor
      if (clientColor === '#000000') {
        clientColor = 0x7289DA
      } else {
        clientColor = Number(clientColor.replace('#', '0x'))
      }
    } else {
      clientColor = 0x7289DA
    }

    // Security
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

    // Member Filter
    var userFilter = guild.members.filter(s => s.user.bot !== true)
    var botFilter = guild.members.filter(s => s.user.bot !== false)

    // Region
    var guildRegion = await guild.fetchVoiceRegions().then(regions => {
      var name = JSON.stringify(regions.get(guild.region).name)
      return name.replace(/"/g, '')
    })

    // Features
    var features = []
    if (guild.features.indexOf('INVITE_SPASH')) { features.push('Invite Spash') }
    if (guild.features.indexOf('MORE_EMOJI')) { features.push('More Emojis') }
    if (guild.features.indexOf('VERIFIED')) { features.push('Verified') }
    if (guild.features.indexOf('VIP_REGIONS')) { features.push('VIP Regions') }
    if (guild.features.indexOf('VANITY_URL')) { features.push('Vanity URL') }
    for (var i = 0; i < features.length; i++) { features[i] = `• ${features[i]}` }

    // Roles
    var guildRoles
    if (guild.roles.size > 1) {
      guildRoles = oneLineCommaListsAnd`${guild._sortedRoles().array().slice(1).reverse().map(role => `**\`${role.name}\`**`)}`
    } else {
      guildRoles = 'N/A'
    }

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `${guild.name} - ${guildRegion}`,
      description: `**ID:** ${guild.id}`,
      thumbnail: { url: guild.iconURL() !== null ? guild.iconURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
      fields: [
        {
          'name': '🔧 Owner',
          'value': stripIndents`
            **Tag:** ${escapeMarkdown(ownerInfo.tag)}
            **ID:** ${ownerInfo.id}
            **Status:** ${ownerInfo.presence.status}
          `,
          'inline': true
        },
        {
          'name': `🕐 Created - (${moment(guild.createdAt).fromNow()})`,
          'value': stripIndents`
          **Date:** ${moment(guild.createdAt).format('L')}
          **Time:** ${moment(guild.createdAt).format('LTS')} ${moment.tz(moment.tz.guess()).format('z')}
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
          'name': `🕵 Users - (${userFilter.size.toLocaleString()})`,
          'value': stripIndents`
            **Online:** ${userFilter.filter(s => s.user.presence.status === 'online').size.toLocaleString()} | **Offline:** ${userFilter.filter(s => s.user.presence.status === 'offline').size.toLocaleString()}
            **Idle:** ${userFilter.filter(s => s.user.presence.status === 'idle').size.toLocaleString()} | **DND:** ${userFilter.filter(s => s.user.presence.status === 'dnd').size.toLocaleString()}
          `,
          'inline': true
        },
        {
          'name': `🤖 Bots - (${botFilter.size.toLocaleString()})`,
          'value': stripIndents`
            **Online:** ${botFilter.filter(s => s.user.presence.status === 'online').size.toLocaleString()} | **Offline:** ${botFilter.filter(s => s.user.presence.status === 'offline').size.toLocaleString()}
            **Idle:** ${botFilter.filter(s => s.user.presence.status === 'idle').size.toLocaleString()} | **DND:** ${botFilter.filter(s => s.user.presence.status === 'dnd').size.toLocaleString()}
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
          'name': '⚙ Features',
          'value': features.size > 0 ? features.join('\n') : 'N/A',
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
          'inline': false
        }
      ],
      color: clientColor
    })
  }
}
