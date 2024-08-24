import { WebhookClient, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "env", ".env");
dotenv.config({ path: envPath });

export function formSend(data) {
  const webhook = new WebhookClient({
    url: process.env.formWebhookUrl,
  });

  const { name, email, message } = data;
  const description = `**Nombre o nick:** ${name}\n\n**Email:** ${email}\n\n**Mensaje:** ${message}`;

  const embed = new EmbedBuilder()
    .setTitle("<:aclipboard:1263477244186333195> Nuevo mensaje del formulario!")
    .setDescription(description)
    .setColor("#11ab9c");

  webhook.send({ embeds: [embed] });
}

export function apiAlert(type, data) {
  let title;
  let description;
  let color;

  switch (type) {
    case "eventAdded":
      title = "Evento añadido";
      description = `Se añadió el evento con ID ${data.id} con fecha ${data.date} y hora ${data.time}.`;
      color = "#98FB98";
      break;
    case "eventRemoved":
      title = "Evento eliminado";
      description = `Se eliminó el evento con ID ${data.id}.`;
      color = "#FFB6C1";
      break;
    case "linkAdded":
      title = "Enlace acortado";
      const shortUrl = `[${data.url.replace(/(^\w+:|^)\/\//, "")}](${data.url})`;
      description = `Se acortó el enlace con ID: ${data.id} y URL: ${shortUrl}.`;
      color = "#98FB98";
      break;
    case "linkEdited":
      title = "Enlace editado";
      const editedUrl = `[${data.url.replace(/(^\w+:|^)\/\//, "")}](${data.url})`;
      description = `Se editó el enlace con ID: ${data.id} y URL: ${editedUrl}.`;
      color = "#FFD700";
      break;
    case "linkRemoved":
      title = "Enlace eliminado";
      const removedUrl = `[${data.url.replace(/(^\w+:|^)\/\//, "")}](${data.url})`;
      description = `Se eliminó el enlace con ID: ${data.id} y URL: ${removedUrl}.`;
      color = "#FFB6C1";
      break;
    default:
      return; 
  }

  const webhook = new WebhookClient({
    url: process.env.logsWebhookUrl,
  });

  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);

  webhook.send({ embeds: [embed] });
}
