# Implementation status

## Complete in this repository

- Repository/architecture inspection and Next.js App Router scaffold.
- STARTIN-DE favicon/logo moved to `public/` and used in the layout.
- Candidate sign-in integration for Supabase plus an explicit local-only signed session.
- Candidate My Documents list, PDF/DOCX upload, report-language selection, consent notice, details and deletion.
- Signature checks, ZIP/DOCX archive safety limits, random object paths, bounded request-body reads, file size/page limits, per-candidate upload quota and duplicate-content rejection.
- Private Supabase Storage bucket, server-proxied file transfers, RLS, database migrations, storage privacy, audit events, persistent queue, stale-claim recovery and idempotent processing records.
- Native PDF and DOCX extraction, page-aware PDF mapping, OCR interface/fallback, extraction quality, private extracted text and controlled unable-to-assess reports.
- OpenRouter/NVIDIA-compatible adapters, no-op development mock, provider-approval gates, versioned prompt, strict Zod report contract, evidence validation, bounded retry, model token/cost accounting and cost stop.
- Candidate report history, browser print-to-PDF, deletion of derived content, human-review requests, advisor assignment, audited staff document/report access, candidate-visible feedback approval and basic model usage dashboard.
- English, Vietnamese and German core UI; Vietnamese is the default. Privacy/legal notice remains draft English pending counsel-approved localization.
- Synthetic PDF/DOCX fixtures, validation, extraction, mock, ownership and migration access-control tests; benchmark harness; local and deployment documentation.

## Requires provider credentials or service setup

- Hosted sign-in, database, private object storage and persistent queue require Supabase values and migration application.
- Worker processing requires a configured malware scanner and a scheduled call to the protected worker endpoint.
- OCR requires an approved cloud OCR endpoint, API key and `OCR_PROCESSING_APPROVED=true`.
- Live model review requires an approved fixed model, provider key, model rate card, `DOCUMENT_AI_APPROVED=true`, and provider terms/privacy review.

## Still needed before production

- Install dependencies and run the build/typecheck/tests in a network-enabled environment; this workspace could not fetch npm packages.
- Supabase integration tests with two real candidate users, expired sessions and storage denial tests.
- Production-grade cloud malware scanner contract and timeout/retry verification.
- Full 30–50 case benchmark with labelled precision/recall/hallucination results and OCR comparison.
- Model escalation routing, shared content/analysis cache, notifications, server-generated PDF endpoint and re-review controls.
- Advisor note workflow and operational dashboards/alerts.
- Retention/backup deletion implementation, privacy contact, provider/subprocessor notices, Vietnam/Germany counsel review and data-transfer approval.
- Hosting provider project, production environment secrets, worker scheduler and deployment verification.

Application Match Check remains a later product phase.
