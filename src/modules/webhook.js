/**
 * Send message through config webhook.
 * @param {any} client The Commando client.
 * @param {string} text The content to send to the webhook.
 */
module.exports = function webhook (client, text) {
  var Discord = require('discord.js')
  new Discord.WebhookClient(
    client.config.webhook.webhookID,
    client.config.webhook.webhookToken
  ).send(text)
}
