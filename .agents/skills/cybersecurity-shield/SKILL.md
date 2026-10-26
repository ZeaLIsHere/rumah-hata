---
name: cybersecurity-shield
description: Proactive security audit, OWASP Top 10 mitigation, secure input validation, RBAC enforcement, and data privacy hardening.
---

# Cybersecurity Shield Skill

Use this skill when auditing source code, reviewing API endpoints, enforcing authentication/authorization, and securing web applications against common vulnerabilities.

## Audit Checklist (OWASP Top 10)

1. **A01: Broken Access Control**:
   - Verify every endpoint authenticates session/JWT and checks role permissions (`WARGA`, `BANK_SAMPAH`, `OFFTAKER`, `PEMERINTAH`).
   - Prevent Insecure Direct Object References (IDOR): Verify user owns or has permission over the target resource ID.
2. **A02: Cryptographic Failures**:
   - Passwords hashed with Argon2id or bcrypt (cost factor >= 12).
   - Sensitive credentials never stored in git; use `.env.local`.
   - TLS 1.3 enforced via HSTS headers.
3. **A03: Injection**:
   - Zero raw concatenated SQL strings. All queries must use parameterized statements or ORMs (Prisma/Drizzle).
   - Sanitize and escape all user outputs before rendering to prevent Cross-Site Scripting (XSS).
4. **A04: Insecure Design & Rate Limiting**:
   - Enforce IP and token-based rate limits (e.g., 100 requests per minute).
   - Strict Zod schemas validating all payloads at the boundary before processing.
5. **A09: Security Logging & Monitoring**:
   - Record immutable audit logs for sensitive operations (verifications, payouts, role changes).
