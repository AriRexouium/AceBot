module.exports = (client, oldUser, newUser) => {
  // Global Stop Typing Count (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'userUpdate' })
  // User Stop Typing Count (persistent)
  client.temp.sqlData.push({ location: oldUser.id, type: 'userUpdate' })
}
