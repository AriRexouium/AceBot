const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = (client, message, reason) => {
  var eventName = client.getFileName(__filename)
  client.log('warn', stripIndents`\n
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    Reason: ${reason}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Commando Blocked', message.command ? `${message.command.memberName} (${message.command.groupID})` : '')

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
          title: `Command Blocked${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
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
              'name': 'Reason',
              'value': reason,
              'inline': true
            }
          ],
          color: 0xAA0000
        }]
      })
    }
  }
}
