const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = (client, command, promise, message, args, fromPattern) => {
  var eventName = client.getFileName(__filename)
  client.botStats.commandsUsed = client.botStats.commandsUsed + 1

  if (client.config.react[eventName].enabled === true) {
    try {
      message.react(client.config.react[eventName].emoji)
    } catch (error) {}
  }

  client.log('info', stripIndents`
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Command Run', message.command ? `${message.command.memberName} (${message.command.groupID})` : '')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents[eventName]) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: eventName },
          timestamp: new Date(),
          title: `Command Run${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          thumbnail: { url: message.author.displayAvatarURL() },
          fields: [
            {
              name: 'Command',
              value: stripIndents`
                **Name:** ${message.command.memberName}
                **Group ID:** ${message.command.groupID}
                ${message.argString ? `**Args:** ${escapeMarkdown(message.argString)}` : ''}
              `,
              inline: true
            },
            {
              name: 'User',
              value: stripIndents`
                **Tag:** ${escapeMarkdown(message.author.tag)}
                **ID:** ${message.author.id}
                **Status:** ${message.author.presence.status}
              `,
              inline: true
            },
            {
              name: 'Location',
              value: stripIndents`
                ${message.guild ? `**Guild:** ${escapeMarkdown(message.guild.name)} \`(${message.guild.id})\`` : ''}
                **Channel:** ${message.guild ? `${message.channel.name} \`(${message.channel.id})\`` : 'DMs'}
              `,
              inline: true
            }
          ],
          color: 0x00FFFF
        }]
      })
    }
  }
}
