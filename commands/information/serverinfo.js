const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')
const moment = require('moment')
require('moment-duration-format')

module.exports = class ServerInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'serverinfo',
      memberName: 'serverinfo',
      group: 'information',
      description: 'Displays info about the current guild.',
      aliases: ['guildinfo'],
      clientPermissions: ['EMBED_LINKS'],
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

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: guild.name,
      description: `Since ${moment(guild.createdAt).format('llll')} ${new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]}\n(${moment(guild.createdAt).fromNow()})`,
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
          'name': '🌐 Region',
          'value': guild.region,
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
        }
      ],
      color: 0x7289DA
    })
  }
}
