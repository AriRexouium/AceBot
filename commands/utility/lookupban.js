const { Command } = require('discord.js-commando')

module.exports = class LookUpBanCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lookupban',
      memberName: 'lookupban',
      group: 'utility',
      description: 'Checks to see if a user is banned on <http://bans.discordlist.net>',
      examples: [
        'lookupban 253254587341996032',
        'lookupban AceBot',
        'lookupban AceBot#8377'
      ],
      aliases: ['banlookup', 'isbanned'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to lookup?',
          type: 'user'
        }
      ]
    })
  }

  async run (message, args) {
    try {
      var isUserBanned = await this.client.banList.lookup(args.user.id)
      if (isUserBanned === true) {
        message.say(`**${args.user.tag}** is banned on <http://bans.discordlist.net>.`)
      } else {
        message.say(`**${args.user.tag}** is not banned on <http://bans.discordlist.net>.`)
      }
    } catch (error) {
      return message.say('The bot owner either supplied an invalid token or hasn\'t setup a token yet, try this command later')
    }
  }
}
