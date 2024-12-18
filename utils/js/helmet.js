import helmet from "helmet";
import fs from "fs";
import path from "path";

export default function setupHelmet(app, sitesFilePath) {
  let additionalConnectSrc = [];
  try {
    const data = fs.readFileSync(sitesFilePath, "utf8");
    const sites = JSON.parse(data);
    additionalConnectSrc = sites.map((site) => site.url);
  } catch (err) {
    console.error("Error al leer o parsear el archivo JSON:", err);
  }

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", "https://static.cloudflareinsights.com/"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com/"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://i.ytimg.com"],
        connectSrc: [
          "'self'",
          "https://api.rss2json.com",
          "https://alexdevuwu.com",
          "https://api.lanyard.rest",
          ...additionalConnectSrc,
        ],
        fontSrc: ["'self'"],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://www.twitch.tv/",
          "https://player.twitch.tv/",
          "https://kick.com/",
          "https://player.kick.com/",
        ],
      },
    })
  );

  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: "deny" }));
  app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }));
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
}
