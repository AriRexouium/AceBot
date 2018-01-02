const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')

module.exports = class AboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      memberName: 'info',
      group: 'information',
      description: 'Displays information about the bot.',
      details: 'Displays information and information about this bot.',
      aliases: ['about'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      guarded: true
    })
  }

  async run (message) {
    /* Start Contributors */
    var dev; var contrib1; var contrib2; var contrib3
    try { dev = this.client.users.find('id', '196443959558406144').tag } catch (e) { dev = 'Aceheliflyer#0950' }
    try { contrib1 = this.client.users.find('id', '217797734982352896').tag } catch (e) { contrib1 = 'cat16#0725' }
    try { contrib2 = this.client.users.find('id', '171319044715053057').tag } catch (e) { contrib2 = 'Michael | ASIANBOI#9310' }
    try { contrib3 = this.client.users.find('id', '325828052422492162').tag } catch (e) { contrib3 = 'Ariathe#4163' }
    /* End Contributors */
    var clientInvite = await this.client.generateInvite()
    var totalGuilds; var totalChannels; var totalUsers; var isSharded
    if (!this.client.shard) {
      totalGuilds = await this.client.guilds.size
      totalChannels = await this.client.channels.size
      totalUsers = await this.client.users.size
      isSharded = 'Master'
    } else {
      var totalGuildsData = await this.client.shard.fetchClientValues('guilds.size')
      totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
      var totalChannelsData = await this.client.shard.fetchClientValues('channels.size')
      totalChannels = await totalChannelsData.reduce((prev, val) => prev + val, 0)
      var totalUsersData = await this.client.shard.fetchClientValues('users.size')
      totalUsers = await totalUsersData.reduce((prev, val) => prev + val, 0)
      isSharded = this.client.shard.count
    }
    message.say({
      content: '',
      embed: {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        fields: [
          { 'name': 'Developer', 'value': `**${dev}**`, 'inline': true },
          { 'name': 'Version', 'value': require('../../package.json').version, 'inline': true },
          { 'name': 'Library', 'value': `discord.js v${require('discord.js/package.json').version}`, 'inline': true },
          { 'name': 'Guilds', 'value': totalGuilds, 'inline': true },
          { 'name': 'Channels', 'value': totalChannels, 'inline': true },
          { 'name': 'Users', 'value': totalUsers, 'inline': true },
          { 'name': 'Shards', 'value': isSharded, 'inline': true },
          { 'name': 'Bot Invite', 'value': `[Click here!](${clientInvite})`, 'inline': true },
          { 'name': 'Server Invite', 'value': `[Click here!](${this.client.config.startConfig.invite})`, 'inline': true },
          { 'name': 'GitHub', 'value': `[Click here!](${require('../../package.json').homepage})`, 'inline': true },
          {
            'name': 'Contributors',
            'value': stripIndents`
              **${contrib1} -** Helped with a lot of issues I had.
              **${contrib2} -** Offered suggestions and feedback.
              **${contrib3} -** Designed the avatar for Acebot.
            `,
            'inline': false
          }
        ],
        color: 0x7289DA
      }
    })
  }
}
