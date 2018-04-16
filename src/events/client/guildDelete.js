const { oneLine } = require('common-tags')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = async (client, guild) => {
  var eventName = client.getFileName(__filename)
  var ownerInfo = guild.owner.user

  client.log('info', stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${ownerInfo.tag} (${ownerInfo.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Left Server', guild.name)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents[eventName]) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: eventName },
          timestamp: new Date(),
          title: `Left Server${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          thumbnail: { url: guild ? guild.iconURL() : client.user.displayAvatarURL() },
          fields: [
            {
              'name': 'Guild',
              'value': `${guild.name} \`(${guild.id})\``,
              'inline': true
            },
            {
              'name': 'Owner',
              'value': stripIndents`
                **Name:** ${escapeMarkdown(ownerInfo.tag)}
                **ID:** ${ownerInfo.id}
                **Status:** ${ownerInfo.presence.status}
              `,
              'inline': true
            },
            {
              'name': `Members - (${guild.members.size.toLocaleString()})`,
              'value': oneLine`
                **Users:** ${await guild.members.filter(s => s.user.bot !== true).size.toLocaleString()}
                | **Bots:** ${await guild.members.filter(s => s.user.bot !== false).size.toLocaleString()}
              `,
              'inline': true
            }
          ],
          color: 0x4D4DFF
        }]
      })
    }
  }
}
