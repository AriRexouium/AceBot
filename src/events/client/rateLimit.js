const { stripIndents } = require('common-tags')

module.exports = (client, rateLimitInfo) => {
  client.log.warn(stripIndents`
    You are being rate limited!
    Limit: ${rateLimitInfo.limit}
    Timeout: ${rateLimitInfo.timeout}ms.
    Method: ${rateLimitInfo.method}
    Path: ${rateLimitInfo.path}
  `, 'rateLimit')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.rateLimit) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'rateLimit' },
          timestamp: new Date(),
          title: `rateLimit${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          fields: [
            {
              'name': 'Limit',
              'value': rateLimitInfo.limit,
              'inline': true
            },
            {
              'name': 'Timeout',
              'value': `${rateLimitInfo.timeout}ms.`,
              'inline': true
            },
            {
              'name': 'Method',
              'value': rateLimitInfo.method,
              'inline': true
            },
            {
              'name': 'Path',
              'value': `\`${rateLimitInfo.path}\``,
              'inline': true
            }
          ],
          color: 0xFFFF00
        }]
      })
    }
  }
}
