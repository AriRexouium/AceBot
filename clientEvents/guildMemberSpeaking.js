/*
  I'm not sure how well this will work because I think the bot has to be in a voice channel.
*/
module.exports = (client, member, speaking) => {
  if (client.sqlReady === true) {
    // Global Guild Member Speaking (persistent)
    client.provider.set('global', 'guildMemberSpeaking', client.provider.get('global', 'guildMemberSpeaking', 0) + 1)
    // User Guild Member Speaking (persistent)
    client.provider.set(member.user.id, 'guildMemberSpeaking', client.provider.get(member.user.id, 'guildMemberSpeaking', 0) + 1)
    // Guild Member Speaking (persistent)
    client.provider.set(member.guild.id, 'guildMemberSpeaking', client.provider.get(member.guild.id, 'guildMemberSpeaking', 0) + 1)
  }
}
