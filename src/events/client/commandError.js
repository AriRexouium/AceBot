const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = (client, command, error, message, args, fromPattern) => {
  var eventName = client.getFileName(__filename)
  client.temp.error = error
  client.log('error', stripIndents`\n
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
    ${error.stack}
  `, 'Command Error', message.command ? `${message.command.memberName} (${message.command.groupID})` : '')

  if (client.config.react[eventName].enabled === true) {
    try {
      message.react(client.config.react[eventName].emoji)
    } catch (error) {}
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents[eventName]) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: eventName },
          timestamp: new Date(),
          title: `Command Error${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          thumbnail: { url: message.author.displayAvatarURL() },
          fields: [
            {
              'name': 'Command',
              'value': `${message.command.memberName} \`(${message.command.groupID})\``,
              'inline': true
            },
            {
              'name': 'User',
              'value': stripIndents`
                **Tag:** ${escapeMarkdown(message.author.tag)}
                **ID:** ${message.author.id}
                **Status:** ${message.author.presence.status}
              `,
              'inline': true
            },
            {
              'name': 'Location',
              'value': stripIndents`
                ${message.guild ? `**Guild:** ${escapeMarkdown(message.guild.name)} \`(${message.guild.id})\`` : ''}
                **Channel:** ${message.guild ? `${message.channel.name} \`(${message.channel.id})\`` : 'DMs'}
              `,
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
  if (client.config.sentry.enabled === true) {
    var Raven = require('raven')
    Raven.config(`https://${client.config.sentry.token}@sentry.io/${client.config.sentry.id}`, {
      release: require(`${process.cwd()}/package.json`).version,
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
