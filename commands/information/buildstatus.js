// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const moment = require('moment')
require('moment-duration-format')
const request = require('request')

module.exports = class DiscordStatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'buildstatus',
      memberName: 'buildstatus',
      group: 'information',
      description: 'Displays the build status for the latest release of the bot.',
      aliases: ['buildstats'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  async run (message) {
    request({ url: 'http://api.travis-ci.org/repositories/12117361.json', headers: { 'User-Agent': 'AceBot' } }, function (error, response, body) {
      if (error) {
        return message.reply('It appears there was an error pulling stats from Travis CI.')
      } else {
        var buildResult = ['Passing', 'Failing', 'Invalid']
        body = JSON.parse(body)
        message.say({
          content: '',
          embed: {
            author: { name: message.client.user.tag, icon_url: message.client.user.displayAvatarURL() },
            footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
            timestamp: new Date(),
            title: body.slug,
            description: `[Status for build #${body.last_build_number}](http://travis-ci.org/Aceheliflyer/AceBot/builds/${body.last_build_id})`,
            fields: [
              {
                'name': 'Build Result',
                'value': buildResult[body.last_build_result],
                'inline': true
              },
              {
                'name': 'Build Duration',
                'value': `Ran for ${moment.duration(body.last_build_duration * 1000).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min, and] s [sec]')}`,
                'inline': true
              },
              {
                'name': 'Last Build',
                'value': `${moment(body.last_build_started_at).format('llll')} ${new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]}\n(${moment(body.last_build_started_at).fromNow()})`,
                'inline': false
              }
            ],
            color: 0x7289DA
          }
        })
      }
    })
  }
}
