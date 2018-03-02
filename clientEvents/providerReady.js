module.exports = (client, provider) => {
  client.log.info(`Initialized SQLite Provider!`, 'SQLite Initializer')
  setInterval(() => {
    var tempData = client.temp.sqlData
    client.temp.sqlData = []
    var eventsProcessed = 0
    tempData.forEach(event => {
      client.provider.set(event.location, event.type, client.provider.get(event.location, event.type, 0) + 1)
      eventsProcessed++
      if (eventsProcessed === tempData.length) {
        sqlUpdateMessage(client, tempData.length)
      }
    })
  }, 1800000)
}
let sqlUpdateMessage = (client, eventCount) => {
  client.log.debug(`Updated database with ${eventCount} events.`, 'EVENT LOGGER')
}
