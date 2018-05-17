/**
 * Blocks all users when a lockdown is active.
 * @param {any} client The CommandoClient.
 * @param {any} message The command sent by the user.
 * @return {string|boolean}
 */
module.exports = function protectedGroups (client, message) {
  if (client.options.owner.includes(message.author.id)) return false
  if (client.config.protectedGroups[message.command.group.id] === undefined) return false
  var staff = client.provider.get('global', 'staff', {})
  if (staff[message.author.id] && staff[message.author.id] >= client.config.protectedGroups[message.command.group.id]) {
    return false
  } else {
    return 'permission'
  }
}
