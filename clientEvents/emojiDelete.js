module.exports = (client, emoji) => {
  if (client.sqlReady) {
    // Global Emoji Creations (persistent)
    client.provider.set('global', 'emojiDelete', client.provider.get('global', 'emojiDelete', 0) + 1)
    // Guild Emoji Creations (persistent)
    client.provider.set(emoji.guild.id, 'emojiDelete', client.provider.get(emoji.guild.id, 'emojiDelete', 0) + 1)
  }
}
