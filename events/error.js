module.exports = (client, error) => {
  client.log.error(`\n${error.stack}`)
}
