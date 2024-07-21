import { WebhookClient, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export function formSend(data) {
  const webhook = new WebhookClient({ url: process.env.formWebhook });
  const { name, email, message } = data;
  const description = `**Nombre o nick:** ${name}\n\n**Email:** ${email}\n\n**Mensaje:** ${message}`;

  const embed = new EmbedBuilder()
    .setTitle("<:aclipboard:1263477244186333195> Nuevo mensaje del formulario!")
    .setDescription(description)
    .setColor("#11ab9c");

  webhook.send({ embeds: [embed] });
}
