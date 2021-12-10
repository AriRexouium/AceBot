/**
 * Set, get or remove a user from a staff position on the bot.
 * @param {any} client The CommandoClient.
 * @param {string} query What to query.
 * @param {string} id The ID of the user.
 * @param {string} pos What position you want to set the user at.
 */
module.exports = function permLevel (client, query, id, pos) {
  if (!query) throw new Error('Value must be specified.')
  if (!id) throw new Error('Value must be specified.')
  if (!client.users.get(id)) throw new Error('Not a valid user ID.')
  var staff = client.provider.get('global', 'staff', {})

  switch (query) {
    case 'set':
      if (!pos) throw new Error('Value must be specified.')
      if (!['staff', 'developer'].includes(pos)) throw new Error('Not a valid position.')
      staff[id] = pos === 'staff' ? 1 : 2
      break
    case 'remove':
      delete staff[id]
      break
    case 'get':
      return !staff[id] ? 0 : staff[id]
    default:
      throw new TypeError('Invalid type specified.')
  }
  client.provider.set('global', 'staff', staff)
}
