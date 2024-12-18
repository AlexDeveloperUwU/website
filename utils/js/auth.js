import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import session from "express-session";
import FileStore from "session-file-store";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const allowedUserIds = ["419176939497193472", "326957915099627530"];
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "env", ".env");
dotenv.config({ path: envPath });

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.discordClientId,
      clientSecret: process.env.discordClientSecret,
      callbackURL: process.env.discordCallbackUrl,
      scope: ["identify", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      if (allowedUserIds.includes(profile.id)) {
        return done(null, profile);
      } else {
        return done(null, false, { message: "Unauthorized" });
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const FileStoreSession = FileStore(session);

const setupAuth = (app) => {
  const sessionPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "sessions");

  app.use(
    session({
      secret: process.env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new FileStoreSession({
        path: sessionPath,
        ttl: 86400,
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Rutas de autenticación
  app.get("/auth/discord", passport.authenticate("discord"));

  app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/error?code=401",
    }),
    (req, res) => {
      res.redirect("/admin");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
};

export default setupAuth;
