import Link from "next/link";
import "../../page.css";

export default async function CandidateDetail({ params }) {
  const { id } = params;
  let candidate = null;
  let error = null;
  let debug = {};
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${base}/api/candidates/${id}`;
    debug.url = url;
    const res = await fetch(url, { cache: 'no-store' });
    debug.status = res.status;
    if (res.ok) {
      candidate = await res.json();
      debug.candidate = candidate;
    } else {
      error = true;
      debug.error = await res.text();
    }
  } catch (e) {
    error = true;
    debug.exception = e.toString();
  }

  if (error || !candidate) {
    return (
      <div className="candidates-container">
        <p>Nu s-a găsit candidatul.</p>
        <pre style={{ background: '#eee', padding: 12, borderRadius: 8, fontSize: 13 }}>{JSON.stringify(debug, null, 2)}</pre>
        <Link href="/">Înapoi la listă</Link>
      </div>
    );
  }

  return (
    <div className="candidates-container" style={{ maxWidth: 900, padding: 40, margin: '40px auto' }}>
      <Link href="/" style={{ marginBottom: 32, display: "inline-block", fontSize: 18 }}>← Înapoi la listă</Link>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="candidate-detail-flex"
      >
        <div style={{ flex: '0 0 220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={candidate.imagine.startsWith('http') ? candidate.imagine : `/images/${candidate.imagine}`} alt={candidate.nume} style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left', marginLeft: 0, maxWidth: 500 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 12, color : '#202020'}}>{candidate.nume}</h2>
          <span className="partid" style={{ fontSize: 18, marginBottom: 18, display: 'inline-block',  color: '#202020'}}>{candidate.partid}</span>
          <p style={{ fontSize: '1.2rem', color: '#374151', marginTop: 18 }}>{candidate.descriere}</p>
        </div>
      </div>
      <style>{`
        @media (min-width: 700px) {
          .candidate-detail-flex {
            flex-direction: row;
            align-items: flex-start;
          }
          .candidate-detail-flex > div:first-child {
            margin-right: 40px;
          }
        }
      `}</style>
    </div>
  );
} 