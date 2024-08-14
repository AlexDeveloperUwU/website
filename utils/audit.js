import fetch from "node-fetch";
import { WebhookClient, EmbedBuilder } from "discord.js";

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1273321658148589660/vNk13mjIiPdzMoHJBKvQ0N1Lx9Hv002EDsmvb6VNYSqPPqnk1xzeRIMWDWwbD68-kcT7";
const API_KEY = "AIzaSyDGPzB5LGUJGfNKkNc0BpTSWspGCb-Fo6c";

if (!DISCORD_WEBHOOK_URL || !API_KEY) {
  console.error("DISCORD_WEBHOOK_URL or API_KEY is not defined!");
  process.exit(1);
}

const webhookClient = new WebhookClient({ url: DISCORD_WEBHOOK_URL });

const getCategoryScores = async (url, strategy) => {
  try {
    const apiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&key=${API_KEY}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PageSpeed Insights data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.lighthouseResult || !data.lighthouseResult.categories) {
      throw new Error(`Invalid data structure received for ${strategy}: ${JSON.stringify(data)}`);
    }

    const scores = {};
    const categories = ["performance", "accessibility", "best-practices", "seo"];
    categories.forEach((category) => {
      const categoryData = data.lighthouseResult.categories[category];
      if (categoryData) {
        scores[category] = categoryData.score * 100;
      } else {
        console.error(`Missing ${category} category in result data for ${strategy}`);
        scores[category] = null;
      }
    });

    return scores;
  } catch (error) {
    console.error(`Error getting PageSpeed Insights scores for ${strategy}:`, error);
    return null;
  }
};

const createEmbed = (strategy, scores) => {
  if (!scores || Object.values(scores).some((score) => score === null)) {
    console.error(`Invalid score data for ${strategy}`);
    return null;
  }

  return new EmbedBuilder()
    .setTitle(`PageSpeed Insights - ${strategy}`)
    .setDescription(`Performance scores for ${strategy} strategy`)
    .addFields([
      {
        name: "Performance Score",
        value: scores["performance"]?.toFixed(2) || "N/A",
        inline: false,
      },
      {
        name: "Accessibility Score",
        value: scores["accessibility"]?.toFixed(2) || "N/A",
        inline: false,
      },
      {
        name: "Best Practices Score",
        value: scores["best-practices"]?.toFixed(2) || "N/A",
        inline: false,
      },
      { name: "SEO Score", value: scores["seo"]?.toFixed(2) || "N/A", inline: false },
    ])
    .setColor(strategy === "mobile" ? 0x00ff00 : 0x0000ff);
};

const sendToDiscord = async (embed) => {
  try {
    await webhookClient.send({ embeds: [embed] });
    console.log("Report sent to Discord successfully!");
  } catch (error) {
    console.error("Error sending report to Discord:", error);
  }
};

const main = async () => {
  const url = "https://alexdevuwu.com";
  const strategies = ["mobile", "desktop"];

  for (const strategy of strategies) {
    const scores = await getCategoryScores(url, strategy);
    const embed = createEmbed(strategy, scores);
    if (embed) await sendToDiscord(embed);
  }
};

main();
