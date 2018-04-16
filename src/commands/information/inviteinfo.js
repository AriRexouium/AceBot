const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')
const moment = require('moment')
const si = require('systeminformation')

module.exports = class InviteInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'inviteinfo',
      memberName: 'inviteinfo',
      group: 'information',
      description: 'View information on an invite.',
      details: 'View detailed information on a server invite.',
      aliases: [
        'guildinvite'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'invite',
          prompt: 'What invite would you like to get information on?',
          type: 'invite'
        }
      ],
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

    this.client.fetchInvite(args.invite).then(invite => {
      var inviter = invite.inviter
      var guild = invite.guild

      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: guild.name,
        description: `Since ${moment(guild.createdAt).format('llll')} ${si.time().timezone}`,
        thumbnail: { url: guild.iconURL() !== null ? guild.iconURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
        fields: [
          {
            'name': 'Inviter',
            'value': invite.inviter === undefined ? 'N/A' : stripIndents`
              **Name:** ${escapeMarkdown(`${inviter.username}#${inviter.discriminator}`)}
              **ID:** ${inviter.id}
              **Status:** ${inviter.presence.status}
            `,
            'inline': true
          },
          {
            'name': 'Members',
            'value': invite.memberCount,
            'inline': true
          }
        ],
        color: clientColor
      })
    })
  }
}
