const { oneLine } = require('common-tags')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = async (client, guild) => {
  var ownerInfo = guild.owner.user

  client.log.info(stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${ownerInfo.tag} (${ownerInfo.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'guildCreate')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.guildCreate) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'guildCreate' },
          timestamp: new Date(),
          title: `guildCreate${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
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
                **ID:** ${ownerInfo.user.id}
                **Status:** ${ownerInfo.presence.status}
              `,
              'inline': true
            },
            {
              'name': `Members - (${guild.members.size})`,
              'value': oneLine`
                **Users:** ${await guild.members.filter(s => s.user.bot !== true).size}
                | **Bots:** ${await guild.members.filter(s => s.user.bot !== false).size}
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
