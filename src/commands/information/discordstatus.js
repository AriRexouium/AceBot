// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const snekfetch = require('snekfetch')

module.exports = class DiscordStatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'discordstatus',
      memberName: 'discordstatus',
      group: 'information',
      description: 'Displays Discord server statistics.',
      details: 'Displays Discord server statistics such as uptime and operational status.',
      aliases: [
        'discordstats'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  run (message) {
    message.channel.startTyping()
    snekfetch.get('http://srhpyqt94yxb.statuspage.io/api/v2/summary.json')
      .set('User-Agent', 'AceBot')
      .then((body, error) => {
        if (error) {
          return message.reply('it appears there was an error pulling stats from Statuspage.')
        } else {
          body = JSON.parse(body.text)
          message.embed({
            author: { name: message.client.user.tag, icon_url: message.client.user.displayAvatarURL() },
            footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
            url: body.page.url,
            timestamp: new Date(),
            title: 'Discord Status',
            description: `**${body.status.description}**`,
            fields: [
              {
                name: body.components[0].name, // API
                value: `❯ **${body.components[0].status}**`,
                inline: true
              },
              {
                name: body.components[2].name, // Gateway
                value: `❯ **${body.components[2].status}**`,
                inline: true
              },
              {
                name: body.components[6].name, // Media Proxy
                value: `❯ **${body.components[6].status}**`,
                inline: true
              },
              {
                name: body.components[4].name, // CloudFlare
                value: `❯ **${body.components[4].status}**`,
                inline: true
              },
              {
                name: body.components[8].name, // Voice
                value: `❯ **${body.components[8].status}**`,
                inline: true
              }
            ],
            color: 0x7289DA
          })
        }
        message.channel.stopTyping()
      })
  }
}
