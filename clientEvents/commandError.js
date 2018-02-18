const { stripIndents } = require('common-tags')
const fs = require('fs')
const yaml = require('js-yaml')
const sentryConfig = yaml.safeLoad(fs.readFileSync('./config/sentry.yml', 'utf8'))

module.exports = (client, command, error, message) => {
  client.log.error(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
    ${error.stack}
  `, 'commandError')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.commandError) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandError' },
          timestamp: new Date(),
          title: `commandError${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          fields: [
            {
              'name': 'Command',
              'value': message.command ? `${message.command.memberName} \`(${message.command.groupID})\`` : '',
              'inline': true
            },
            {
              'name': 'User',
              'value': `${message.author.tag} \`(${message.author.id})\``,
              'inline': true
            },
            {
              'name': 'Location',
              'value': `${message.guild ? `**Guild:** ${message.guild.name} \`(${message.guild.id})\`\n` : ''}**Channel:** ${message.guild ? `${message.channel.name} \`(${message.channel.id})\`` : 'DMs'}`,
              'inline': true
            },
            {
              'name': 'Error',
              'value': `\`\`\`js\n${error.stack}\n\`\`\``,
              'inline': false
            }
          ],
          color: 0xAA0000
        }]
      })
    }
  }

  // Sentry
  if (sentryConfig.enabled === true) {
    var Raven = require('raven')
    Raven.config(`https://${sentryConfig.token}@sentry.io/${sentryConfig.id}`, {
      release: require('../package.json').version
    }).install()
    Raven.captureException(error)
  }
}
