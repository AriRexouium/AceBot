const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class SetJobCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setjob',
      memberName: 'setjob',
      group: 'profile',
      description: 'Set your job name.',
      details: 'Set your job name on your profile.',
      aliases: [
        'setprofession',
        'setj'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'job',
          prompt: 'Please enter your job name. (Type "none" to leave blank.)',
          type: 'string',
          validate: value => {
            if (value.length > 64 || value.length < 2) {
              return 'Must be between 2 and 64 characters in length. (Type "none" to leave blank.)'
            } else {
              return true
            }
          }
        }
      ]
    })
  }

  run (message, args) {
    this.client.provider.set(message.author.id, 'job', args.job === 'none' ? '' : args.job)
    message.reply(`successfully set your job to \`${escapeMarkdown(args.job)}\`!`)
  }
}
