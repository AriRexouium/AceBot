module.exports = async (client, message) => {
  if (message === 'shutdown') {
    client.log.info(`Shuting down!${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`, 'Client')
    var tempData = await client.temp.sqlData
    client.temp.sqlData = []
    var eventsProcessed = 0
    await tempData.forEach(event => {
      client.provider.set(event.location, event.type, client.provider.get(event.location, event.type, 0) + 1)
      eventsProcessed++
      if (eventsProcessed === tempData.length) {
        client.log.debug(`Updated database with ${tempData.length} events.`, 'EVENT LOGGER')
      }
    })
    await client.provider.destroy()
    await client.destroy()
    await process.exit(0)
  }
}
