module.exports = (client, info) => {
  if (client.sqlReady === true) {
  // Global Debug Messages (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'debug' })
  }
}
