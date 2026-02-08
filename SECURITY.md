# Security Policy — SILENCE.OBJECTS

## Supported Versions

| Version | Supported |
|---------|-----------|
| 5.x     | Active    |
| < 5.0   | No        |

## Reporting a Vulnerability

**DO NOT** create a public GitHub issue for security vulnerabilities.

Email: **security@patternslab.app**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within **48 hours** and provide a fix timeline within **7 days**.

## Security Measures

### Repository Security
- Branch protection on `main` (require PR review)
- Secret scanning enabled
- Dependabot alerts enabled
- CODEOWNERS enforced for closed modules
- No secrets in git history (BFG-cleaned)

### Runtime Security
- 3-layer crisis detection (@silence/safety)
- Rate limiting on all AI endpoints
- Input sanitization (zero-width character stripping)
- Output scanning (forbidden vocabulary enforcement)
- Circuit breaker pattern (15s timeout)
- RLS on all Supabase tables

### Compliance
- GDPR compliant (EU Supabase region)
- No therapeutic/diagnostic claims (enforced by @silence/language)
- P0/P1/P2 compliance matrix enforced in CI/CD

## Closed Modules

Modules marked as "closed" (`@silence/safety`, `@silence/ai`, `@silence/predictive`,
`@silence/voice`, `@silence/medical`, `@silence/legal`, `@silence/linkedin-agent`)
are proprietary and stored in private repositories. Only interface definitions
are available in `@silence/contracts`.

## Dependencies

We regularly audit dependencies via `pnpm audit` and GitHub Dependabot.
