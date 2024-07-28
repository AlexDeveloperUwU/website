import { WebhookClient, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "env", ".env");
dotenv.config({ path: envPath });

export function formSend(data, url) {
  const webhook = new WebhookClient({ url: url });
  console.log(process.env.formWebhook);
  const { name, email, message } = data;
  const description = `**Nombre o nick:** ${name}\n\n**Email:** ${email}\n\n**Mensaje:** ${message}`;

  const embed = new EmbedBuilder()
    .setTitle("<:aclipboard:1263477244186333195> Nuevo mensaje del formulario!")
    .setDescription(description)
    .setColor("#11ab9c");

  webhook.send({ embeds: [embed] });
}
