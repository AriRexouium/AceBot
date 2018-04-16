// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const request = require('request')
const exec = require('child_process').execSync
const moment = require('moment')
require('moment-duration-format')

module.exports = class RepoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'repo',
      memberName: 'repo',
      group: 'information',
      description: 'Displays the GitHub repository information.',
      aliases: [
        'repository'
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

  async run (message) {
    let buildResult = ['Passing', 'Failing', 'Invalid']
    let buildResultColor = [0x39AA56, 0xDB4545, 0x9D9D9D]

    let GitHub = await apiRequest('http://api.github.com/repositories/77184461', { 'User-Agent': 'AceBot' })
    let TravisCI = await apiRequest('http://api.travis-ci.org/repositories/12117361.json', { 'User-Agent': 'AceBot' })
    GitHub = JSON.parse(GitHub); TravisCI = JSON.parse(TravisCI)

    message.embed({
      author: { name: message.client.user.tag, icon_url: message.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: GitHub.full_name,
      url: `http://github.com/${GitHub.full_name}`,
      description: GitHub.license.name,
      fields: [
        {
          'name': 'Repo Status',
          'value': stripIndents`
            Watchers: **${GitHub.watchers_count}**
            Stars: **${GitHub.stargazers_count}**
            Forks: **${GitHub.forks_count}**
          `,
          'inline': true
        },
        {
          'name': 'Build Status',
          'value': stripIndents`
            Build [#${TravisCI.last_build_number}](http://travis-ci.org/${TravisCI.slug}/builds/${TravisCI.last_build_id}) ❯ ${buildResult[TravisCI.last_build_result]}
            Ran for ${moment.duration(TravisCI.last_build_duration * 1000).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min, and] s [sec]')}
          `,
          'inline': true
        },
        {
          'name': 'Latest Build',
          'value': stripIndents`
            **Last Git Push:** ${moment(GitHub.pushed_at).format('llll')} ${moment.tz(moment.tz.guess()).format('z')}
            **Last Travis Build:** ${moment(TravisCI.last_build_finished_at).format('llll')} ${moment.tz(moment.tz.guess()).format('z')}
          `,
          'inline': true
        },
        {
          'name': 'Recent Commits',
          'value': exec(`git log --max-count=5 --format="[\`%h\`](http://github.com/${GitHub.full_name}/commit/%H) %s%n   - %aN, %ar"`).toString(), // eslint-disable-line no-useless-escape
          'inline': true
        }
      ],
      color: buildResultColor[TravisCI.last_build_result]
    })
  }
}

/**
 * Fetch information from more than one source.
 * @author cat16
 * @param {string} url The URL to fetch from.
 * @param {any} headers The headers to set.
 * @return {Promise<any>}
 */
let apiRequest = (url, headers) => {
  return new Promise((resolve, reject) => {
    request({ url, headers: headers },
      (error, response, data) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(data)
        }
      }
    )
  })
}
