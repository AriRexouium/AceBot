module.exports = (client, info) => {
  // Global Debug Messages (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'debug' })
}
