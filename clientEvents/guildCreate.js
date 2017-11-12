const { stripIndents } = require('common-tags')

module.exports = (client, guild) => {
  client.log.info(stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${guild.owner.user.tag} (${guild.owner.user.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'guildCreate')
}
