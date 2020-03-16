/**
 * Send message through config webhook.
 * @param {any} client The CommandoClient.
 * @param {string} text The content to send to the webhook.
 * @return {Promise<any>}
 */
module.exports = function webhook (client, text) {
  return new Promise((resolve, reject) => {
    var { WebhookClient } = require('discord.js')
    var hook = new WebhookClient(client.config.webhook.webhookID, client.config.webhook.webhookToken)
    try {
      var message = hook.send(text)
      resolve(message)
    } catch (error) {
      reject(error)
    }
  })
}
