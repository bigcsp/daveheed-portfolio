# English Daveheed — Portfolio

A premium, responsive Next.js portfolio with a cinematic visual direction, live GitHub repository/stat integration, light/dark modes, and an Errands logistics-platform case study.

## Run locally

```bash
npm install
npm run dev
```

The GitHub route retrieves public data for `bigcsp` and automatically falls back to curated project data if the API cannot be reached. Update the contact email and social links in `components/portfolio.tsx` before deploying.

## Contact form

`POST /api/contact` validates submissions, blocks bots with a honeypot field, and rate-limits each IP to 5 messages per 10 minutes. Delivery goes through [Resend](https://resend.com) when these environment variables are set (copy `.env.example` to `.env.local`):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it the form still validates, but the message is only logged server-side. |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries. |
| `CONTACT_FROM_EMAIL` | Verified sender, e.g. `Portfolio <hello@yourdomain.com>`. |

The rate limiter is in-memory, so it resets on redeploy and is per-instance — swap in a shared store (Upstash, Redis) if you scale horizontally.

## Interaction layer

`components/motion-bits.tsx` holds the reusable interactions: scroll progress bar, pointer glow (skipped on touch and when `prefers-reduced-motion` is set), tilt cards, magnetic buttons, count-up stats, word-by-word headline reveals, and scroll-spy nav highlighting.

## Deploy

Deploy to Vercel by importing this directory, or run `npm run build` to create a production build.
