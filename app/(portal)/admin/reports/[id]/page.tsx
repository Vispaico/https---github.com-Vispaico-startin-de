import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getStaffReport } from '@/lib/documents/store';
import ApproveFeedback from './approve-feedback';

export default async function AdminReportPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await getSessionUser(); if (!staff) redirect('/login?next=%2Fapp'); if (!['advisor','admin'].includes(staff.role)) redirect('/app');
  const { id } = await params; const result = await getStaffReport(staff.id, staff.role as 'advisor' | 'admin', id); if (!result) notFound();
  const report = result.report_json as { summary: string; findings: Array<{ id: string; severity: string; title: string; explanation: string }> };
  return <div className="page-shell detail-shell"><Link className="back-link" href="/admin">← Back to queue</Link><section className="panel report-card"><p className="eyebrow">PRIVATE ADVISOR REVIEW</p><h1>Report preview</h1><p className="lead">Candidate {result.candidate_id.slice(0,8)} · {result.outcome.replaceAll('_',' ')}</p><div className="report-scope"><strong>Automated report</strong><p>{report.summary}</p></div><h2>Findings</h2>{report.findings.length ? report.findings.map((item) => <article className="finding" key={item.id}><span className={`severity ${item.severity}`}>{item.severity}</span><h3>{item.title}</h3><p>{item.explanation}</p></article>) : <p>No findings are available.</p>}<dl className="model-metadata"><dt>Provider / model</dt><dd>{result.provider || 'none'} / {result.model || 'none'}</dd><dt>Tokens</dt><dd>{result.input_tokens ?? 0} in · {result.output_tokens ?? 0} out</dd><dt>Estimated cost</dt><dd>${Number(result.estimated_cost_usd || 0).toFixed(6)}</dd></dl><ApproveFeedback reportId={result.id} /></section></div>;
}
