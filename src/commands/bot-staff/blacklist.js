const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class BlacklistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'blacklist',
      memberName: 'blacklist',
      group: 'bot-staff',
      description: 'Add or remove a user from the blacklist.',
      details: 'Allows the owners to add or remove a user from the bot blacklist.',
      aliases: [
        'ban'
      ],
      examples: [
        'blacklist add <ID>',
        'blacklist remove <@mention>'
      ],
      args: [
        {
          key: 'query',
          label: 'add/remove',
          prompt: 'What would you like to do (add, remove)?',
          type: 'string',
          parse: value => value.toLowerCase(),
          validate: value => ['add', 'remove'].includes(value)
        },
        {
          key: 'user',
          prompt: 'Who do you want to add or remove from the blacklist?',
          type: 'user'
        }
      ],
      guarded: true
    })
  }

  hasPermission (message) {
    if (
      this.client.provider.get('global', 'developer', []).includes(message.author.id) ||
      this.client.provider.get('global', 'staff', []).includes(message.author.id) ||
      this.client.isOwner(message.author.id)
    ) {
      return true
    } else {
      return 'only bot staff can run this command.'
    }
  }

  run (message, args) {
    var blacklist = this.client.provider.get('global', 'userBlacklist', [])
    if (args.query === 'add') {
      if (this.client.isOwner(args.user.id)) return message.say('Bot owner(s) cannot be blacklisted.')
      if (blacklist.includes(args.user.id)) return message.say('That user is already in the blacklist.')
      blacklist.push(args.user.id)
      this.client.provider.set('global', 'userBlacklist', blacklist)
      this.client.log.info(`${args.user.tag} was added to the blacklist by ${message.author.tag}.`, 'blacklistAdd')

      // Webhook
      if (this.client.config.webhook.enabled) {
        if (this.client.config.webhook.blacklistEvents.blacklistAdd) {
          this.client.webhook({
            content: '',
            username: this.client.user.username,
            avatarURL: this.client.user.displayAvatarURL(),
            embeds: [{
              author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
              footer: { text: 'blacklistAdd' },
              timestamp: new Date(),
              title: `blacklistAdd${this.client.shard ? ` | Shard ID: ${this.client.shard.id}` : ''}`,
              description: `**${args.user.tag}** was added to the blacklist by **${message.author.tag}**.`,
              color: 0xFFFF00
            }]
          })
        }
      }
      return message.say(`**${escapeMarkdown(args.user.tag)}** has been added to the blacklisted.`)
    } else if (args.query === 'remove') {
      if (!blacklist.includes(args.user.id)) return message.say('That user is not in the blacklist.')
      var index = blacklist.indexOf(args.user.id)
      blacklist.splice(index, 1)
      if (blacklist.length === 0) {
        this.client.provider.remove('global', 'userBlacklist')
      } else {
        this.client.provider.set('global', 'userBlacklist', blacklist)
      }
      this.client.log.info(`${args.user.tag} was removed from the blacklist by ${message.author.tag}.`, 'blacklistRemove')

      // Webhook
      if (this.client.config.webhook.enabled) {
        if (this.client.config.webhook.blacklistEvents.blacklistRemove) {
          this.client.webhook({
            content: '',
            username: this.client.user.username,
            avatarURL: this.client.user.displayAvatarURL(),
            embeds: [{
              author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
              footer: { text: 'blacklistRemove' },
              timestamp: new Date(),
              title: `blacklistRemove${this.client.shard ? ` | Shard ID: ${this.client.shard.id}` : ''}`,
              description: `**${args.user.tag}** was removed from the blacklist by **${message.author.tag}**.`,
              color: 0xFFFF00
            }]
          })
        }
      }
      return message.say(`**${escapeMarkdown(args.user.tag)}** has been removed from the blacklist.`)
    }
  }
}
