/**
 * Blocks all users when a lockdown is active.
 * @param {any} client The command client.
 * @param {any} message The command sent by the user.
 */
module.exports = function lockdown (client, message) {
  // Check in the user is an Owner.
  if (
    client.provider.get('global', 'developer', []).includes(message.author.id) ||
    client.provider.get('global', 'staff', []).includes(message.author.id) ||
    client.isOwner(message.author.id)
  ) return false
  // Get lockdown status and reason for a possible lockdown.
  const lockdown = client.provider.get('global', 'lockdown', false)
  const reasonTemp = client.provider.get('global', 'lockdownReason', false)
  var lockdownReason
  // Return `None Specified.` if no reason is given for the lockdown.
  if (reasonTemp === false) { lockdownReason = 'None Specified.' } else { lockdownReason = reasonTemp }
  // Return lockdown status.
  if (lockdown === false) {
    return false
  } else {
    message.reply(`sorry, but the bot is currently on lockdown.\n**Reason:** ${lockdownReason}`)
    return 'lockdown'
  }
}
