const oneLine = require('common-tags').oneLine

module.exports = (client, warn) => {
  client.log.warn(oneLine`
    ${warn}
    ${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}
  `)

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.warn) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'warn' },
          timestamp: new Date(),
          title: `warn${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + fix(warn.stack) + '\n```',
          color: 0xFFFF00
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
