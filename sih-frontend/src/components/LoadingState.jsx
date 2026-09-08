export default function LoadingState({ text = "Sending to backend…" }) {
  return (
    <div className="loading-card">
      <div className="spinner" />
      <strong>{text}</strong>
      <p>Please wait while the request is being processed.</p>
    </div>
  );
}