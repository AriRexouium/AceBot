const { oneLine } = require('common-tags')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = async (client, guild) => {
  var ownerInfo = guild.owner.user

  client.log('info', stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${ownerInfo.tag} (${ownerInfo.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'Joined Server', guild.name)

  // Server Join Message
  if (!client.config.client.joinMessageBlacklist.includes(guild.id)) {
    var dev
    try { dev = this.client.users.get('196443959558406144').tag } catch (e) { dev = 'Aceheliflyer#0950' }
    var messageChannel = guild.channels.filter(channel => channel.type === 'text')
    messageChannel = messageChannel.find(channel => channel.permissionsFor(client.user.id).has('SEND_MESSAGES'))
    if (messageChannel !== undefined) {
      messageChannel.send(stripIndents`
        Hello, **${guild.name}**! I am, **${client.user.username}**!

        **|**  Use \`${client.options.commandPrefix}help\` to view all commands available to you.
        **|**  Use \`${client.options.commandPrefix}contact\` to get in contact with a developer.
        **|**  I am created and owned by **${dev}**.

        **For help, feedback, bugs, info, and more go to <http://discord.gg/Y6Vgfyd>**.
      `)
    }
  }

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
                **ID:** ${ownerInfo.id}
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
