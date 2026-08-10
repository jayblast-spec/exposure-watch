<div align="center">

# Exposure Watch

### Defensive Breach Exposure Checks Without the Black Box

Exposure Watch is a privacy-first breach-awareness tool for people and teams who need to understand email, password, and IP exposure risk without handing sensitive data to a black box. It checks real breach and abuse data sources, then turns the result into a prioritized posture score and a concrete remediation queue — no stored passwords, no stored raw secrets.

<p>
  <a href="https://exposurewatch-sigma.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live-Demo-1D4ED8?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <a href="https://github.com/jayblast-spec/exposure-watch"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white"></a>
</p>

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-38BDF8?style=flat-square&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Product%20Layer-1D4ED8?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-Design%20System-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Functions-000000?style=flat-square&logo=vercel&logoColor=white">
</p>

<p>
  <img alt="Animated headline" src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=18&duration=2600&pause=650&color=1D4ED8&center=true&vCenter=true&width=760&lines=Email+%2B+password+%2B+IP+exposure+checks;No+raw+secrets+ever+leave+the+browser;Real+breach+data%2C+not+a+guess;Posture+score+%E2%86%92+remediation+queue">
</p>

</div>

## What It Does

Exposure Watch runs three defensive checks against real third-party security data sources and reports the result as a posture score with prioritized next actions:

- **Email breach check** — looks up an email against breach records and returns which breaches it appeared in and what data was exposed.
- **Password exposure check** — checks a password hash against known-compromised password ranges using k-anonymity, so the full password or hash is never transmitted or stored.
- **IP abuse check** — validates an IPv4/IPv6 address and checks it against abuse-reporting data.
- **Posture studio** — a general-purpose exposure prompt (email, domain, or scenario) that returns a scored intelligence map, an action queue (MFA review, password reset sequencing, domain watch), and contributor missions for extending the tool.

## How It Works

- Built on Next.js App Router with TypeScript and Tailwind CSS 4, deployed as Vercel serverless functions.
- `app/api/breach-check` calls the XposedOrNot breach-analytics API server-side and returns only breach name, date, and exposed-data categories — never persists the queried email.
- `app/api/password-check` implements Have I Been Pwned's k-anonymity range API: only a 5-character SHA-1 prefix is sent, the full hash never leaves the request.
- `app/api/ip-check` validates the address format, then checks it against AbuseIPDB when an API key is configured.
- `app/api/intelligence` powers the posture studio on the homepage with a deterministic scoring model (no external key required), returning an exposure map, action queue, and contributor lanes.

## Live

[exposurewatch-sigma.vercel.app](https://exposurewatch-sigma.vercel.app)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Breach data | XposedOrNot breach-analytics API |
| Password check | Have I Been Pwned range API (k-anonymity) |
| IP reputation | AbuseIPDB |
| Deployment | Vercel serverless functions |

<div align="center">

<img alt="Footer" src="https://capsule-render.vercel.app/api?type=rect&height=60&color=0:1D4ED8,55:0B1E3D,100:020617&text=michael%40arknet.digital&fontColor=FAFAFA&fontSize=18&fontAlign=50&animation=fadeIn">

</div>
