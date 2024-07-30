import { WebhookClient, EmbedBuilder } from "discord.js";
import { getVariable } from "./envLoader";

export function formSend(data) {
  const webhook = new WebhookClient({
    url: getVariable("formWebhookUrl"),
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
      description = `Se ha añadido el evento con ID ${data.id} con fecha ${data.date} y hora ${data.time}.`;
      color = "#98FB98"; // PaleGreen
      break;
    case "eventRemoved":
      title = "Evento eliminado";
      description = `Se ha eliminado el evento con ID ${data.id}, que tenía fecha ${data.date} y hora ${data.time}.`;
      color = "#FFB6C1"; // LightPink
      break;
  }

  const webhook = new WebhookClient({
    url: getVariable("logsWebhookUrl"),
  });

  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);

  webhook.send({ embeds: [embed] });
}
