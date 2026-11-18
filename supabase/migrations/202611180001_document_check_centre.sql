-- STARTIN-DE Document Check Centre: private candidate-owned records.
create extension if not exists pgcrypto;

create table if not exists public.candidate_documents (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('german_cv','motivation_letter','school_certificate','vocational_qualification','university_transcript','language_certificate','employment_reference','other_supporting_document')),
  original_filename text not null check (length(original_filename) between 1 and 180),
  storage_bucket text not null,
  storage_path text not null unique,
  mime_type text not null check (mime_type in ('application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document')),
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 10485760),
  sha256_checksum text not null check (sha256_checksum ~ '^[a-f0-9]{64}$'),
  page_count integer check (page_count is null or page_count between 1 and 30),
  status text not null default 'uploaded' check (status in ('uploaded','queued','extracting','ocr_required','analysing','validating','completed','needs_human_review','failed','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists candidate_documents_owner_created_idx on public.candidate_documents(candidate_id, created_at desc) where deleted_at is null;
create index if not exists candidate_documents_checksum_idx on public.candidate_documents(candidate_id, sha256_checksum) where deleted_at is null;

create table if not exists public.document_extractions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.candidate_documents(id) on delete cascade,
  extraction_version text not null,
  extraction_method text not null check (extraction_method in ('pdf_text','docx_text','ocr')),
  extracted_text text not null,
  page_map jsonb not null default '[]'::jsonb,
  quality_status text not null check (quality_status in ('good','partial','poor')),
  ocr_used boolean not null default false,
  provider_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(document_id, extraction_version)
);

create table if not exists public.document_review_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.candidate_documents(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  job_type text not null default 'review',
  report_language text not null default 'vi' check (report_language in ('vi','de','en')),
  status text not null default 'queued' check (status in ('queued','processing','retrying','completed','failed','cancelled')),
  attempt_count integer not null default 0 check (attempt_count between 0 and 10),
  idempotency_key text not null unique,
  locked_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now()
);
create index if not exists document_review_jobs_queue_idx on public.document_review_jobs(status, created_at) where status in ('queued','retrying');

create table if not exists public.document_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.document_review_jobs(id) on delete set null,
  document_id uuid not null references public.candidate_documents(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  schema_version text not null,
  prompt_version text not null,
  outcome text not null check (outcome in ('good','revision_recommended','human_review_recommended','unable_to_assess')),
  indicative_score integer check (indicative_score is null or indicative_score between 0 and 100),
  report_json jsonb not null,
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  estimated_cost_usd numeric(12,8),
  latency_ms integer,
  created_at timestamptz not null default now()
);
create unique index if not exists document_reports_job_unique_idx on public.document_reports(job_id) where job_id is not null;
create index if not exists document_reports_owner_created_idx on public.document_reports(candidate_id, created_at desc);

create table if not exists public.document_review_events (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references auth.users(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  document_id uuid references public.candidate_documents(id) on delete set null,
  report_id uuid references public.document_reports(id) on delete set null,
  job_id uuid references public.document_review_jobs(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb check (pg_column_size(metadata) <= 4096),
  created_at timestamptz not null default now()
);

create table if not exists public.advisor_reviews (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.candidate_documents(id) on delete cascade,
  report_id uuid references public.document_reports(id) on delete set null,
  advisor_id uuid not null references auth.users(id),
  status text not null default 'requested' check (status in ('requested','assigned','in_review','approved','feedback_ready','closed')),
  notes text,
  candidate_visible_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists advisor_reviews_document_advisor_unique_idx on public.advisor_reviews(document_id, advisor_id);

create table if not exists public.candidate_human_review_requests (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.candidate_documents(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'requested' check (status in ('requested','assigned','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(document_id)
);

create table if not exists public.model_rate_cards (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model_id text not null,
  input_usd_per_million numeric(12,6) not null check (input_usd_per_million >= 0),
  output_usd_per_million numeric(12,6) not null check (output_usd_per_million >= 0),
  effective_at timestamptz not null default now(),
  active boolean not null default true,
  unique(provider, model_id, effective_at)
);

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.document_upload_attempts (
  candidate_id uuid not null references auth.users(id) on delete cascade,
  sha256_checksum text not null check (sha256_checksum ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  primary key(candidate_id, sha256_checksum)
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists candidate_documents_touch_updated on public.candidate_documents;
create trigger candidate_documents_touch_updated before update on public.candidate_documents for each row execute function public.touch_updated_at();

alter table public.candidate_documents enable row level security;
alter table public.document_extractions enable row level security;
alter table public.document_review_jobs enable row level security;
alter table public.document_reports enable row level security;
alter table public.document_review_events enable row level security;
alter table public.advisor_reviews enable row level security;
alter table public.candidate_human_review_requests enable row level security;
alter table public.model_rate_cards enable row level security;
alter table public.system_settings enable row level security;
alter table public.document_upload_attempts enable row level security;

-- Candidate reads are scoped by auth.uid(). All writes are server-only through
-- the service role after server-side authentication and ownership checks.
drop policy if exists candidate_documents_select_own on public.candidate_documents;
create policy candidate_documents_select_own on public.candidate_documents for select to authenticated using (candidate_id = auth.uid() and deleted_at is null);
drop policy if exists candidate_jobs_select_own on public.document_review_jobs;
create policy candidate_jobs_select_own on public.document_review_jobs for select to authenticated using (candidate_id = auth.uid());
drop policy if exists candidate_reports_select_own on public.document_reports;
create policy candidate_reports_select_own on public.document_reports for select to authenticated using (candidate_id = auth.uid());
drop policy if exists candidate_human_review_select_own on public.candidate_human_review_requests;
create policy candidate_human_review_select_own on public.candidate_human_review_requests for select to authenticated using (candidate_id = auth.uid());
-- Extracted text, advisor notes, events, settings and rate cards have no client
-- policies. Access is restricted to trusted server-side operations.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('startinde-private-documents','startinde-private-documents',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

drop policy if exists startinde_storage_insert_own on storage.objects;
drop policy if exists startinde_storage_delete_own on storage.objects;
drop policy if exists startinde_storage_read_own on storage.objects;
-- No authenticated object policies: all file transfer is proxied by the
-- server after auth/ownership checks. This prevents clients bypassing MIME,
-- quota, malware-scan, and delete workflow enforcement.

create or replace function public.claim_next_document_review_job()
returns table(job_id uuid, document_id uuid, candidate_id uuid, attempt_count integer)
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'service role required'; end if;
  return query
  with next_job as (
    select j.id from public.document_review_jobs j
    where (j.status in ('queued','retrying') or (j.status = 'processing' and j.locked_at < now() - interval '10 minutes')) and j.attempt_count < 3
    order by j.created_at asc for update skip locked limit 1
  )
  update public.document_review_jobs j
  set status = 'processing', attempt_count = j.attempt_count + 1, locked_at = now(), started_at = coalesce(j.started_at, now())
  from next_job where j.id = next_job.id
  returning j.id, j.document_id, j.candidate_id, j.attempt_count;
end; $$;
revoke all on function public.claim_next_document_review_job() from public, anon, authenticated;
grant execute on function public.claim_next_document_review_job() to service_role;

create or replace function public.reserve_document_upload(p_candidate_id uuid, p_checksum text, p_daily_limit integer, p_monthly_limit integer)
returns text language plpgsql security definer set search_path = public as $$
declare today_count integer; month_count integer;
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'service role required'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_candidate_id::text, 0));
  if exists(select 1 from public.document_upload_attempts a where a.candidate_id = p_candidate_id and a.sha256_checksum = p_checksum) then return 'duplicate'; end if;
  select count(*) into today_count from public.document_upload_attempts a where a.candidate_id = p_candidate_id and a.created_at >= date_trunc('day', now());
  if today_count >= p_daily_limit then return 'daily_limit'; end if;
  select count(*) into month_count from public.document_upload_attempts a where a.candidate_id = p_candidate_id and a.created_at >= date_trunc('month', now());
  if month_count >= p_monthly_limit then return 'monthly_limit'; end if;
  insert into public.document_upload_attempts(candidate_id, sha256_checksum) values (p_candidate_id, p_checksum);
  return 'reserved';
end; $$;
revoke all on function public.reserve_document_upload(uuid,text,integer,integer) from public, anon, authenticated;
grant execute on function public.reserve_document_upload(uuid,text,integer,integer) to service_role;
