module.exports = (client, oldEmoji, newEmoji) => {
  if (client.sqlReady === true) {
    // Global Emoji Updates (persistent)
    client.provider.set('global', 'emojiUpdate', client.provider.get('global', 'emojiUpdate', 0) + 1)
    // Guild Emoji Updates (persistent)
    client.provider.set(oldEmoji.guild.id, 'emojiUpdate', client.provider.get(oldEmoji.guild.id, 'emojiUpdate', 0) + 1)
  }
}
