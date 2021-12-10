// NOTE: This command has not been tested if there is a server outage.
const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const snekfetch = require('snekfetch')
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
    message.channel.startTyping()
    const buildResult = ['Passing', 'Failing', 'Invalid']
    const buildResultColor = [0x39AA56, 0xDB4545, 0x9D9D9D]

    const GitHub = await apiRequest('https://api.github.com/repositories/77184461')
    const Commits = await apiRequest('https://api.github.com/repositories/77184461/commits')
    const TravisCI = await apiRequest('https://api.travis-ci.org/repositories/12117361.json')

    message.embed({
      author: { name: message.client.user.tag, icon_url: message.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: GitHub.full_name,
      url: `https://github.com/${GitHub.full_name}`,
      description: GitHub.license.name,
      fields: [
        {
          name: 'Repo Status',
          value: stripIndents`
            Watchers: **${GitHub.watchers_count}**
            Stars: **${GitHub.stargazers_count}**
            Forks: **${GitHub.forks_count}**
          `,
          inline: true
        },
        {
          name: 'Build Status',
          value: stripIndents`
            Build [#${TravisCI.last_build_number}](https://travis-ci.org/${TravisCI.slug}/builds/${TravisCI.last_build_id}) ❯ ${buildResult[TravisCI.last_build_result]}
            Ran for ${moment.duration(TravisCI.last_build_duration * 1000).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min, and] s [sec]')}
          `,
          inline: true
        },
        {
          name: 'Latest Build',
          value: stripIndents`
            **Last Git Push:** ${moment(GitHub.pushed_at).format('llll')} ${moment.tz(moment.tz.guess()).format('z')}
            **Last Travis Build:** ${moment(TravisCI.last_build_finished_at).format('llll')} ${moment.tz(moment.tz.guess()).format('z')}
          `,
          inline: true
        },
        {
          name: 'Recent Commits',
          value: Commits.slice(0, 5).map(commit => `[\`${commit.sha.substr(0, 7)}\`](${commit.html_url}) ${commit.commit.message}\n   - ${commit.commit.author.name}, ${moment(commit.commit.author.date).fromNow()}`).join('\n'),
          inline: true
        }
      ],
      color: buildResultColor[TravisCI.last_build_result]
    })
    message.channel.stopTyping()
  }
}

/**
 * Fetch information from more than one source.
 * @author cat16
 * @param {string} url The URL to fetch from.
 * @return {Promise<any>}
 */
const apiRequest = url => {
  return new Promise((resolve, reject) => {
    snekfetch.get(url)
      .set('User-Agent', 'AceBot')
      .then((data, error) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(JSON.parse(data.text))
        }
      })
  })
}
