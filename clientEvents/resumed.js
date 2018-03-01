module.exports = (client, replayed) => {
  if (client.sqlReady === true) {
    // Global Websocket Resume (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'resumed' })
  }
}
