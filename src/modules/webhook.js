/**
 * Send message through config webhook.
 * @param {any} client The CommandoClient.
 * @param {string} text The content to send to the webhook.
 */
module.exports = function webhook (client, text) {
  return new Promise((resolve, reject) => {
    var { WebhookClient } = require('discord.js')
    new WebhookClient(client.config.webhook.webhookID, client.config.webhook.webhookToken)
      .send(text)
      .then((message, error) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(message)
        }
      })
  })
}
