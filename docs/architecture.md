# STARTIN-DE Document Check Centre

## Repository inspection

The starting directory contained the implementation brief and the supplied STARTIN-DE logo and favicon only. There was no existing framework, source structure, auth provider, database, UI system, environment file, or deployment configuration.

## Architecture

- Next.js App Router and TypeScript for the candidate portal and authenticated API routes.
- Supabase Auth for hosted accounts, PostgreSQL for document, processing, report, review and audit metadata, and a private Supabase Storage bucket for original files.
- Server-side Supabase service-role access is isolated in `lib/documents/store.ts`. Every candidate route checks the authenticated user and then scopes queries by that user's ID. The service role key is never read by client components.
- A local-only adapter stores development files below `.private-data/`, outside `public/`, with mode 0600 files and signed HttpOnly session cookies. It is enabled only when `LOCAL_DEV_AUTH=true` outside production.
- Database-backed jobs use `FOR UPDATE SKIP LOCKED` in a service-role-only claim function. A scheduled runner calls the worker route; the upload request itself does not synchronously run OCR or AI.
- PDF text extraction uses `pdf-parse`; DOCX text extraction uses Mammoth. Image-only PDFs use an OCR adapter. OCR unavailability leads to an unable-to-assess report.
- OpenRouter and NVIDIA use one OpenAI-compatible adapter behind `LLMProvider`. Provider selection and model IDs come from environment configuration. The default mock/off mode rejects requests instead of pretending that an analysis succeeded.
- Reports have a strict Zod schema, versioned prompt, exact-quote/page checks, and React escaped rendering. Only a controlled schema retry is made.

## Security design

- PDF signature and DOCX ZIP structure are inspected independently of the filename. DOCX macros, encrypted archive entries, traversal names, excessive entry counts, expansion sizes and compression ratios are rejected.
- Upload size, page and per-candidate daily/monthly quotas are enforced. Identical content hashes are deduplicated.
- Storage is private, object paths are random, originals are never served from `public/`, and no client storage-object policies exist. All file transfer is server-proxied after auth/ownership checks. Staff document access requires an advisor/admin role and writes an audit event first.
- RLS allows candidates to read only their own active document/job/report rows. Extracted text, advisor notes, events, rate cards and system settings have no client RLS policies. Writes use the trusted server adapter after ownership checks.
- Logs and API errors intentionally omit uploaded content and provider response bodies. API key variables are not `NEXT_PUBLIC_*` values.
- CSP and security headers are configured in `next.config.ts`.

## Important deviations and limits

- There was no pre-existing design system or deployment to preserve, so a compact STARTIN-DE visual system was introduced. The provided brand assets are installed in `public/`.
- Upload bytes are currently proxied through an authenticated server route to private storage. A short-lived direct upload intent could reduce bandwidth later; this avoids exposing storage credentials and keeps validation and record creation atomic in the first implementation.
- Malware scanning is fail-closed. A hosted job remains retryable until `MALWARE_SCAN_URL` and its secret point to an approved scanner. `MALWARE_SCAN_PROVIDER=mock` is allowed only outside production and is for development only.
- OpenRouter/NVIDIA and OCR adapters require provider terms review and configuration. They are never called by default. The application deliberately does not claim processing success without those services.
- The report print action uses the browser's “Save as PDF” facility. A server-generated PDF endpoint is still a production follow-up.
- DOCX pagination cannot be recovered reliably from raw Word text; page count is an approximate limit and page citations are disabled for DOCX. PDF and OCR page maps are used when the parser/provider returns them.
- Tier 2 model escalation, reusable analysis/extraction caches, server-generated PDF export, email notifications and a full advisor-notes workflow are not implemented yet; see `implementation-status.md`.
- The free-form OCR HTTP adapter assumes a private endpoint accepts raw document bytes and returns `{ text, pages, provider? }`; adapt this contract to the selected managed service before launch.
- Candidate-facing privacy text is clearly marked as a draft. Production provider location, retention, privacy contact, terms, legal review and data processing agreements remain business inputs.

## Main routes

- `/login` candidate sign-in.
- `/` My Documents and upload.
- `/documents/:id` document metadata, latest reports and deletion.
- `/reports/:id` candidate report.
- `/privacy` draft processing notice.
- `/admin` advisor queue and usage summary (requires trusted `app_metadata.role` of `advisor` or `admin`).
- `POST /api/worker/process` private job worker, protected by `WORKER_SECRET`.

## Database

Apply `supabase/migrations/202611180001_document_check_centre.sql` to a Supabase project. The migration provisions the private bucket and policies; re-run only through normal migration tooling. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be copied into browser config.
