module.exports = (client, replayed) => {
  if (client.sqlReady === true) {
    // Global Websocket Resume (persistent)
    client.provider.set('global', 'resumed', client.provider.get('global', 'resumed', 0) + 1)
  }
}
