/**
 * Generates color for an embed.
 * @param {any} client The CommandoClient.
 * @param {any} message The message that is from a guild that you want to generate color for.
 * @return {number}
 */
module.exports = function getClientColor (client, message) {
  if (typeof message === 'object' && message.guild) {
    if (message.guild.me.displayHexColor === '#000000') {
      return 0x7289DA
    } else {
      return Number(message.guild.me.displayHexColor.replace('#', '0x'))
    }
  } else {
    return 0x7289DA
  }
}
