const { oneLine } = require('common-tags')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = async (client, guild) => {
  var ownerInfo = guild.owner.user

  client.log('info', stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${ownerInfo.tag} (${ownerInfo.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Left Server', guild.name)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.guildDelete) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'guildDelete' },
          timestamp: new Date(),
          title: `guildDelete${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
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
