module.exports = (client, emoji) => {
  if (client.sqlReady === true) {
    // Global Emoji Creations (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'emojiDelete' })
    // Guild Emoji Creations (persistent)
    client.temp.sqlData.push({ location: emoji.guild.id, type: 'emojiDelete' })
  }
}
