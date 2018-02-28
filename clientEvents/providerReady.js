module.exports = (client, provider) => {
  client.log.info(`Initialized SQLite Provider!`, 'SQLite Initializer')
  client.sqlReady = true
}
