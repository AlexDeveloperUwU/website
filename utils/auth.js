import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import session from "express-session";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "env", ".env");
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
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const setupAuth = (app) => {
  app.use(
    session({
      secret: process.env.sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

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
