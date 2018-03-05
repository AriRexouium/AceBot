const { stripIndents } = require('common-tags')
const fs = require('fs')
const yaml = require('js-yaml')
const sentryConfig = yaml.safeLoad(fs.readFileSync('./config/sentry.yml', 'utf8'))

module.exports = (client, command, error, message, args, fromPattern) => {
  client.log.error(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
    ${error.stack}
  `, 'commandError')

  if (client.config.react.commandError.enabled === true) {
    message.react(client.config.react.commandError.emoji)
  }

  // Global Command Errors (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'commandError' })
  // User Command Errors (persistent)
  client.temp.sqlData.push({ location: message.author.id, type: 'commandError' })
  // Channel Command Errors (persistent)
  client.temp.sqlData.push({ location: message.channel.id, type: 'commandError' })
  if (message.guild) {
    // Guild Command Errors (persistent)
    client.temp.sqlData.push({ location: message.guild.id, type: 'commandError' })
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandError) {
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
      release: require('../package.json').version,
      tags: {
        command: message.command ? `${message.command.memberName} (${message.command.groupID})` : '',
        user: `${message.author.tag} (${message.author.id})`,
        channel: message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs',
        guild: message.guild ? `${message.guild.name} (${message.guild.id})` : '',
        shard_id: client.shard ? client.shard.id : ''
      }
    }).install()
    Raven.captureException(error)
  }
}
