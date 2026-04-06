# Workspace

## Overview

WhatsApp AI Chatbot Dashboard — a monitoring and management dashboard for n8n-powered WhatsApp AI chatbot workflows. Shows real-time conversations, message threads, AI summaries, and allows configuring n8n webhook URLs.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + wouter

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

- **Frontend**: `artifacts/whatsapp-dashboard/` — React+Vite SPA at previewPath "/"
- **Backend**: `artifacts/api-server/` — Express API server at "/api"
- **DB Schema**: `lib/db/src/schema/` — conversations, messages, summaries, settings tables
- **API Spec**: `lib/api-spec/openapi.yaml` — OpenAPI contract

## Pages

- `/` — Dashboard overview with stats and recent activity
- `/conversations` — All WhatsApp conversations list
- `/conversations/:id` — Message thread with Summarize button
- `/summaries` — All AI-generated summaries
- `/settings` — Configure n8n webhook URLs

## n8n Integration

- **Chatbot webhook**: n8n pushes messages to `/api/messages` endpoint (POST)
  - Required body: `{ contactPhone, contactName, role: "user"|"assistant", content, timestamp? }`
- **Summarizer webhook**: Dashboard calls your n8n summarizer URL when user clicks "Summarize"
  - Configure the URL in the Settings page
