const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class UserInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'userperms',
      memberName: 'userperms',
      group: 'information',
      description: 'Displays a user\'s permissions.',
      aliases: [
        'memberperms'
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
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    var user = args.user.user
    var userColor = (args.user).displayHexColor
    if (userColor === '#000000') { userColor = 0x7289DA } else { userColor = Number(userColor.replace('#', '0x')) }

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `Permissions for ${escapeMarkdown(user.tag)}${user.bot === true ? ' **[BOT]**' : ''}`,
      description: '*This only takes role permissions into account.*',
      fields: [
        {
          'name': 'General Permissions',
          'value': stripIndents`\`\`\`diff
            ${args.user.permissions.has('ADMINISTRATOR')} Administrator *
            ${args.user.permissions.has('VIEW_AUDIT_LOG')} View Audit Log
            ${args.user.permissions.has('MANAGE_GUILD')} Manage Server *
            ${args.user.permissions.has('MANAGE_ROLES')} Manage Roles *
            ${args.user.permissions.has('MANAGE_CHANNELS')} Manage Channels *
            ${args.user.permissions.has('KICK_MEMBERS')} Kick Members *
            ${args.user.permissions.has('BAN_MEMBERS')} Ban Members *
            ${args.user.permissions.has('CREATE_INSTANT_INVITE')} Create Instant Invite
            ${args.user.permissions.has('CHANGE_NICKNAME')} Change Nickname
            ${args.user.permissions.has('MANAGE_NICKNAMES')} Manage Nicknames
            ${args.user.permissions.has('MANAGE_EMOJIS')} Manage Emojis *
            ${args.user.permissions.has('MANAGE_WEBHOOKS')} Manage Webhooks *
            ${args.user.permissions.has('VIEW_CHANNEL')} View Channels
          \`\`\``.replace(/true/g, '+').replace(/false/g, '-'),
          'inline': true
        },
        {
          'name': 'Text Permissions',
          'value': stripIndents`\`\`\`diff
            ${args.user.permissions.has('SEND_MESSAGES')} Send Messages
            ${args.user.permissions.has('SEND_TTS_MESSAGES')} Send TTS Messages
            ${args.user.permissions.has('MANAGE_MESSAGES')} Manage Messages *
            ${args.user.permissions.has('EMBED_LINKS')} Embed Links
            ${args.user.permissions.has('ATTACH_FILES')} Attach Files
            ${args.user.permissions.has('READ_MESSAGE_HISTORY')} Read Message History
            ${args.user.permissions.has('MENTION_EVERYONE')} Mention Everyone
            ${args.user.permissions.has('USE_EXTERNAL_EMOJIS')} Use External Emojis
            ${args.user.permissions.has('ADD_REACTIONS')} Add Reactions
          \`\`\``.replace(/true/g, '+').replace(/false/g, '-'),
          'inline': true
        },
        {
          'name': 'Voice Permissions',
          'value': stripIndents`\`\`\`diff
            ${args.user.permissions.has('CONNECT')} Connect
            ${args.user.permissions.has('SPEAK')} Speak
            ${args.user.permissions.has('MUTE_MEMBERS')} Mute Members
            ${args.user.permissions.has('DEAFEN_MEMBERS')} Deafen Members
            ${args.user.permissions.has('MOVE_MEMBERS')} Use Members
            ${args.user.permissions.has('USE_VAD')} Use Voice Activity
          \`\`\``.replace(/true/g, '+').replace(/false/g, '-'),
          'inline': true
        }
      ],
      color: userColor
    })
  }
}
