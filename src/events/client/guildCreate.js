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

        **For help, feedback, bugs, info, and more go to <https://discord.gg/8QebTbk>**.
      `)
    }
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
          title: `Joined Server${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          thumbnail: { url: guild ? guild.iconURL() : client.user.displayAvatarURL() },
          fields: [
            {
              name: 'Guild',
              value: `${guild.name} \`(${guild.id})\``,
              inline: true
            },
            {
              name: 'Owner',
              value: stripIndents`
                **Name:** ${escapeMarkdown(ownerInfo.tag)}
                **ID:** ${ownerInfo.id}
                **Status:** ${ownerInfo.presence.status}
              `,
              inline: true
            },
            {
              name: `Members - (${guild.members.size.toLocaleString()})`,
              value: oneLine`
                **Users:** ${await guild.members.filter(s => s.user.bot !== true).size.toLocaleString()}
                | **Bots:** ${await guild.members.filter(s => s.user.bot !== false).size.toLocaleString()}
              `,
              inline: true
            }
          ],
          color: 0x4D4DFF
        }]
      })
    }
  }
}
