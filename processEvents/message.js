module.exports = (client, message) => {
  if (message === 'shutdown') {
    client.log.info('Restarting!', 'Restart')
    var tempData = client.temp.sqlData
    client.temp.sqlData = []
    var eventsProcessed = 0
    tempData.forEach(event => {
      client.provider.set(event.location, event.type, client.provider.get(event.location, event.type, 0) + 1)
      eventsProcessed++
      if (eventsProcessed === tempData.length) {
        client.log.debug(`Updated database with ${tempData.length} events.`, 'EVENT LOGGER')
      }
    })
    client.destroy()
    process.exit(0)
  }
}
