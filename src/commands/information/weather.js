const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const weather = require('weather-js')

module.exports = class WeatherCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'weather',
      memberName: 'weather',
      group: 'information',
      description: 'View the weather of a location.',
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'location',
          prompt: 'What location would you like to lookup?',
          type: 'string'
        },
        {
          key: 'degree',
          prompt: 'Please choose a degree. (IE: `F` || `C`)',
          type: 'string',
          parse: value => value.toLowerCase(),
          validate: value => ['f', 'c'].includes(value)
        }
      ]
    })
  }

  run (message, args) {
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }

    weather.find({ search: args.location, degreeType: args.degree }, (error, result) => {
      if (error) return message.say(error.message)
      if (result.length === 0) return message.reply('no location matched those search results.')
      result = result[0]
      var embed = {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        title: `${result.location.name} (${result.location.long}, ${result.location.lat})`,
        fields: [],
        color: clientColor
      }
      embed.fields.push({
        name: `Current - (${result.current.skytext})`,
        value: stripIndents`
          **Temp:** ${result.current.temperature}°${result.location.degreetype} *(feels like ${result.current.feelslike}°${result.location.degreetype})*
          **Humidity:** ${result.current.humidity}%
          **Wind:** ${result.current.winddisplay}
        `,
        inline: false
      })
      result.forecast.forEach(forecast => {
        embed.fields.push({
          name: `${forecast.day} - (${forecast.skytextday})`,
          value: stripIndents`
            **High:** ${forecast.high}°${result.location.degreetype}
            **Low:** ${forecast.low}°${result.location.degreetype}
            ${forecast.precip ? `**Precip:** ${forecast.precip}%` : ''}
          `,
          inline: true
        })
      })
      message.embed(embed)
    })
  }
}
