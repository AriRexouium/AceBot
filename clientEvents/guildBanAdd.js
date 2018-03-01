module.exports = (client, guild, user) => {
  if (client.sqlReady === true) {
    // Global Ban Additions (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildBanAdd' })
    // User Ban Additions (persistent)
    client.temp.sqlData.push({ location: user.id, type: 'guildBanAdd' })
    // Guild Ban Additions (persistent)
    client.temp.sqlData.push({ location: guild.id, type: 'guildBanAdd' })
  }
}
