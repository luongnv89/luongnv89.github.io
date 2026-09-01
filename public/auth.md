# auth.md

Agent registration for **luongnv.com** — personal portfolio site.

## Audience

This site is a static portfolio (no private APIs requiring authentication for general browsing). Agents needing to act on behalf of a user should use the OAuth discovery documents below.

## Registration

- OAuth Authorization Server: `https://auth.luongnv.com/.well-known/oauth-authorization-server` (alias for `https://luongnv.com/.well-known/oauth-authorization-server`)
- Protected Resource: `https://luongnv.com/.well-known/oauth-protected-resource`
- OpenID Discovery: `https://luongnv.com/.well-known/openid-configuration`

### Supported methods

- `authorization_code` + PKCE — browser agents and assistants
- `client_credentials` — service agents (if provisioned)
- `urn:ietf:params:oauth:grant-type:device_code` — device-flow for CLI agents

### Scopes

- `read:public` — read public portfolio, games, and docs (no auth needed)
- `agent_auth` — register and act as an agent

## Credential use

Present bearer tokens as `Authorization: Bearer <token>` on requests to protected endpoints. Tokens are issued by the authorization server listed in `.well-known/oauth-protected-resource`.

## Notes

- Registration does not create accounts automatically; approval may be required.
- For public content (homepage, games, llms.txt, sitemap), no token is required — prefer unauthenticated fetch.
