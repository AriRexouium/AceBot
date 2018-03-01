module.exports = (client, oldUser, newUser) => {
  if (client.sqlReady === true) {
    // Global Stop Typing Count (persistent)
    client.provider.set('global', 'userUpdate', client.provider.get('global', 'userUpdate', 0) + 1)
    // User Stop Typing Count (persistent)
    client.provider.set(oldUser.id, 'userUpdate', client.provider.get(oldUser.id, 'userUpdate', 0) + 1)
  }
}
