# Platform Architecture Overview

Peaky Blinders is a real-money prediction market platform where users buy YES or NO positions on live markets. The architecture separates read-heavy market browsing from write-critical order flows, using an async queue-based matching engine to guarantee consistency under high load.

All services are hosted on AWS with CloudFront edge protection and end-to-end encryption.

---

# System Architecture

:::vflow
single: React 18 SPA | Vite build, TanStack Query | neutral
arrow:
single: CloudFront + WAF | CDN, DDoS and WAF protection | neutral
arrow:
single: Auth Service (Lambda) | Sessions, bcrypt, Google OAuth | blue
arrow:
pair: API Gateway REST | Wallet, admin, auth routes | blue :: API Gateway WebSocket | Live market prices | blue
arrow:
pair: Lambda Services | Wallet, admin, Twitch trending | purple :: ECS Fargate | Market matching engine | purple
arrow:
single: EventBridge + SQS | Order queue, payment events | red
arrow:
triple: Aurora PostgreSQL | Users, wallet, trades, sessions | green :: ElastiCache Redis | Live market order book | green :: S3 | Static frontend build | green
:::

===

# Order Placement Flow

When a user places a position on a market (buying YES or NO), the request travels through a decoupled pipeline that separates intake validation from the matching engine — preventing the engine from becoming a bottleneck under peak load.

:::vflow
single: User Places a Position | Buys YES or NO on a market | neutral
arrow:
single: API Gateway | Validates session, checks balance | blue
arrow:
single: SQS Order Queue | Decouples intake from matching | red
arrow:
single: Matching Engine (ECS Fargate) | Updates YES/NO price in Redis | purple
arrow:
single: Aurora PostgreSQL | Writes trade, updates wallet | green
arrow:
single: EventBridge | Publishes position filled event | red
arrow:
single: WebSocket Push to Client | Portfolio and price update | blue
:::

===

# Service Breakdown

## Frontend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| SPA Framework | React 18 | UI rendering |
| Build Tool | Vite | Fast dev and production build |
| Data Fetching | TanStack Query | Server state, caching, refetching |
| CDN | AWS CloudFront | Edge delivery, DDoS protection |
| WAF | AWS WAF | Request filtering, bot protection |

## Authentication

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Auth Service | AWS Lambda | Stateless session handler |
| Password hashing | bcrypt | Secure credential storage |
| Social login | Google OAuth | One-click signup and login |
| Session storage | ElastiCache Redis | Fast session validation |

## API Layer

| Gateway | Routes | Handler |
|---------|--------|---------|
| API Gateway REST | /wallet, /admin, /auth | Lambda services |
| API Gateway WebSocket | Live price feed, market updates | ECS Fargate |

## Backend Services

| Service | Runtime | Responsibilities |
|---------|---------|-----------------|
| Wallet service | Lambda | Balance reads/writes, deposit, withdrawal |
| Admin service | Lambda | Market creation, resolution, moderation |
| Twitch trending | Lambda | Fetches trending streams for market suggestions |
| Matching engine | ECS Fargate | Continuous process — matches YES/NO orders, updates prices |

> [info] ECS Fargate is used for the matching engine rather than Lambda because matching is a stateful, long-running process. Lambda cold-starts and 15-minute limits make it unsuitable for a live order book engine.

## Event Bus & Queue

| Service | Purpose |
|---------|---------|
| SQS | Decouples order intake from matching — absorbs traffic spikes |
| EventBridge | Routes events post-matching: position filled, market resolved, payment triggered |

## Data Layer

| Service | Data |
|---------|------|
| Aurora PostgreSQL | Users, wallets, trade history, sessions, market metadata |
| ElastiCache Redis | Live YES/NO order book, real-time price cache, session tokens |
| S3 | Static frontend assets, market cover images |

===

# Security

> [danger] All real-money platforms require session validation on every order endpoint. The API Gateway must verify session tokens before forwarding to Lambda — never trust client-side balance checks.

| Layer | Control |
|-------|---------|
| Edge | CloudFront + WAF blocks DDoS, SQLi, and bot traffic |
| Auth | bcrypt hashing, JWT sessions, Google OAuth PKCE flow |
| API | Gateway-level auth validation before any Lambda invocation |
| Queue | SQS FIFO ensures order integrity — no duplicate executions |
| Database | RDS encryption at rest, VPC isolation, no public endpoint |
| Audit | All payment and trade events published to EventBridge for audit trail |
