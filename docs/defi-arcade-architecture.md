# Platform Overview

Defi Arcade V2 is a GameFi platform built on Solana, combining a neon-arcade web experience with on-chain token flows, player-vs-player challenges, and a scalable content ecosystem. Players earn REF and GEM utility tokens through engagement, and spend them on gaming, challenges, crafting, and NFTs.

The platform is structured in three distinct layers: the **Frontend Experience**, the **Backend Platform**, and the **On-Chain Programs** running on Solana — all underpinned by AWS infrastructure.

:::arch
left: Twilio SMS Verification | Mailgun Email Auth
left: SightEngine Content Moderation | Audible Magic Copyright
center: User Auth / Wallet Connect | Game Engine (Unity WebGL)
center: Leaderboards / EXP System | Token Flows (REF / GEM)
center: Rivals / Challenge System | eCommerce / Buy Gems
right: Solana / Anchor On-Chain | Stripe Payments
right: CometChat | TangoRewards / 3rd Party
infra: AWS API Gateway | AWS Lambda | AWS S3 | AWS CloudFront | AWS RDS (PostgreSQL) | AWS Elasticache (Redis)
:::

===

# Frontend Architecture

The frontend is built on **Next.js 15** (App Router) with TypeScript, Tailwind CSS, and shadcn/ui. It follows a neon-arcade design system and is approximately 95% complete.

## Wallet Authentication

Users connect via **Solflare** (desktop) or **WalletConnect** (mobile). Sessions are persisted with protected routing via `WalletSessionProvider`.

## Playable Games

Three Unity WebGL titles are served via S3 iframe. Games communicate with the frontend through `window.postMessage` events.

| Game | Leaderboard | Score Submission |
|------|-------------|-----------------|
| Gold Digger | Pending | No backend endpoint |
| Clicker Game | Pending | No backend endpoint |
| Endless Runner | Live | Active |

> [danger] postMessage handlers currently have no event.origin validation. Any external page can send forged score or session messages to the game iframes. Phase 0 fix required before any public launch.

## Module Status

| Module | Status |
|--------|--------|
| Wallet Auth (Solflare + WalletConnect) | Live |
| Endless Runner Leaderboard | Live |
| Weekly EXP Leaderboard | Live |
| Referral Code Generation | Live |
| Account Dashboard | Live |
| Achievements UI | Built — backend logic pending |
| Daily Activities UI | Built — backend integration pending |
| Buy Gems (Stripe) | Placeholder link only |
| Rivals / PvP Challenge System | UI built — on-chain payout pending |
| Gold Digger Leaderboard | Coming soon |
| Clicker Game Leaderboard | Coming soon |

===

# Backend Architecture

The current backend is an external **AWS API Gateway + Lambda** service with approximately 15 defined REST endpoints, only partially implemented and not included in the main repository.

## Target Backend Stack

:::arch
left: AWS Cognito (Identity) | Google Analytics
left: Stripe (Payments) | Kafka (Events)
center: NestJS Backend API | PostgreSQL / AWS RDS
center: Redis / Elasticache | REST Contract (15 endpoints)
right: Game Score Endpoints | Leaderboard Reads
right: GEM Transfer / EXP Claim | Rival / Challenge Mgmt
infralabel: Data & Infrastructure Layer
infra: AWS API Gateway | AWS Lambda (current) | NestJS (target) | PostgreSQL | Redis | Kafka
:::

> [info] The local /api/challenges stub in the frontend will be replaced with the real NestJS backend in Phase 1. PostgreSQL and Redis are net-new — the current Lambda backend has no persistent relational database.

## REST Contract (Target — 15 endpoints)

| Group | Endpoints |
|-------|-----------|
| Auth | Login, session management |
| Account | Profile read / write |
| Game State | Save-game state per title |
| Scores | Clicker and Endless Runner score submission |
| Rivals | Challenge creation, acceptance, result |
| Leaderboards | Per-game and global ranking reads |
| Tokens | GEM transfer, EXP claim |
| Referrals | Code generation, redemption tracking |

===

# On-Chain Architecture — Solana

The platform runs on **Solana Devnet**. All token flows will migrate from the current exposed keypair model to proper **Anchor on-chain programs**.

## Current vs Target Token Signing

| | Current State | Target State |
|-|--------------|-------------|
| Signing | `NEXT_PUBLIC_TREASURY_SECRET` (client bundle) | Server-side signer route |
| Key Model | Single exposed keypair | Multi-sig or HSM-backed |
| Programs | None (direct transfers) | Anchor programs |
| Network | Solana Devnet | Devnet → Mainnet (post-audit) |

> [danger] The treasury signing keypair is currently exposed in the client-side bundle via NEXT_PUBLIC_TREASURY_SECRET. This is a live financial risk and must be rotated immediately — independent of when the rest of this SOW begins.

## Target On-Chain Programs

:::arch
left: Player Wallet (Solflare) | WalletConnect (Mobile)
left: Web3Auth (Social Login)
center: Reward Distribution Program | Tournament Vault Program
center: REF Token (SPL) | GEM Token (In-Platform)
right: Claim Verification | Vesting / Locks
right: Escrowed Prizes | Secure Payout
infralabel: Solana Network — Anchor Programs
infra: Solana Devnet | Anchor Framework | Multi-Sig Signer | Independent Smart Contract Audit
:::

===

# Content Ingestion & Distribution

## User-Generated Content Flow

:::flow
step: Web UI / App UI
step: AWS CloudFront (Ingestion)
step: AWS S3 (Storage)
step: AWS MediaConvert (Transcoding)
step: AWS CloudFront (Distribution)
step: Web UI / App UI
sub: Upload | Store | Transcode | Deliver | Consume
:::

## 3rd Party Content Flow

