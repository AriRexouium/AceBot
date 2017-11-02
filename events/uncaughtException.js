module.exports = (client, error) => {
  client.log.error(`Caught Exception: ${error.message}`)
}
