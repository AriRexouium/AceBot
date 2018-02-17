const { Command } = require('discord.js-commando')
const { oneLineCommaListsAnd } = require('common-tags')

module.exports = class InfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'emojis',
      memberName: 'emojis',
      group: 'information',
      description: 'Displays information about the bot.',
      aliases: ['emojilist'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      guildOnly: true
    })
  }

  async run (message) {
    if (!message.guild.emojis.length > 0) {
      var clientColor
      if (message.guild) {
        clientColor = message.guild.members.get(this.client.user.id).displayHexColor
        if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
      } else {
        clientColor = 0x7289DA
      }

      // Static Emojis
      var staticEmojis = message.guild.emojis.filter(emoji => emoji.animated === false)
      let staticEmojiCount = staticEmojis.size
      if (staticEmojis.size > 1) {
        staticEmojis = oneLineCommaListsAnd`${staticEmojis.map(emoji => `\`:${emoji.name}:\``)}`
      } else {
        staticEmojis = 'N/A'
      }

      // Animated Emojis
      var animatedEmojis = message.guild.emojis.filter(emoji => emoji.animated === true)
      let animatedEmojiCount = animatedEmojis.size
      if (animatedEmojis.size > 1) {
        animatedEmojis = oneLineCommaListsAnd`${animatedEmojis.map(emoji => `\`:${emoji.name}:\``)}`
      } else {
        animatedEmojis = 'N/A'
      }

      message.embed({
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        fields: [
          {
            'name': `Regular Emojis - (${staticEmojiCount})`,
            'value': staticEmojis,
            'inline': true
          },
          {
            'name': `Animated - (${animatedEmojiCount})`,
            'value': animatedEmojis,
            'inline': true
          }
        ],
        color: clientColor
      })
    } else {
      message.reply('this guild has no emojis!')
    }
  }
}
