const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = class InfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      memberName: 'info',
      group: 'information',
      description: 'Displays information about the bot.',
      aliases: [
        'about'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      guarded: true
    })
  }

  async run (message) {
    var dev
    try { dev = this.client.users.get('196443959558406144').tag } catch (e) { dev = 'Aceheliflyer#0950' }

    var contributorsList = ''
    this.client.config.contributors.forEach(contributor => {
      try {
        let contribTemp = this.client.users.get(contributor.id).tag
        if (contributor.github) {
          contributorsList = `${contributorsList}\n**[${escapeMarkdown(contribTemp)}](http://github.com/${contributor.github})** - ${contributor.info}`
        } else {
          contributorsList = `${contributorsList}\n**${escapeMarkdown(contribTemp)}** - ${contributor.info}`
        }
      } catch (e) {
        if (contributor.github) {
          contributorsList = `${contributorsList}\n**[${escapeMarkdown(contributor.name)}](http://github.com/${contributor.github})** - ${contributor.info}`
        } else {
          contributorsList = `${contributorsList}\n**${escapeMarkdown(contributor.name)}** - ${contributor.info}`
        }
      }
    })

    var totalGuilds; var totalChannels; var totalUsers
    if (!this.client.shard) {
      totalGuilds = await this.client.guilds.size
      totalChannels = await this.client.channels.size
      totalUsers = await this.client.users.size
    } else {
      var totalGuildsData = await this.client.shard.fetchClientValues('guilds.size')
      totalGuilds = await totalGuildsData.reduce((prev, val) => prev + val, 0)
      var totalChannelsData = await this.client.shard.fetchClientValues('channels.size')
      totalChannels = await totalChannelsData.reduce((prev, val) => prev + val, 0)
      var totalUsersData = await this.client.shard.fetchClientValues('users.size')
      totalUsers = await totalUsersData.reduce((prev, val) => prev + val, 0)
    }

    message.embed({
      author: {
        name: await this.client.fetchApplication().then(app => { return `${app.owner.tag} | ${this.client.user.tag}` }),
        icon_url: this.client.user.displayAvatarURL(),
        url: require(`${process.cwd()}/package.json`).homepageGithub
      },
      footer: {
        text: message.author.tag,
        icon_url: message.author.displayAvatarURL()
      },
      timestamp: new Date(),
      fields: [
        /* eslint-disable object-property-newline */
        {
          'name': 'Developer',
          'value': stripIndents`
            Discord: **${escapeMarkdown(dev)}**
            GitHub: [@Aceheliflyer](http://github.com/Aceheliflyer)
          `,
          'inline': false
        },
        {
          'name': 'Developed In',
          'value': stripIndents`
            Language: **JavaScript** (NodeJS)
            Library: **discord.js** (v${require('discord.js/package.json').version})
            Framework: **discord.js-commando** (v${require('discord.js-commando/package.json').version})
            Bot Version: **${require(`${process.cwd()}/package.json`).version}**
          `,
          'inline': false
        },
        {
          'name': 'Links', 'value': stripIndents`
          Bot Invite: [Click Here!](${await this.client.generateInvite()})
          Server Invite: [Click Here!](${this.client.options.invite})
          Homepage: [Click Here!](${require(`${process.cwd()}/package.json`).homepage})
          Repository: [Click Here!](${require(`${process.cwd()}/package.json`).homepageGithub})
          Trello: [Click Here!](${require(`${process.cwd()}/package.json`).homepageTrello})
        `, 'inline': false
        },
        {
          'name': 'Discord Stats', 'value': stripIndents`
          ${this.client.shard ? `Shards: **${this.client.shard.count}**\n` : ''}Guilds: **${totalGuilds}**
          Channels: **${totalChannels}**
          Users: **${totalUsers}**
        `, 'inline': false
        },
        {
          'name': 'Special Thanks to the Following:',
          'value': contributorsList,
          'inline': false
        }
        /* eslint-enable object-property-newline */
      ],
      color: 0x7289DA
    })
  }
}
