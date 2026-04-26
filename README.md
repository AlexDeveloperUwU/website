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

## Project Structure

```
/
├── backend/          ASP.NET Core API (C#)
└── frontend/         Vue 3 + Tailwind CSS v4
    ├── src/
    │   ├── assets/
    │   │   ├── main.css        global styles + design tokens
    │   │   └── js/             client-side logic (discord, projects, contact)
    │   ├── components/
    │   │   └── Header.vue
    │   ├── views/
    │   │   ├── HomeView.vue    main page (about, projects, contact)
    │   │   └── LoginView.vue   Discord OAuth
    │   └── locales/            i18n strings (en / es)
    └── README.md
```
