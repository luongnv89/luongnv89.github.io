# Agent Readiness Plan — https://luongnv.com

**Baseline:** 2/5 (Bot-Aware) — 12 pass, 4 fail, 6 neutral
**Scanner:** isitagentready.com · scanned 2026-09-12T20:35:43.588Z
**Verify with:** re-scan — `curl -sS -X POST https://isitagentready.com/api/scan -H 'Content-Type: application/json' -d '{"url":"https://luongnv.com"}'`

Each task closes exactly one failing check. The scanner is the only source: descriptions are its own fix prompts, and every task is verified by re-scanning, not by inspection.

## Phase P0 — Reach the next readiness level

**Goal:** close 1 failing check in this area · **Milestone M0:** re-scan reports level 3 (Agent-Readable) or higher

### Sprint P0 — Reach the next readiness level

#### Task 0.1: Support Accept: text/markdown content negotiation for machine-readable content

**Description**: Implement content negotiation so requests with Accept: text/markdown return a markdown representation while HTML remains the default for browsers. Implementation guide: https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
**Closes**: — (milestone-enabling: M0)
**Dependencies**: None
**Effort**: M
**Verify**: re-scan https://luongnv.com; `checks.contentAccessibility.markdownNegotiation.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
- [ ] Re-scanning https://luongnv.com reports `checks.contentAccessibility.markdownNegotiation.status` as `pass`
- [ ] The change is live on https://luongnv.com, not only in a preview or staging environment

## Phase P1 — Discoverability and content access

**Goal:** close 2 failing checks in this area · **Milestone M1:** re-scan reports every discoverability and content-accessibility check as pass

### Sprint P1 — Discoverability and content access

#### Task 1.1: Publish DNS for AI Discovery (DNS-AID) SVCB/HTTPS records for DNS-based agent discovery

**Description**: Publish DNS for AI Discovery (DNS-AID) ServiceMode SVCB or HTTPS records under _agents with DNSSEC validation enabled. Implementation guide: https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
**Closes**: — (milestone-enabling: M1)
**Dependencies**: None
**Effort**: L
**Verify**: re-scan https://luongnv.com; `checks.discoverability.dnsAid.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
- [ ] Re-scanning https://luongnv.com reports `checks.discoverability.dnsAid.status` as `pass`
- [ ] The change is live on https://luongnv.com, not only in a preview or staging environment

#### Task 1.2: Include Link response headers for agent discovery (RFC 8288)

**Description**: Add Link response headers to your homepage pointing to API docs, catalogs, or machine-readable descriptions. Implementation guide: https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
**Closes**: — (milestone-enabling: M1)
**Dependencies**: None
**Effort**: M
**Verify**: re-scan https://luongnv.com; `checks.discoverability.linkHeaders.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
- [ ] Re-scanning https://luongnv.com reports `checks.discoverability.linkHeaders.status` as `pass`
- [ ] The change is live on https://luongnv.com, not only in a preview or staging environment

## Phase P3 — Agent, API and auth discovery

**Goal:** close 1 failing check in this area · **Milestone M3:** re-scan reports every discovery check as pass

### Sprint P3 — Agent, API and auth discovery

#### Task 3.1: Publish Auth.md metadata for agent registration

**Description**: Serve /auth.md and advertise agent_auth in OAuth Authorization Server metadata so agents can register securely. Implementation guide: https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://luongnv.com; `checks.discovery.authMd.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md
- [ ] Re-scanning https://luongnv.com reports `checks.discovery.authMd.status` as `pass`
- [ ] The change is live on https://luongnv.com, not only in a preview or staging environment

## Milestones

| ID | Phase | Exit condition | Verify with |
|---|---|---|---|
| M0 | P0 | re-scan reports level 3 (Agent-Readable) or higher | re-scan https://luongnv.com |
| M1 | P1 | re-scan reports every discoverability and content-accessibility check as pass | re-scan https://luongnv.com |
| M3 | P3 | re-scan reports every discovery check as pass | re-scan https://luongnv.com |

**Critical path:** 0.1 → 1.1 → 1.2 → 3.1

## Deferred and out of scope

| Check | Severity | Why deferred | Revisit when |
|---|---|---|---|
| webBotAuth | low | Web Bot Auth directory not found (informational only) — reported as neutral, not a failing check | the scanner reports it as a failing check |
| x402 | low | x402 payment protocol not detected (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| mpp | low | MPP payment discovery not detected (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| ucp | low | UCP profile not found (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| acp | low | ACP discovery document not found (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| ap2 | low | AP2 not declared in A2A Agent Card (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |

**Already passing (12):** `robotsTxt`, `sitemap`, `robotsTxtAiRules`, `contentSignals`, `apiCatalog`, `oauthDiscovery`, `oauthProtectedResource`, `mcpServerCard`, `a2aAgentCard`, `agentSkills`, `webMcp`, `ard`
