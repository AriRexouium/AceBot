module.exports = (client, provider) => {
  client.log(
    'success',
    `Initialized ${client.provider.constructor.name}!`,
    'Initializer',
    client.provider.constructor.name
  )
}
