const { Command } = require('discord.js-commando')
const getAge = require('get-age')
const moment = require('moment-timezone')

module.exports = class EmojiCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'profile',
      memberName: 'profile',
      group: 'profile',
      description: 'Get the time of a user.',
      details: 'View another user\'s time and timezone.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to lookup?',
          type: 'member'
        }
      ],
      guildOnly: true
    })
  }

  run (message, args) {
    /* Star Declaring Variables */
    var embedFields = []
    var user = args.user.user
    var userInfo = {}
    var userValues = ['about', 'age', 'email', 'gender', 'job', 'firstname', 'lastname', 'timezone', 'website']
    userValues.forEach(value => {
      userInfo[value] = this.client.provider.get(user.id, value, '')
    })
    var userColor = (args.user).displayHexColor
    if (userColor === '#000000') { userColor = 0x7289DA } else { userColor = Number(userColor.replace('#', '0x')) }
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
    if (userInfo.age) {
      embedFields.push({
        name: 'Age',
        value: getAge(userInfo.age),
        inline: true
      })
    }
    // Gender
    if (userInfo.gender) {
      embedFields.push({
        name: 'Gender',
        value: userInfo.gender,
        inline: true
      })
    }
    // Website
    if (userInfo.website) {
      embedFields.push({
        name: 'Website',
        value: userInfo.website,
        inline: true
      })
    }
    // Email
    if (userInfo.email) {
      embedFields.push({
        name: 'Email',
        value: userInfo.email,
        inline: true
      })
    }
    // Profession
    if (userInfo.job) {
      embedFields.push({
        name: 'Profession',
        value: userInfo.job,
        inline: true
      })
    }
    // About
    if (userInfo.about) {
      embedFields.push({
        name: 'About',
        value: userInfo.about,
        inline: true
      })
    }
    /* Stop Fancy Embed Fields */

    message.embed({
      author: { name: `${user.username}${userInfo.fullName}` },
      footer: { text: userInfo.timezone !== '' ? `${userInfo.timezone} • ${moment.tz(userInfo.timezone).format('llll')}` : '' },
      thumbnail: { url: user.avatarURL() !== null ? user.avatarURL() : 'http://cdn.discordapp.com/embed/avatars/0.png' },
      fields: embedFields,
      color: userColor
    })
  }
}
