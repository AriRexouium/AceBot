module.exports = (client, info) => {
  if (client.sqlReady === true) {
  // Global Debug Messages (persistent)
    client.provider.set('global', 'debug', client.provider.get('global', 'debug', 0) + 1)
  }
}
