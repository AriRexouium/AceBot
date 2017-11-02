module.exports = (client, oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    client.log.info(`${oldUser.tag} changed name to ${newUser.tag}!`, 'userUpdate')
  }
}
