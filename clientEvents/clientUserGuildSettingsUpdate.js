/*
  I'm not entirely sure how useful this would be since I think it's only for using a user account.
*/

module.exports = (client, clientUserGuildSettings) => {
  if (client.sqlReady === true) {
    // Global Client User Guild Setting Updates (persistent)
    client.provider.set('global', 'clientUserGuildSettingsUpdate', client.provider.get('global', 'clientUserGuildSettingsUpdate', 0) + 1)
  }
}
