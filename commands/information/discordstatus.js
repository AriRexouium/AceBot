// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const scrapeIt = require('scrape-it')

module.exports = class DiscordStatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'discordstatus',
      memberName: 'discordstatus',
      group: 'information',
      description: 'Displays Discord server statistics.',
      details: 'Displays Discord server statistics such as uptime and operational status.',
      aliases: ['discordstats'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  run (message) {
    scrapeIt(`http://status.discordapp.com`, {
      // Overall
      overall: 'body > div.layout-content.status.status-index.starter > div.container > div.page-status.status-none > span.status.font-large',
      overallError: 'body > div.layout-content.status.status-index.starter > div.container > div.unresolved-incidents > div.unresolved-incident.impact-none > div.incident-title.font-large',
      /* Thanks to Thatguychris#3998 for doing the webscraping for the values below. */
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
      var status
      if (webContent.overall !== '') { status = webContent.overall } else { status = webContent.overallError.replace(/Subscribe/g, '') }
      message.say({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          title: 'Discord Status',
          description: `**${status}**`,
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
    })
  }
}
