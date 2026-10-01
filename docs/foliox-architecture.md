# Platform Architecture Overview

Foliox is a creator-economy trading platform where users build portfolios by buying and selling creator shares. The architecture combines a Next.js frontend with a serverless backend for standard operations and a persistent ECS Fargate matching engine for live order execution.

All services run on AWS with CloudFront edge distribution and Cognito-managed identity.

---

# System Architecture

:::vflow
single: Next.js 15 App | Browser, React 19 client | neutral
arrow:
single: CloudFront + WAF | CDN, DDoS and WAF protection | neutral
arrow:
single: Amazon Cognito | User pools, JWT tokens | blue
arrow:
pair: API Gateway REST | Catalog, portfolio, orders | blue :: API Gateway WebSocket | Live prices, order book | blue
arrow:
pair: Lambda Services | Users, creators, portfolio | purple :: ECS Fargate | Matching engine, price feed | purple
arrow:
single: EventBridge + SQS | Order queue, trade events | red
arrow:
triple: Aurora PostgreSQL | Trades, holdings, users | green :: ElastiCache Redis | Live order book cache | green :: S3 | Cover art, static assets | green
:::

===

# Order Execution Flow

When a user submits a buy or sell order (market or limit), the system validates the request, queues it asynchronously, and routes it through the matching engine before persisting the result and pushing updates back to the client.

:::vflow
single: User Submits Order | Buy or sell, market or limit | neutral
arrow:
single: API Gateway | Validates auth, checks cash | blue
arrow:
single: SQS Order Queue | Decouples intake from matching | red
arrow:
single: Matching Engine (ECS Fargate) | Matches against Redis order book | purple
arrow:
single: Aurora PostgreSQL | Writes trade, updates holdings | green
arrow:
single: EventBridge | Publishes trade executed event | red
arrow:
single: WebSocket Push to Client | Portfolio and order book update | blue
:::

===

# Service Breakdown

## Frontend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSR, streaming, static generation |
| React version | React 19 | Concurrent features, server components |
| CDN | AWS CloudFront | Edge delivery, asset caching |
| WAF | AWS WAF | Rate limiting, bot and injection protection |

## Identity & Auth

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Identity provider | Amazon Cognito | User pools, social federation |
| Tokens | JWT (Cognito-issued) | Stateless auth on every API call |
| OAuth | Google, Apple (via Cognito) | Social login flows |

## API Layer

| Gateway | Routes | Handler |
|---------|--------|---------|
| API Gateway REST | /catalog, /portfolio, /orders | Lambda services |
| API Gateway WebSocket | Live price feed, order book depth | ECS Fargate |

## Backend Services

| Service | Runtime | Responsibilities |
|---------|---------|-----------------|
| Users service | Lambda | Profile management, KYC, settings |
| Creators service | Lambda | Creator profiles, share issuance, stats |
| Portfolio service | Lambda | Holdings reads, P&L calculation |
| Matching engine | ECS Fargate | Continuous limit-order matching, price updates |
| Price feed | ECS Fargate (sidecar) | Pushes live prices to WebSocket clients |

> [info] The matching engine runs as a persistent ECS Fargate process rather than Lambda. It maintains an in-memory order book backed by Redis — Lambda's ephemeral execution model cannot maintain this kind of long-lived state.

## Event Bus & Queue

| Service | Purpose |
|---------|---------|
| SQS | Buffers incoming orders — decouples API Gateway throughput from engine speed |
| EventBridge | Distributes post-trade events: trade executed, portfolio updated, creator price changed |

## Data Layer

| Service | Data |
|---------|------|
| Aurora PostgreSQL | Trades, holdings, users, creator metadata, order history |
| ElastiCache Redis | Live order book per creator, price cache, WebSocket session state |
| S3 | Creator cover art, thumbnails, static Next.js assets |

===

# Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js 15 over React SPA | SEO for creator catalog pages; server components reduce client bundle |
| Cognito over custom auth | Managed user pools, MFA, and social federation with no auth server to maintain |
| SQS before matching engine | Absorbs order spikes without back-pressure on the engine; enables retry on failure |
| ECS Fargate for matching | Stateful long-running process needs persistent memory; Lambda unsuitable |
| Redis for order book | Sub-millisecond reads for live price calculations and WebSocket push |
| EventBridge for post-trade | Decouples trade persistence from downstream effects (notifications, analytics, portfolio refresh) |

===

# Security

> [danger] All order endpoints must validate Cognito JWT tokens at the API Gateway level before reaching Lambda. Never trust client-side balance or holdings state for order validation.

| Layer | Control |
|-------|---------|
| Edge | CloudFront + WAF blocks DDoS, injection, and scraping |
| Identity | Cognito-managed pools — no custom password storage |
| API | JWT validation at Gateway level on all REST and WebSocket connections |
| Queue | SQS FIFO prevents duplicate order execution |
| Database | Aurora encrypted at rest, VPC-private, no public endpoint |
| Audit | EventBridge event log covers all trades and portfolio changes |
