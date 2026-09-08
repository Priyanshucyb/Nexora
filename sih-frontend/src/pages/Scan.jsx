import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadBox from "../components/UploadBox";
import PhotoCard from "../components/PhotoCard";
import LoadingState from "../components/LoadingState";
import { sendScan } from "../services/api";

const TYPES = ["Front", "Back", "Left Side", "Right Side", "Top", "Bottom", "Close-up / Label", "Barcode / QR", "Other"];

export default function Scan() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState("environment");
  const [photos, setPhotos] = useState([]);
  const [establishment, setEstablishment] = useState("");
  const [location, setLocation] = useState("");
  const [inspector, setInspector] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const addFiles = (files) => {
    const next = files.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      type: "Other"
    }));
    setPhotos((old) => [...old, ...next]);
  };

  const removePhoto = (index) => {
    setPhotos((old) => {
      const copy = [...old];
      if (copy[index]?.preview) URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const changeType = (index, type) => {
    setPhotos((old) => old.map((p, i) => i === index ? { ...p, type } : p));
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera not supported");
      if (stream) stream.getTracks().forEach((t) => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
        audio: false
      });
      setStream(s);
      setCameraOpen(true);
    } catch {
      setMessage("Camera access is required. Please allow camera permission and use the application on localhost or HTTPS.");
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraOpen(false);
  };

  const switchCamera = async () => {
    setFacing((old) => old === "environment" ? "user" : "environment");
    stopCamera();
    setTimeout(startCamera, 100);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
      setPhotos((old) => [...old, {
        file,
        preview: URL.createObjectURL(blob),
        type: "Front"
      }]);
    }, "image/jpeg", 0.92);
  };

  const submit = async () => {
    if (photos.length < 2) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await sendScan({
        establishment,
        location,
        inspector,
        photos
      });
      sessionStorage.setItem("scanResult", JSON.stringify(response));
      navigate("/result");
    } catch (error) {
      setMessage(error.message || "Could not connect to backend.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div><span className="eyebrow">NEW INSPECTION</span><h1>Scan Product</h1><p>Capture evidence and prepare the POST /scan request.</p></div>
      </div>

      <div className="section-card">
        <h2>Inspection details</h2>
        <div className="form-grid">
          <label>Establishment Name *<input value={establishment} onChange={e => setEstablishment(e.target.value)} placeholder="Enter establishment name" /></label>
          <label>Location *<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location" /></label>
          <label>Inspector Name *<input value={inspector} onChange={e => setInspector(e.target.value)} placeholder="Enter your name" /></label>
          <label>Inspection Type<select><option>Routine Inspection</option><option>Complaint-based</option><option>Market Surveillance</option></select></label>
        </div>
      </div>

      <div className="section-card">
        <div className="section-title"><div><h2>Product evidence</h2><p>Minimum 2 photos required • Add additional photos as needed.</p></div><span className="photo-count">{photos.length} photos</span></div>

        {!cameraOpen ? (
          <button className="camera-launch" onClick={startCamera}>📷 Open Live Camera</button>
        ) : (
          <div className="camera-wrap">
            <video ref={videoRef} autoPlay playsInline />
            <div className="camera-frame" />
            <span className="live-pill">● LIVE</span>
            <div className="camera-controls">
              <button onClick={switchCamera}>↻ Switch</button>
              <button className="capture-btn" onClick={capture}>●</button>
              <button onClick={stopCamera}>■ Stop</button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} hidden />

        <div className="or"><span>OR</span></div>
        <UploadBox onFiles={addFiles} />

        {photos.length > 0 && (
          <div className="photo-section">
            <div className="section-title"><h3>Added photos</h3><button className="link-btn" onClick={() => document.querySelector('input[type=file]')?.click()}>＋ Add More Photo</button></div>
            <div className="photo-grid">
              {photos.map((photo, i) => <PhotoCard key={i} photo={photo} index={i} onType={changeType} onRemove={removePhoto} />)}
            </div>
          </div>
        )}

        <div className="requirement">
          <div><strong>Upload readiness</strong><p>{photos.length < 2 ? `Add ${2 - photos.length} more photo${2 - photos.length === 1 ? "" : "s"} to continue.` : "Minimum photo requirement met. Ready to send."}</p></div>
          <div className="mini-progress"><div style={{ width: `${Math.min(100, photos.length * 50)}%` }} /></div>
        </div>

        {message && <div className="error">{message}</div>}
        {busy ? <LoadingState text="Sending product evidence to backend…" /> : (
          <div className="actions"><button className="primary-btn" disabled={photos.length < 2 || !establishment || !location || !inspector} onClick={submit}>Send to Backend →</button></div>
        )}
      </div>
    </div>
  );
}