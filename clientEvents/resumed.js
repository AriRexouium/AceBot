module.exports = (client, replayed) => {
  // Global Websocket Resume (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'resumed' })
}
