const { Command } = require('discord.js-commando')

module.exports = class BlacklistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'blacklist',
      group: 'bot-staff',
      memberName: 'blacklist',
      description: 'Adds a user to the blacklist.',
      aliases: ['ban'],
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          key: 'query',
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
      ownerOnly: true,
      guarded: true
    })
  }

  run (message, args) {
    var blacklist = this.client.provider.get('global', 'userBlacklist', [])
    if (args.query === 'add') {
      if (this.client.isOwner(args.user.id)) return message.say('Bot owners cannot be blacklisted.')
      if (blacklist.includes(args.user.id)) return message.say('That user is already in the blacklist.')
      blacklist.push(args.user.id)
      this.client.provider.set('global', 'userBlacklist', blacklist)
      this.client.log.info(`${args.user.tag} was added to the blacklist by ${message.author.tag}.`, 'blacklistAdd')

      // Webhook
      if (this.client.config.webhookConfig.enabled) {
        if (this.client.config.webhookConfig.blacklistEvents.blacklistAdd) {
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
      return message.say(`**${args.user.tag}** has been added to the blacklisted.`)
    } else if (args.query === 'remove') {
      if (!blacklist.includes(args.user.id)) return message.say('That user is not in the blacklist.')
      var index = blacklist.indexOf(args.user.id)
      blacklist.splice(index, 1)
      if (blacklist.length === 0) this.client.provider.remove('global', 'userBlacklist')
      else this.client.provider.set('global', 'userBlacklist', blacklist)
      this.client.log.info(`${args.user.tag} was removed from the blacklist by ${message.author.tag}.`, 'blacklistRemove')

      // Webhook
      if (this.client.config.webhookConfig.enabled) {
        if (this.client.config.webhookConfig.blacklistEvents.blacklistRemove) {
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
      return message.say(`**${args.user.tag}** has been removed from the blacklist.`)
    }
  }
}
