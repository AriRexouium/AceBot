const { stripIndents } = require('common-tags')

module.exports = (client, warning) => {
  client.log.error(stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${warning.stack}
  `, 'warning')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.processEvents.warning) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'processWarning' },
          timestamp: new Date(),
          title: `processWarning${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + fix(warning.stack) + '\n```',
          color: 0xAAAA00
        }]
      })
    }
  }
}
var fix = (text) => {
  if (typeof (text) === 'string') {
    return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203))
    .replace(/#/g, '#' + String.fromCharCode(8203))
  } else {
    return text
  }
}
