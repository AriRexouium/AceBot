module.exports = (client, provider) => {
  client.log.info(
    `Initialized ${client.provider.constructor.name}!`,
    `${client.provider.constructor.name} Initializer`,
    'bgGreen'
  )
}
