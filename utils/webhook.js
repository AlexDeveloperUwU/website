import { WebhookClient, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export function formSend(data) {
  const webhook = new WebhookClient({ url: process.env.formWebhook });
  const { name, email, message } = data;
  const embed = new EmbedBuilder()
    .setTitle("<:aclipboard:1263477244186333195> Nuevo mensaje del formulario!")
    .addFields(
      { name: "Nombre", value: name, inline: false },
      { name: "Email", value: email, inline: false },
      { name: "Mensaje", value: message, inline: false }
    )
    .setTimestamp()
    .setColor("#11ab9c");

  webhook.send({ embeds: [embed] });
}
