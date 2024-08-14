import { WebhookClient, EmbedBuilder } from "discord.js";
import psi from "psi";

// Lee la URL del webhook desde las variables de entorno
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  console.error("DISCORD_WEBHOOK_URL is not defined!");
  process.exit(1);
}

// Configura el cliente de Webhook
const webhookClient = new WebhookClient({ url: DISCORD_WEBHOOK_URL });

// Función para ejecutar PSI y obtener los resultados
const runPSI = async (strategy) => {
  try {
    const { data } = await psi("https://alexdevuwu.com", {
      nokey: "true",
      strategy: strategy,
    });
    return data;
  } catch (error) {
    console.error(`Error running PSI for ${strategy}:`, error);
    return null;
  }
};

// Función para enviar un mensaje embed a Discord
const sendToDiscord = async (embed) => {
  try {
    await webhookClient.send({ embeds: [embed] });
    console.log("Report sent to Discord successfully!");
  } catch (error) {
    console.error("Error sending report to Discord:", error);
  }
};

// Función para crear un mensaje embed para Discord
const createEmbed = (strategy, result) => {
  if (!result) return null;

  return new EmbedBuilder()
    .setTitle(`PageSpeed Insights - ${strategy}`)
    .setDescription(`Results for ${strategy} strategy`)
    .addFields([
      {
        name: "Speed Score",
        value: (result.lighthouseResult.categories.performance.score * 100).toFixed(2) + "%",
        inline: true,
      },
      {
        name: "Accessibility",
        value: (result.lighthouseResult.categories.accessibility.score * 100).toFixed(2) + "%",
        inline: true,
      },
      {
        name: "Best Practices",
        value: (result.lighthouseResult.categories["best-practices"].score * 100).toFixed(2) + "%",
        inline: true,
      },
      {
        name: "SEO",
        value: (result.lighthouseResult.categories.seo.score * 100).toFixed(2) + "%",
        inline: true,
      },
      { name: "URL", value: result.id, inline: false },
    ])
    .setColor(strategy === "mobile" ? 0x00ff00 : 0x0000ff); // Verde para móvil, azul para escritorio
};

// Función principal
const main = async () => {
  try {
    // Ejecutar auditorías para móvil y escritorio
    const mobileResult = await runPSI("mobile");
    const desktopResult = await runPSI("desktop");

    // Crear embebidos para cada estrategia
    const mobileEmbed = createEmbed("Mobile", mobileResult);
    const desktopEmbed = createEmbed("Desktop", desktopResult);

    // Enviar informes a Discord si existen
    if (mobileEmbed) await sendToDiscord(mobileEmbed);
    if (desktopEmbed) await sendToDiscord(desktopEmbed);
  } catch (error) {
    console.error("Error in audit process:", error);
  }
};

// Ejecutar la función principal
main();
