module.exports = (client, oldGuild, newGuild) => {
  if (client.sqlReady === true) {
    // Global Guild Updates (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildUpdate' })
    // Guild Updates (persistent)
    client.temp.sqlData.push({ location: oldGuild.id, type: 'guildUpdate' })
  }
}
