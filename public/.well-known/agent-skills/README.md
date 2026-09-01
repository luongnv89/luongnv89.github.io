# Agent Skills Discovery Index

This directory contains the agent skills discovery index per the [Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc) v0.2.0.

## Index

The skills index is published at:
- `https://luongnv.com/.well-known/agent-skills/index.json`

## Verification

Run a scan at:
```
POST https://isitagentready.com/api/scan
Content-Type: application/json
{"url": "https://luongnv.com"}
```

Expected result: `checks.discovery.agentSkills.status` = `"pass"`
