import { Link } from "react-router-dom";

const fields = ["Generic Name", "Net Quantity", "MRP", "Manufacturer / Packer", "Country of Origin", "Consumer Care"];

export default function Result() {
  let result = null;
  try { result = JSON.parse(sessionStorage.getItem("scanResult") || "null"); } catch {}

  return (
    <div className="page">
      <div className="page-heading"><div><span className="eyebrow">RESULT</span><h1>Inspection Result</h1><p>Simple result shell ready to connect with the backend response.</p></div><Link className="secondary-btn" to="/scan">← New Scan</Link></div>

      {result ? (
        <div className="section-card"><h2>Backend response</h2><pre className="json-box">{JSON.stringify(result, null, 2)}</pre></div>
      ) : (
        <>
          <div className="result-summary">
            <div className="score-placeholder"><span>Compliance Score</span><strong>—</strong><small>Awaiting backend</small></div>
            <div className="summary-box"><span>Declaration Checks</span><strong>—</strong><small>Backend data pending</small></div>
            <div className="summary-box"><span>Violations</span><strong>—</strong><small>Backend data pending</small></div>
          </div>
          <div className="section-card"><h2>Detected fields</h2>{fields.map(f => <div className="result-row" key={f}><b>{f}</b><span>Awaiting backend response</span><em>Pending</em></div>)}</div>
          <div className="section-card"><h2>Violations</h2><div className="empty-inline">No backend violations received yet.</div></div>
          <div className="section-card"><h2>Evidence</h2><div className="empty-inline">Evidence/bounding boxes will be rendered here when backend sends them.</div></div>
        </>
      )}
    </div>
  );
}