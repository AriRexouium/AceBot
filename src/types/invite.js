const { ArgumentType } = require('discord.js-commando')

class InviteType extends ArgumentType {
  constructor (client) {
    super(client, 'invite')
  }

  async validate (value) {
    try {
      return await this.client.fetchInvite(value)
    } catch (error) {
      return false
    }
  }

  parse (value) {
    return value
  }
}

module.exports = InviteType
