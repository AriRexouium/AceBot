const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')
const moment = require('moment')

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
    this.client.fetchInvite(args.invite).then(invite => {
      var inviter = invite.inviter
      var guild = invite.guild

      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: guild.name,
        description: `Since ${moment(guild.createdAt).format('llll')} ${moment.tz(moment.tz.guess()).format('z')}`,
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
        color: this.client.getClientColor(message)
      })
    })
  }
}
