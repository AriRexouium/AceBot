module.exports = (client, oldUser, newUser) => {
  if (client.sqlReady === true) {
    // Global Stop Typing Count (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'userUpdate' })
    // User Stop Typing Count (persistent)
    client.temp.sqlData.push({ location: oldUser.id, type: 'userUpdate' })
  }
}
