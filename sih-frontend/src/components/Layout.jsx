import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">⚖</div>
          <div>
            <strong>Legal Metrology</strong>
            <small>AI Inspection Assistant</small>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end>⌂ <span>Dashboard</span></NavLink>
          <NavLink to="/scan">＋ <span>New Scan</span></NavLink>
          <NavLink to="/result">▣ <span>Result</span></NavLink>
        </nav>

        <div className="sidebar-note">
          Frontend Day 1
          <span>Ready for POST /scan</span>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <span>Inspection Portal</span>
          <div className="officer">● Officer ▾</div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}