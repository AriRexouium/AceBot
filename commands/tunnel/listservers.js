const { Command } = require('discord.js-commando')
const { oneLineTrim } = require('common-tags')
const columnify = require('columnify')

module.exports = class ListServers extends Command {
  constructor (client) {
    super(client, {
      name: 'listservers',
      memberName: 'listservers',
      group: 'tunnel',
      description: 'List the servers the bot is in.',
      ownerOnly: true
    })
  }

  run (message, args) {
    var guilds = this.client.guilds.array()
    var columnifyGuilds = []
    guilds.forEach(guild => {
      var members = oneLineTrim`
        ${guild.members.filter(member => member.user.bot === false).size} USR/
        ${guild.members.filter(member => member.user.bot === true).size} BOT/
        ${guild.members.size} TOT
      `
      columnifyGuilds.push({
        name: guild.name,
        id: guild.id,
        members: members,
        owner: guild.owner.user.tag
      })
    })
    message.say({
      content: columnify(columnifyGuilds, {
        columnSplitter: ' │ '
      }),
      split: true,
      code: 'css'
    })
  }
}
