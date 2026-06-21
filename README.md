# Portfolio

Personal developer portfolio and dashboard. Frontend built with Vue 3 + Tailwind CSS v4, backend with ASP.NET Core (C#).

---

## Design Conventions

The UI follows a **terminal / code-editor aesthetic**. Every card looks like an open file in an editor: it has a Linux-style titlebar with a file path, colored window buttons, and content that reads like source code.

### File extension rules (titlebar paths)

The extension in the titlebar path signals what kind of card it is:

| Extension | When to use | Example path |
|-----------|-------------|--------------|
| `.md`     | Static info / content cards — no logic, just data | `~/portfolio/developer.md` |
| `.js`     | Frontend-only logic — no C# backend involved | `~/contact/email.js` |
| `.cs`     | Requires the C# backend (API calls, auth, form submission) | `~/contact/form.cs` |

### Naming conventions inside cards

Code shown in the UI must match the syntax of the file's language.

**`.js` files — JavaScript (camelCase methods)**
```
GitHub.explore()
Contact.sendEmail()
Contact.sendMessage()
```

**`.cs` files — C# (PascalCase methods and classes)**
```
System.Authenticate()
Session.Logout()
Discord.Login()
Contact.SendRequest()
Contact.SendData()
```

**`.md` files** — no method calls, just content.

### Variable declarations

Follow the language of the file:

| File type | Syntax | Example |
|-----------|--------|---------|
| `.js` | `const name =` | `const name =` |
| `.cs` | `string name =` | `string name =` |

### Code-style UI elements

- **Stat values** render as string literals: `"3+ years";` — green quotes (`syntax-string`), white value, dark semicolon (`syntax-semicolon`).
- **Form placeholders** use quoted strings: `"Your name here"` (defined in locale files).
- **Section headings** use the comment prefix: `// ` + gradient title text.
- **Semicolons** are always in `syntax-semicolon` color (dark muted) so they don't compete with the value.

---

## CSS Design Tokens

Defined in `frontend/src/assets/main.css` under `:root`. Use these instead of hardcoded values when building new components.

```css
/* Surfaces — ordered dark → light */
--surface-0   background base (slate-950)
--surface-1   page background (slate-900)
--surface-2   card background
--surface-3   elevated elements, titlebars

/* Borders */
--border-subtle   faint card borders
--border-default  standard borders, scrollbar track

/* Accent */
--accent            blue-500  (#3b82f6)
--accent-dim        blue-400  (#60a5fa)  — use for icons and hover text
--accent-secondary  cyan-500  (#06b6d4)  — gradients end color
```

### Syntax highlight classes

| Class | Color | Used for |
|-------|-------|----------|
| `.syntax-keyword` | blue-400 | keywords |
| `.syntax-string` | emerald-500 | string values, quotes |
| `.syntax-function` | amber-500 | function names |
| `.syntax-variable` | pink-500 | variables |
| `.syntax-comment` | muted blue-gray | `//` comments, subtitles |
| `.syntax-type` | muted blue-gray | type annotations (`: string`) |
| `.syntax-semicolon` | dark muted | `;` terminators |

---

## Animations & Transitions

### Page transitions

Views transition through Vue's built-in `<Transition>` wrapping `<router-view>` in `frontend/src/App.vue`:

```vue
<router-view v-slot="{ Component }">
  <Transition name="page" mode="out-in" appear>
    <component :is="Component" :key="viewKey" />
  </Transition>
</router-view>
```

The `.page-*` classes live in `frontend/src/assets/main.css`. The motion is a **fade + subtle `translateY` rise** at `0.3s` with easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — the same timing/easing as `.card-hover`, so navigation feels native to the rest of the UI.

- `mode="out-in"` — the leaving view fully animates out before the next animates in.
- `appear` — runs the entrance animation on first load too. For this to fire, `frontend/src/main.js` awaits `router.isReady()` before mounting (otherwise the first render is empty and `appear` is skipped).
- A `prefers-reduced-motion` media query drops the movement and shortens the fade for accessibility.

The base dark background (`--surface-0`) is set on `html, body` both inline in `frontend/index.html` (flash-proof, before any CSS/JS loads) and in `main.css`. Without it, the delayed mount shows a white flash and the entrance fade plays over white instead of the dark theme.

### bfcache / `pageshow` handling

Login, logout, and the GitHub link are **full-page navigations** (`window.location.href` / form POST / same-tab `<a href>`), and auth state is **in-memory Pinia** (`frontend/src/stores/auth.js`, not persisted to storage). When the user presses **Back**, the browser may restore the SPA from the back/forward cache (bfcache): the DOM is served frozen, `onMounted` does **not** re-fire, and auth state is stale.

`App.vue` handles this by listening for `pageshow` and, on `event.persisted`, re-running `authStore.checkAuth()` and remounting the active view (via a bumped `:key`). The remount refreshes the view's data and replays the entrance transition.

> ⚠️ Do not remove the `pageshow` handler — without it, pressing Back after login/logout shows stale auth (e.g. logged-out UI after a successful login).

### Motion utilities

Other reusable motion already in the theme (`frontend/src/assets/main.css`):

| Class | Effect |
|-------|--------|
| `.card-hover` | Lift (`translateY(-2px)`) + glow shadow on hover |
| `.animate-float` | Gentle vertical float (`float` keyframe, 6s loop) |
| `.tech-badge` | Scale up (`1.05`) on hover |

---

## Project Structure

```
/
├── backend/          ASP.NET Core API (C#)
└── frontend/         Vue 3 + Tailwind CSS v4
    ├── src/
    │   ├── App.vue            root: header + transitioned <router-view>, bfcache handling
    │   ├── assets/
    │   │   ├── main.css        global styles + design tokens + page transitions
    │   │   └── js/             client-side logic (discord, projects, contact)
    │   ├── components/
    │   │   └── Header.vue
    │   ├── router/            route definitions (home, login, dashboard)
    │   ├── stores/            Pinia stores (auth, lang)
    │   ├── views/
    │   │   ├── HomeView.vue       main page (about, projects, contact)
    │   │   ├── LoginView.vue      Discord OAuth
    │   │   └── DashboardView.vue  authenticated dashboard
    │   └── locales/            i18n strings (en / es)
    └── README.md
```
