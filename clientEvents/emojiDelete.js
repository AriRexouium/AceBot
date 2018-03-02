module.exports = (client, emoji) => {
  // Global Emoji Creations (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'emojiDelete' })
  // Guild Emoji Creations (persistent)
  client.temp.sqlData.push({ location: emoji.guild.id, type: 'emojiDelete' })
}
