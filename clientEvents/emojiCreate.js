module.exports = (client, emoji) => {
  if (client.sqlReady === true) {
    // Global Channel Creations (persistent)
    client.provider.set('global', 'emojiDelete', client.provider.get('global', 'emojiDelete', 0) + 1)
    // Guild Channel Creations (persistent)
    client.provider.set(emoji.guild.id, 'emojiDelete', client.provider.get(emoji.guild.id, 'emojiDelete', 0) + 1)
  }
}
