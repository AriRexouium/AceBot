const oneLine = require('common-tags').oneLine

module.exports = (client, guild, prefix) => {
  client.log.info(oneLine`
    Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
  `)
}
