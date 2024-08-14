import fetch from 'node-fetch';
import fs from 'fs';
import { WebhookClient } from 'discord.js';

const API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const API_KEY = process.env.LIGHTHOUSE_API_KEY;
const URL_TO_ANALYZE = 'https://alexdevuwu.com/';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const webhook = new WebhookClient({ url: DISCORD_WEBHOOK_URL });

const fetchAndSaveScores = async (url, key, strategy) => {
  try {
    const requestUrl = `${API_URL}?url=${encodeURIComponent(url)}&fields=lighthouseResult/categories/*/score&prettyPrint=false&strategy=${strategy}&category=performance&category=best-practices&category=accessibility&category=seo&key=${key}`;
    
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PageSpeed Insights data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const categories = data.lighthouseResult.categories;
    const scores = {
      performance: categories.performance ? Math.round(categories.performance.score * 100) : null,
      accessibility: categories.accessibility ? Math.round(categories.accessibility.score * 100) : null,
      'best-practices': categories['best-practices'] ? Math.round(categories['best-practices'].score * 100) : null,
      seo: categories.seo ? Math.round(categories.seo.score * 100) : null,
    };

    return scores;
  } catch (error) {
    console.error(`Error fetching data for ${strategy}:`, error);
    return null;
  }
};

const sendResultsToWebhook = async (strategy, scores) => {
  try {
    const embed = {
      title: `PageSpeed Insights - ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}`,
      fields: [
        { name: 'Performance', value: scores.performance !== null ? scores.performance + ' / 100' : 'N/A', inline: false },
        { name: 'Accessibility', value: scores.accessibility !== null ? scores.accessibility + ' / 100' : 'N/A', inline: false },
        { name: 'Best Practices', value: scores['best-practices'] !== null ? scores['best-practices'] + ' / 100' : 'N/A', inline: false },
        { name: 'SEO', value: scores.seo !== null ? scores.seo + ' / 100' : 'N/A', inline: false },
      ],
      color: 0x0099ff,
    };

    await webhook.send({ embeds: [embed] });
    console.log(`Scores sent to ${strategy} webhook successfully!`);
  } catch (error) {
    console.error(`Error sending ${strategy} scores to webhook:`, error);
  }
};

const main = async () => {
  try {
    const desktopScores = await fetchAndSaveScores(URL_TO_ANALYZE, API_KEY, 'desktop');
    const mobileScores = await fetchAndSaveScores(URL_TO_ANALYZE, API_KEY, 'mobile');
    
    const results = {
      mobile: mobileScores,
      desktop: desktopScores,
    };
    
    fs.writeFileSync('result.json', JSON.stringify(results, null, 2));
    console.log('Scores saved to result.json successfully!');
    
    await sendResultsToWebhook('desktop', desktopScores);
    await sendResultsToWebhook('mobile', mobileScores);
    
  } catch (error) {
    console.error('Error in main function:', error);
  }
};

main();
