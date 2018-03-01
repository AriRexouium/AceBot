/*
  I'm not entirely sure how useful this would be since I think it's only for using a user account.
*/

module.exports = (client, user, oldNote, newNote) => {
  if (client.sqlReady === true) {
    // Global User Note Update (persistent)
    client.provider.set('global', 'userNoteUpdate', client.provider.get('global', 'userNoteUpdate', 0) + 1)
    // User Note Update (persistent)
    client.provider.set(user.id, 'userNoteUpdate', client.provider.get(user.id, 'userNoteUpdate', 0) + 1)
  }
}
