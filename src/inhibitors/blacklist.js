/**
 * Blocks users that are in the blacklist.
 * @param {any} client The CommandoClient.
 * @param {any} message The command sent by the user.
 * @return {string|boolean}
 */
module.exports = function blacklist (client, message) {
  const blacklist = client.provider.get('global', 'userBlacklist', [])
  if (!blacklist.includes(message.author.id)) return false
  message.reply('you are blacklisted.')
  return 'blacklist'
}
