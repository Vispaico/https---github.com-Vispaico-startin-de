# Setup and deployment

## Local development

1. Install Node.js 20.9+ and npm.
2. Copy `.env.example` to `.env.local`.
3. For an isolated local walkthrough, set `LOCAL_DEV_AUTH=true` and set `LOCAL_DEV_SECRET` to a unique random value at least 32 characters long. Sign in as `candidate@example.test` with that value as the password. Local uploads are private files under `.private-data/`; never use this adapter in production.
4. Run `npm install`, `npm run dev`, then open `http://localhost:3000`.
5. Run `npm test` and `npm run typecheck` before a release.

The local adapter intentionally does not run the OCR/model worker. It does not invent reports. To exercise real processing, use a test Supabase project with approved scanner/OCR/LLM endpoints.

## Supabase hosted setup

1. Create a Supabase project in a region approved for the service's privacy and transfer requirements.
2. Apply the SQL migration in `supabase/migrations/` using Supabase CLI or the SQL migration workflow.
3. Configure Supabase Auth email/password sign-in and approved redirect URLs.
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and the private bucket name in the hosting provider's server environment. The service-role key is private; do not prefix it with `NEXT_PUBLIC_`.
5. Create advisor/admin accounts through the trusted administrator process and set their `app_metadata.role` to `advisor` or `admin`. Never use user-editable `user_metadata` for role decisions.
6. Configure `WORKER_SECRET` as a high-entropy secret. Schedule a private POST to `/api/worker/process` with `Authorization: Bearer <secret>` at a short interval. A `worked:false` result means there was no queued work. Keep the response body out of public monitoring logs.
7. Configure an approved malware scanner first. The worker fails closed when it is missing. Set `MALWARE_SCAN_PROVIDER`, `MALWARE_SCAN_URL`, and `MALWARE_SCAN_API_KEY`. The adapter sends the private bytes as `application/octet-stream` with a Bearer secret and expects JSON `{ "clean": true }`. Map the selected vendor's API to that contract without echoing file data into logs or responses.
8. Set `OCR_PROVIDER`, `OCR_API_URL`, and `OCR_API_KEY` only after reviewing retention, training, region and commercial terms. The adapter sends raw bytes with their verified MIME type and expects JSON containing `text` plus `pages: [{ "page": 1, "text": "...", "confidence": 0.9 }]`.
9. Set `LLM_PROVIDER=openrouter` or `nvidia`, fixed primary model IDs, API key and rate cards. Never rely on free routes for production SLAs. Verify per-provider terms, DPA, data location, no-training/retention commitments and candidate notices.
10. Configure the hosting platform with Node.js server support. Build with `npm run build`, serve with `npm start`, and provide all private environment values through its secret manager.

## Operations and retention

- Storage bucket is private; do not make it public or create public URLs.
- Check worker failures by `last_error_code` and job attempt count, not document content.
- Monitor model/provider, token and estimated cost fields in `document_reports`; maintain active `model_rate_cards` rows before enabling spend alerts.
- Document delete removes the object, soft-deletes its metadata, and cascades extracted text/reports only if the underlying row is physically removed. Define a production retention job and backup expiry with counsel and the hosting providers.
- Account erasure must remove each private object through the Storage API before deleting its auth user. Database cascades alone do not remove object bytes.
- Rotate provider, service-role, scanner and worker secrets through the hosting secret manager. Never add `.env.local`, `.private-data/`, candidate files or anonymisation keys to source control.
- Legal review in Vietnam and Germany, privacy notice completion, provider approval and data processing agreements are launch gates from the implementation brief.
