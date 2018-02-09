// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const moment = require('moment')
require('moment-duration-format')
const request = require('request')

module.exports = class DiscordStatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'gitstatus',
      memberName: 'gitstatus',
      group: 'information',
      description: 'Displays the GitHub repository information.',
      aliases: ['gitstats'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  run (message) {
    request({ url: 'http://api.github.com/repositories/77184461', headers: { 'User-Agent': 'AceBot' } }, function (error, response, body) {
      if (error) {
        message.reply('It appears there was an error pulling stats from GitHub.')
      } else {
        body = JSON.parse(body)
        message.say({
          content: '',
          embed: {
            author: { name: message.client.user.tag, icon_url: message.client.user.displayAvatarURL() },
            footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
            timestamp: new Date(),
            title: body.full_name,
            description: `Status for [${body.name}](${body.html_url})`,
            fields: [
              {
                'name': 'Current Stats',
                'value': stripIndents`
                  **Watchers:** ${body.watchers_count}
                  **Stars:** ${body.stargazers_count}
                  **Forks:** ${body.forks_count}
                `,
                'inline': true
              },
              {
                'name': 'License',
                'value': body.license.name,
                'inline': true
              },
              {
                'name': 'Last Updated',
                'value': `${moment(body.pushed_at).format('llll')} ${new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]}\n(${moment(body.pushed_at).fromNow()})`,
                'inline': true
              }
            ],
            color: 0x7289DA
          }
        })
      }
    })
  }
}
