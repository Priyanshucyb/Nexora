import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <div className="hero">
        <div>
          <span className="eyebrow">DAY 1 • FOUNDATION</span>
          <h1>Packaged Commodity<br />Inspection</h1>
          <p>Capture or upload product labels and send the evidence to the backend for processing.</p>
          <Link className="primary-btn" to="/scan">＋ Start New Scan</Link>
        </div>
        <div className="hero-visual">⚖</div>
      </div>

      <div className="stat-grid">
        {["Total Inspections", "Products Scanned", "Needs Review", "Potential Issues"].map((x) => (
          <div className="stat-card" key={x}><span>{x}</span><strong>0</strong></div>
        ))}
      </div>

      <div className="empty-card">
        <div className="empty-icon">▣</div>
        <h2>No inspections yet</h2>
        <p>Start a scan to create your first inspection.</p>
      </div>
    </div>
  );
}