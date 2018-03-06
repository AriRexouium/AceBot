module.exports = async (client, message) => {
  if (message === 'shutdown') {
    await client.log.info(`Shuting down!${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`, 'Client')
    await client.provider.destroy()
    await client.destroy()
    await process.exit(0)
  }
}
