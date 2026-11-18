'use client';
export default function ReportActions() { return <div className="report-actions"><button className="primary-button" onClick={() => window.print()}>Print / Save as PDF <span aria-hidden="true">↓</span></button><p>Choose “Save as PDF” in your print dialog to keep a copy.</p></div>; }
