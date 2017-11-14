const { stripIndents } = require('common-tags')

module.exports = (client, command, promise, message) => {
  client.botStats.commandsUsed = client.botStats.commandsUsed + 1
  client.log.info(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandRun')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.commandRun) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandRun' },
          timestamp: new Date(),
          title: `commandRun${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: stripIndents`
            ${message.command ? `**Command:** ${message.command.memberName} \`(${message.command.groupID})\`` : ''}
            **User:** ${message.author.tag} \`(${message.author.id})\`
            ${message.guild ? `**Guild:** ${message.guild.name} \`(${message.guild.id})\`\n` : ''}**Channel:** ${message.guild ? `${message.channel.name} \`(${message.channel.id})\`` : 'DMs'}
            `,
          color: 0x00FFFF
        }]
      })
    }
  }
}
