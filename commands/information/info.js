const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = class InfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      memberName: 'info',
      group: 'information',
      description: 'Displays information about the bot.',
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
    var dev; var contrib1; var contrib2; var contrib3; var contrib4
    try { dev = this.client.users.find('id', '196443959558406144').tag } catch (e) { dev = 'Aceheliflyer#0950' }
    try { contrib1 = this.client.users.find('id', '217797734982352896').tag } catch (e) { contrib1 = 'cat16#0725' }
    try { contrib2 = this.client.users.find('id', '171319044715053057').tag } catch (e) { contrib2 = 'Michael | ASIANBOI#9310' }
    try { contrib3 = this.client.users.find('id', '325828052422492162').tag } catch (e) { contrib3 = 'Ariathe#4163' }
    try { contrib4 = this.client.users.find('id', '158397118611062785').tag } catch (e) { contrib3 = 'Thatguychris#3998' }
    /* End Contributors */
    var totalGuilds; var totalChannels; var totalUsers
    if (!this.client.shard) {
      totalGuilds = await this.client.guilds.size
      totalChannels = await this.client.channels.size
      totalUsers = await this.client.users.size
    } else {
      var totalGuildsData = await this.client.shard.fetchClientValues('guilds.size')
      totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
      var totalChannelsData = await this.client.shard.fetchClientValues('channels.size')
      totalChannels = await totalChannelsData.reduce((prev, val) => prev + val, 0)
      var totalUsersData = await this.client.shard.fetchClientValues('users.size')
      totalUsers = await totalUsersData.reduce((prev, val) => prev + val, 0)
    }
    message.say({
      content: '',
      embed: {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        fields: [
          /* eslint-disable object-property-newline */
          { 'name': 'Developer', 'value': `**${escapeMarkdown(dev)}**`, 'inline': true },
          { 'name': 'Version', 'value': require('../../package.json').version, 'inline': true },
          { 'name': 'Library', 'value': stripIndents`
            **discord.js-commando** v${require('discord.js-commando/package.json').version}
            **discord.js** v${require('discord.js/package.json').version}
          `, 'inline': true },
          { 'name': 'Invites', 'value': stripIndents`
          [Bot Invite](${await this.client.generateInvite()})
          [Server Invite](${this.client.config.startConfig.invite})
          `, 'inline': true },
          { 'name': 'Websites', 'value': stripIndents`
          [Homepage](${require('../../package.json').homepage})
          [Repository](${require('../../package.json').homepageGithub})
          `, 'inline': true },
          { 'name': 'Discord Stats', 'value': stripIndents`
            ${this.client.shard ? `**Shards:** ${this.client.shard.count}\n` : ''}**Guilds:** ${totalGuilds}
            **Channels:** ${totalChannels}
            **Users:** ${totalUsers}
          `, 'inline': true },
          {
            'name': 'Contributors',
            'value': stripIndents`
              **${escapeMarkdown(contrib1)} -** Helped with a lot of issues I had.
              **${escapeMarkdown(contrib2)} -** Offered suggestions and feedback.
              **${escapeMarkdown(contrib3)} -** Designed the avatar for Acebot.
              **${escapeMarkdown(contrib4)} -** Did the web scraping for \`discordstatus\`.
            `,
            'inline': false
          }
          /* eslint-enable object-property-newline */
        ],
        color: 0x7289DA
      }
    })
  }
}
