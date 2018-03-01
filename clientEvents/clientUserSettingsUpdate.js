/*
  I'm not entirely sure how useful this would be since I think it's only for using a user account.
*/

module.exports = (client, clientUserSettings) => {
  if (client.sqlReady === true) {
    // Global Client User Settings Update (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'clientUserSettingsUpdate' })
  }
}
