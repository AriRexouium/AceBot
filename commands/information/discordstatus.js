// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const scrapeIt = require('scrape-it')

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'discordstatus',
      memberName: 'discordstatus',
      group: 'information',
      description: 'Displays Discord server statistics.',
      aliases: ['discordstats'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  async run (message) {
    /* Thanks to Thatguychris#3998 for doing the webscraping. */
    scrapeIt(`http://status.discordapp.com`, {
      // API
      api: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(1) > div > span.component-status',
      apiUptime: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(1) > div > div > div > div.legend-item.legend-item-uptime-value',
      // Gateway
      gateway: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(2) > div > span.component-status',
      gatewayUptime: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(2) > div > div > div > div.legend-item.legend-item-uptime-value',
      // CloudFlare
      cloudflare: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(3) > div > span.component-status',
      // Media Proxy
      mediaproxy: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(4) > div > span.component-status',
      mediaproxyUptime: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(4) > div > div > div > div.legend-item.legend-item-uptime-value',
      // Voice
      voice: 'body > div.layout-content.status.status-index.starter > div.container > div.components-section.font-regular > div.components-container.one-column > div:nth-child(5) > div > span.component-status'
    }).then(webContent => {
      message.say({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          title: 'Discord Status',
          fields: [
            {
              'name': 'API',
              'value': `**${webContent.api}**\n❯ ${webContent.apiUptime.replace(' ', '')}`,
              'inline': true
            },
            {
              'name': 'Gateway',
              'value': `**${webContent.gateway}**\n❯ ${webContent.gatewayUptime.replace(' ', '')}`,
              'inline': true
            },
            {
              'name': 'Media Proxy',
              'value': `**${webContent.mediaproxy}**\n❯ ${webContent.mediaproxyUptime.replace(' ', '')}`,
              'inline': true
            },
            {
              'name': 'CloudFlare',
              'value': `**${webContent.cloudflare}**`,
              'inline': true
            },
            {
              'name': 'Voice',
              'value': `**${webContent.voice}**`,
              'inline': true
            }
          ],
          color: 0x7289DA
        }
      })
    }
    )
  }
}
