module.exports = (client, guild, user) => {
  if (client.sqlReady === true) {
    // Global Ban Removals (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildBanRemove' })
    // User Ban Removals (persistent)
    client.temp.sqlData.push({ location: user.id, type: 'guildBanRemove' })
    // Guild Ban Removals (persistent)
    client.temp.sqlData.push({ location: guild.id, type: 'guildBanRemove' })
  }
}
