/**
 * Gets a file name from a path.
 * @param {any} client The CommandoClient.
 * @param {string} dir File path to get the name of.
 * @return {string} The name of the file.
 */
module.exports = function getFileName (client, dir) {
  return dir.split(/(\\|\/)/g).pop().split('.')[0]
}
