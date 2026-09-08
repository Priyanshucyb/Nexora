// Backend contract for Day 1.
// Change only API_BASE_URL when the backend teammate gives the real URL.

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function sendScan({ establishment, location, inspector, photos }) {
  const formData = new FormData();
  formData.append("establishment_name", establishment);
  formData.append("location", location);
  formData.append("inspector_name", inspector);

  photos.forEach((item, index) => {
    formData.append("photos", item.file, item.file.name);
    formData.append("photo_types", item.type);
    formData.append("photo_indexes", String(index + 1));
  });

  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    let message = "Backend request failed.";
    try {
      const body = await response.json();
      message = body.detail || body.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}