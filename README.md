# STARTIN-DE Document Check Centre

Secure document upload and review workspace for candidates preparing Ausbildung applications in Germany.

See [architecture and repository inspection](docs/architecture.md), [implementation status](docs/implementation-status.md), [local setup/deployment](docs/deployment.md), and the [benchmark harness guide](docs/benchmarking.md). Start with `.env.example`. No production credentials or candidate documents are included.

The Supabase migration is in `supabase/migrations/`. The app fails closed when hosted authentication, malware scanning, OCR or model providers are not configured; it does not simulate a completed review.
