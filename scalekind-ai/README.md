# ScaleKind AI Website

Marketing website for ScaleKind AI — AI automation for NGOs and impact-driven organizations.

## Run locally

```bash
cd scalekind-ai
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

```bash
npm run build
npm start
```

Or deploy to Vercel:

```bash
vercel
```

## Customize before launch

1. **Calendly** — Update the booking button href in `src/app/page.tsx` with your Calendly URL (e.g. `https://calendly.com/your-username/20min`).

2. **Contact form** — Set the form `action` to your backend endpoint or a service like [Formspree](https://formspree.io).

3. **Domain** — Point scalekind.ai to your hosting (Vercel, Netlify, etc.).
