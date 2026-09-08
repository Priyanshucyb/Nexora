const TYPES = [
  "Front", "Back", "Left Side", "Right Side", "Top", "Bottom",
  "Close-up / Label", "Barcode / QR", "Other"
];

export default function PhotoCard({ photo, index, onType, onRemove }) {
  return (
    <div className="photo-card">
      <button className="remove-btn" onClick={() => onRemove(index)} aria-label="Remove">×</button>
      {photo.preview ? (
        <img src={photo.preview} className="photo-preview" alt={`Product photo ${index + 1}`} />
      ) : (
        <div className="pdf-preview">PDF</div>
      )}
      <div className="photo-info">
        <strong>Photo {index + 1}</strong>
        <select value={photo.type} onChange={(e) => onType(index, e.target.value)}>
          {TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
        <small>{photo.file.name}</small>
      </div>
    </div>
  );
}