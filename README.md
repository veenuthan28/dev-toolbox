# ⚡ Dev Toolbox

A small collection of browser-based developer tools. Everything runs client-side — no data leaves your browser.

**Tools:** Box Shadow Generator · JSON Formatter · Regex Tester · Color Converter

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:4321`.

## Build

```bash
npm run build
```

Output lands in `dist/` — deploy anywhere (Vercel, Netlify, GitHub Pages, etc.).

## Stack

- [Astro](https://astro.build) + [React](https://react.dev)
- TypeScript
- Vanilla CSS with custom properties

## Project Structure

```
src/
├── components/
│   ├── App.tsx                # Tab navigation + layout
│   ├── Header.tsx             # Logo + theme toggle
│   └── tools/
│       ├── BoxShadowGenerator.tsx
│       ├── JsonFormatter.tsx
│       ├── RegexTester.tsx
│       └── ColorConverter.tsx
├── styles/global.css          # Design tokens
└── utils/                     # Clipboard, color, escape helpers
```

## License

[MIT](LICENSE)

---

[veenu.ch](https://veenu.ch)
