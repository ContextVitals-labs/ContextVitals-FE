# Conventions

This document is the single source of truth for how we work in this
repository: commit messages, branch names, pull requests, and how
translated copy is organized. Everything here applies to every contributor
and every automated agent working in this repo.

> **Language rule:** commit messages, branch names, and PR titles/descriptions
> are always written in **English**, regardless of the language(s) the site
> content itself is in.

---

## 1. Commit message format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- **type** — required, one of the types below.
- **scope** — optional, the area of the site this commit touches
  (e.g. `hero`, `i18n`, `styles`, `docs`).
- **subject** — required, short summary in English.
- **body** — optional, explains *what* and *why* when the subject line
  isn't enough.
- **footer** — optional, used for `BREAKING CHANGE:` notes or issue
  references (e.g. `Closes #12`).

### Types

| Type       | Use for                                                          |
|------------|-------------------------------------------------------------------|
| `feat`     | New section/page/behavior                                         |
| `fix`      | A bug fix (broken layout, incorrect copy, dead link)               |
| `docs`     | Documentation only changes                                        |
| `style`    | Formatting only — no visual or behavior change                    |
| `refactor` | Restructuring markup/CSS/JS without changing what's rendered       |
| `perf`     | Performance improvement (image size, load time, etc.)              |
| `content`  | Copy/translation changes that aren't a new feature                 |
| `build`    | Tooling or deployment configuration changes                       |
| `ci`       | CI/CD configuration changes                                        |
| `chore`    | Everything else (assets, repo maintenance)                         |

### Subject rules

- Written in **English**, imperative mood ("add", not "added"/"adds").
- No period at the end.
- Lowercase after the type/scope prefix, unless a proper noun requires it.
- Keep it under ~72 characters.

### Examples

```text
feat(hero): add landing page hero section with product mockup
content(ko): translate privacy section
fix(nav): correct language switcher focus order
chore(assets): add resized logo and favicon variants
```

---

## 2. Branch naming

```text
<type>/<short-description>
```

Examples: `feat/pricing-section`, `fix/mobile-nav-overlap`,
`content/zh-translation`.

---

## 3. Pull requests

- PR titles follow the same format as commit subjects, written in English.
- PR descriptions state what changed and why, and note which language(s)
  were affected if the change touches copy.
- Squash-merge into `main` unless a reviewer requests otherwise.

---

## 4. Internationalization (i18n)

The site supports **English (`en`), Korean (`ko`), and Chinese (`zh`)**,
switched client-side (no separate URL per language in V1).

- All copy lives in `assets/i18n.js`, one flat-ish key per string, grouped
  by section (e.g. `hero.title`, `privacy.principle1`).
- **English is the source of truth.** Add a new string to `en` first, then
  fill in `ko` and `zh` in the same commit — never ship a key that's only
  translated in one language.
- Markup references copy via `data-i18n="section.key"`; never hardcode
  user-facing text directly in `index.html`.
- A commit that only changes translated strings (no new keys, no markup
  changes) uses the `content` type with a language scope, e.g.
  `content(zh): fix awkward phrasing in hero subheadline`.

---

## 5. Where conventions live

All convention documents live under `docs/`. Keep this file updated
whenever the team agrees on a new rule — don't let conventions live only in
chat history.
