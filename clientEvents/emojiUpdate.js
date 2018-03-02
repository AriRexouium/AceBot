module.exports = (client, oldEmoji, newEmoji) => {
  // Global Emoji Updates (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'emojiUpdate' })
  // Guild Emoji Updates (persistent)
  client.temp.sqlData.push({ location: oldEmoji.guild.id, type: 'emojiUpdate' })
}
