const { Command } = require('discord.js-commando')
const getAge = require('get-age')
const moment = require('moment-timezone')

module.exports = class ProfileCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'profile',
      memberName: 'profile',
      group: 'profile',
      description: 'View a user\'s profile.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to lookup?',
          type: 'member',
          default: ''
        }
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    var user
    if (args.user === '') {
      args.user = message.guild.members.get(message.author.id)
      user = args.user.user
    } else {
      user = args.user.user
    }
    /* Star Declaring Variables */
    var embedFields = []
    var userInfo = {}
    ;['about', 'age', 'color', 'email', 'gender', 'job', 'firstname', 'lastname', 'timezone', 'website']
      .forEach(value => { userInfo[value] = this.client.provider.get(user.id, value, '') })
    var userColor
    if (userInfo.color === 'auto') {
      if (args.user.displayHexColor === '#000000') {
        userColor = 0x7289da
      } else {
        userColor = Number(args.user.displayHexColor.replace('#', '0x'))
      }
    } else if (userInfo.color === 'none') {
      userColor = 0x4f545c
    } else {
      userColor = Number(`0x${userInfo.color}`)
    }
    /* Finish Declaring Variables */

    // Name Assignment
    if (userInfo.firstname || userInfo.lastname) {
      if (userInfo.firstname && userInfo.lastname) {
        userInfo.fullName = ` (${userInfo.firstname} ${userInfo.lastname})`
      } else if (userInfo.firstname) {
        userInfo.fullName = ` (${userInfo.firstname})`
      } else if (userInfo.lastname) {
        userInfo.fullName = ` (${userInfo.lastname})`
      }
    } else {
      userInfo.fullName = ''
    }

    /* Start Fancy Embed Fields */
    // Age
    if (userInfo.age) { embedFields.push({ name: 'Age', value: getAge(userInfo.age), inline: true }) }
    // Gender
    if (userInfo.gender) { embedFields.push({ name: 'Gender', value: userInfo.gender, inline: true }) }
    // Website
    if (userInfo.website) { embedFields.push({ name: 'Website', value: userInfo.website, inline: true }) }
    // Email
    if (userInfo.email) { embedFields.push({ name: 'Email', value: userInfo.email, inline: true }) }
    // Profession
    if (userInfo.job) { embedFields.push({ name: 'Profession', value: userInfo.job, inline: true }) }
    // About
    if (userInfo.about) { embedFields.push({ name: 'About', value: userInfo.about, inline: true }) }
    /* Stop Fancy Embed Fields */

    message.embed({
      author: { name: `${user.username}${userInfo.fullName}` },
      footer: { text: userInfo.timezone !== '' ? `${userInfo.timezone} • ${moment.tz(userInfo.timezone).format('llll')}` : '' },
      description: message.guild.name,
      thumbnail: { url: user.displayAvatarURL() },
      fields: embedFields,
      color: userColor
    })
  }
}
