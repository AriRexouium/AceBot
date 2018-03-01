/*
  I'm not entirely sure how useful this would be since I think it's only for using a user account.
*/

module.exports = (client, user, oldNote, newNote) => {
  if (client.sqlReady === true) {
    // Global User Note Update (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'userNoteUpdate' })
    // User Note Update (persistent)
    client.temp.sqlData.push({ location: user.id, type: 'userNoteUpdate' })
  }
}
