module.exports = (client) => {
  if (client.shard !== null) {
    return client.shard.id
  } else {
    return false
  }
}
