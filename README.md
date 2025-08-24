# IshaqGPT — OpenRouter Chat (Next.js • JavaScript)

![IshaqGPT Banner](/og-image.png)

A production-friendly starter that gives you a ChatGPT-style UI (**IshaqGPT**) with a secure server route that calls **OpenRouter** models (default: `deepseek/deepseek-r1-0528-qwen3-8b:free`).  
No Python. No extra UI libraries. Pure Next.js + vanilla JS.

<p align="center">
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" /></a>
  <a href="https://openrouter.ai/"><img alt="OpenRouter" src="https://img.shields.io/badge/OpenRouter-API-blueviolet" /></a>
  <img alt="Language" src="https://img.shields.io/badge/Language-JavaScript-yellow" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Core Files](#core-files)
- [Customization](#customization)
- [Testing the API](#testing-the-api)
- [Troubleshooting](#troubleshooting)
- [Security Checklist](#security-checklist)
- [Deployment (Vercel)](#deployment-vercel)
- [Roadmap](#roadmap)
- [License](#license)
- [Credits](#credits)

---

## Features

- 💬 ChatGPT-style UI (dark theme, avatars, sticky input, typing dots)
- 🔐 Secure server route (`/api/chat`) — API key never touches the browser
- 🧼 Pure JavaScript, no dependencies beyond Next.js
- ⌨️ Keyboard UX: **Enter** to send, **Shift+Enter** for newline
- 🔁 Robust client parsing (gracefully handles HTML/500 responses)
- 🔧 Easy model switching via `MODEL` env var

---

## Tech Stack

- **Next.js 15+** (App Router, JavaScript)
- **OpenRouter** (HTTPS API gateway for LLMs)
- CSS-in-JSX (no Tailwind or UI libs needed)

---

## Architecture

![IshaqGPT Architecture](/architecture.png)

**Flow:**
1. User types in the IshaqGPT UI (`page.js`) and hits **Enter** (or clicks **Send**).
2. Client sends `POST /api/chat { message }`.
3. Server route (`route.js`) calls OpenRouter using your **server-only** API key.
4. OpenRouter returns a completion; the route responds with `{ reply }`.
5. Client renders the bot bubble and auto-scrolls. ✨

---

## Project Structure