:::flow
step: Web UI / API
step: AWS CloudFront (Ingestion)
step: AWS S3 (Storage)
step: AWS MediaConvert (Transcoding)
step: AWS CloudFront (Distribution)
step: App UI
sub: Bulk Upload / API | Store | Transcode | Deliver | Consume
:::

Content moderation and copyright detection is applied at the ingestion stage via **SightEngine** (visual) and **Audible Magic** (audio copyright).

===

# AWS Infrastructure

## Server Environment

:::arch
left: CloudWatch (Monitoring) | CloudTrail (Audit)
left: Admin Panel (CMS / Reports)
center: Load Balancer (prod-lb) | App Servers x3 (M5 instances)
center: eu-west-2a + eu-west-2b | 256-bit Encryption (all services)
right: Auto Scaling Group | Horizontal Redundancy
right: Admin App Server (T2)
infralabel: AWS Server Environment
infra: AWS EC2 (M5 App Servers) | AWS EC2 (T2 Admin) | AWS S3 (Game Assets) | AWS CloudFront (CDN) | AWS Elemental MediaConvert | AWS Lambda (API)
:::

## Database Layer

| Service | Role | Configuration |
|---------|------|--------------|
| AWS RDS (PostgreSQL) | Primary transactional database | Dedicated instances — prod-db-rds, rds2, rds3 |
| AWS RDS Auto Scaling | Handle peak load | Scales read replicas automatically |
| AWS Elasticache (Redis) | In-memory cache | prod-ecache-001 / 002 across eu-west-2a / 2b |

===

# Token Incentive Model

## PIP / REF Token Economy

Players earn REF tokens through engagement. Spending REF generates transaction fees split between the platform and the incentive pool, with a deflationary burning mechanic.

| Flow | Split | Destination |
|------|-------|------------|
| Transaction fees | 75% | Back to User Incentive Pool |
| Transaction fees | 25% | Fruitlab/Defi Arcade Platform |
| Platform portion | Partial | PIP Burning (deflationary) |

> [warning] Once REF has real market value on Mainnet, the Rivals PvP staking mechanic — where players wager tokens against each other for a chance to win more — may be classified as gambling-adjacent in certain jurisdictions. Legal counsel is recommended before Mainnet launch.

## Advertising Layer

| Layer | Technology |
|-------|-----------|
| Advertising Networks | Facebook, Google, Twitter/X, Tapjoy, IronSource, Unity Ads |
| Mediation Layer | IronSource (aggregates all network demand) |
| Platform Recipient | Defi Arcade |

===

# Developer SDK

A JavaScript SDK will allow third-party game publishers to integrate with the Defi Arcade ecosystem.

| Feature | Description |
|---------|-------------|
| Player Identity | Link external accounts to Defi Arcade profiles |
| Gameplay Events | Track session start, score, achievement, session end |
| XP / GEM Rewards | Trigger reward distribution from publisher games |
| Missions & Achievements | Query and update mission / achievement state |
| Tournament Participation | Enrol players and receive tournament results |
| Reward Claim | Initiate on-chain reward claim flows |

Integration paths in scope: **JavaScript (web)** and **Unity WebGL**. Unreal Engine support is roadmap-only and out of scope for this phase.

===

# Delivery Phasing

| Phase | Focus | Key Deliverables |
|-------|-------|-----------------|
| 0 — Critical Remediation | Security fixes | Treasury key rotated, server-side signer, TypeScript errors resolved, postMessage origin validation |
| 1 — Backend Foundation | Core infrastructure | NestJS backend, PostgreSQL + Redis, full REST contract, /api/challenges wired to real backend |
| 2 — On-Chain Programs | Solana / Anchor | Reward distribution program, tournament vault, key management design |
| 3 — Feature Completion | Product gaps | Referral tracking, Buy Gems live, achievements, daily activities, remaining leaderboards |
| 4 — SDK & Wallet Expansion | Ecosystem | JS SDK, REST docs, Unity integration path, multi-wallet support |
| 5 — Audit & Hardening | Production readiness | Independent smart-contract audit, anti-cheat, session verification, full QA pass |

Total indicative build: **17–25 weeks** (excluding external audit lead time).

> [info] Phase 0 must begin immediately and does not require full SOW sign-off. The exposed treasury keypair is a live financial risk today.

---

# Third-Party Dependencies

| Category | Provider | Purpose |
|----------|---------|---------|
| Blockchain | Solana (Devnet to Mainnet), Anchor | Token flows, on-chain programs |
| Wallets | Solflare, WalletConnect, Web3Auth | Auth, transaction signing |
| Backend Infra | AWS API Gateway, Lambda, S3, Kubernetes (target) | Hosting, game asset delivery |
| Data and Events | PostgreSQL, Redis, Kafka | Durable state, cache, event ingestion |
| Payments | Stripe | Buy Gems flow |
| Identity | AWS Cognito | Referral signup |
| Analytics | Google Analytics | Usage tracking |
| Smart Contract Audit | Independent auditor (TBC) | Pre-mainnet program audit — external cost |

---

# Acceptance Criteria

- [x] Treasury key removed from client bundle — signing moved server-side — exposed keypair rotated
- [x] Production build passes with typescript.ignoreBuildErrors removed
- [x] All game iframe postMessage handlers validate event.origin
- [ ] Full REST contract implemented and tested against live frontend
- [ ] On-chain reward distribution and tournament vault programs deployed to Devnet
- [ ] Smart-contract audit passed with no unresolved critical findings
- [ ] Referral redemption, Buy Gems, achievements and daily activities live end-to-end
- [ ] Gold Digger and Clicker Game leaderboards live
- [ ] JS SDK published with documentation and working sample integration
- [ ] README and project documentation reflect the shipped system
