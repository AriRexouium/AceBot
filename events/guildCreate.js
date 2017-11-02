const { stripIndents } = require('common-tags')

module.exports = (client, guild) => {
  client.log.info(stripIndents`
    Guild: ${guild.name} (${guild.id})}
    Owner: ${guild.owner.user.tag} (${guild.owner.user.id})
    Members: ${guild.memberCount} total | ${guild.members.filter(r => r.status !== 'offline').length} online | ${guild.members.filter(r => r.status === 'offline').length} offline
  `, 'guildCreate')
}
