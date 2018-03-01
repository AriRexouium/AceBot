module.exports = (client, guild) => {
  if (client.sqlReady === true) {
    // Global Unavailable (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildUnavailable' })
    // Guild Unavailable (persistent)
    client.temp.sqlData.push({ location: guild.id, type: 'guildUnavailable' })
  }
}
