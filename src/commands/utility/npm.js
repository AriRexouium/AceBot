const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const snekfetch = require('snekfetch')
const moment = require('moment')

module.exports = class NPMCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'npm',
      memberName: 'npm',
      group: 'utility',
      description: 'Search for a NPM package via the NPMJS registry.',
      clientPermissions: [
        'EMBED_LINKS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'package',
          prompt: 'Which npm package do you want to search for?',
          parse: value => value.toLowerCase(),
          validate: async value => {
            try {
              await snekfetch.get(`https://registry.npmjs.com/${value.toLowerCase()}`)
              return true
            } catch (error) {
              return 'that is not a valid NPM package.'
            }
          },
          type: 'string'
        }
      ]
    })
  }

  async run (message, args) {
    try {
      message.channel.startTyping()
      var npmPackage = await snekfetch.get(`https://registry.npmjs.com/${args.package}`)
      npmPackage = npmPackage.body
    } catch (error) {
      message.channel.stopTyping()
      return message.say('There was an error getting that NPM package.')
    }
    message.channel.stopTyping()
    return message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      url: npmPackage.repository && npmPackage.repository.homepage ? npmPackage.repository.homepage : '',
      title: `${npmPackage.name} - ${npmPackage.author.name}`,
      description: npmPackage.description,
      fields: [
        {
          name: 'Info',
          value: stripIndents`
            Latest Version: **${npmPackage['dist-tags'].latest}**
            Last Modified: **${moment(npmPackage.time.modified).format('L')} ${moment(npmPackage.time.modified).format('LTS')} ${moment.tz(moment.tz.guess()).format('z')}**
            Created: **${moment(npmPackage.time.created).format('L')} ${moment(npmPackage.time.created).format('LTS')} ${moment.tz(moment.tz.guess()).format('z')}**
          `,
          inline: true
        },
        {
          name: 'Maintainers',
          value: npmPackage.maintainers
            .map(m => `• ${m.name} <${m.email}>`)
            .join('\n'),
          inline: false
        }
      ],
      color: this.client.getClientColor(message)
    })
  }
}
