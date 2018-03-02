/*
  I'm not sure how well this will work because I think the bot has to be in a voice channel.
*/
module.exports = (client, member, speaking) => {
  // Global Guild Member Speaking (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'guildMemberSpeaking' })
  // User Guild Member Speaking (persistent)
  client.temp.sqlData.push({ location: member.user.id, type: 'guildMemberSpeaking' })
  // Guild Member Speaking (persistent)
  client.temp.sqlData.push({ location: member.guild.id, type: 'guildMemberSpeaking' })
}
